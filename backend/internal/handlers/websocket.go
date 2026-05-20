package handlers

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gofiber/websocket/v2"
	"interviewos/internal/db"
	"interviewos/internal/models"
)

// Client represents a connected user in a room
type Client struct {
	Conn   *websocket.Conn
	UserID string
	Name   string
}

// Room represents a collection of connected clients for an interview
type Room struct {
	Clients map[string]*Client // Keyed by UserID
	Mutex   sync.Mutex
}

// Hub manages all active rooms and WebSocket connections
type Hub struct {
	Rooms map[string]*Room
	Mutex sync.Mutex
}

var RoomHub = &Hub{
	Rooms: make(map[string]*Room),
}

// WebSocketMessage defines the standard JSON payload structure
type WebSocketMessage struct {
	Type     string      `json:"type"`
	RoomID   string      `json:"roomId,omitempty"`
	UserID   string      `json:"userId,omitempty"`
	Name     string      `json:"name,omitempty"`
	TargetID string      `json:"targetId,omitempty"`
	SenderID string      `json:"senderId,omitempty"`
	Signal   interface{} `json:"signal,omitempty"`
	Message  string      `json:"message,omitempty"`
	Code     string      `json:"code,omitempty"`
	Language string      `json:"language,omitempty"`
}

// WebSocketHandler manages WebSocket lifecycles
func WebSocketHandler(c *websocket.Conn) {
	roomId := c.Params("roomId")
	userId := c.Query("userId")
	userName := c.Query("name")

	if roomId == "" || userId == "" {
		log.Println("WS: Missing roomId or userId")
		c.Close()
		return
	}

	client := &Client{
		Conn:   c,
		UserID: userId,
		Name:   userName,
	}

	// Add client to Hub
	RoomHub.RegisterClient(roomId, client)

	// Clean up on disconnect
	defer func() {
		RoomHub.UnregisterClient(roomId, userId)
		c.Close()
	}()

	log.Printf("WS: User %s (%s) joined room %s", userName, userId, roomId)

	// Send current code session if it exists
	var codeSession models.CodeSession
	if err := db.DB.Where("interview_id = ?", roomId).Order("updated_at desc").First(&codeSession).Error; err == nil {
		initialCodeMsg := WebSocketMessage{
			Type:     "code:update",
			Code:     codeSession.Code,
			Language: codeSession.Language,
		}
		if msgBytes, err := json.Marshal(initialCodeMsg); err == nil {
			c.WriteMessage(websocket.TextMessage, msgBytes)
		}
	}

	// Read messages loop
	for {
		_, msgBytes, err := c.ReadMessage()
		if err != nil {
			log.Printf("WS: Read error from user %s: %v", userId, err)
			break
		}

		var msg WebSocketMessage
		if err := json.Unmarshal(msgBytes, &msg); err != nil {
			log.Printf("WS: Error unmarshaling message: %v", err)
			continue
		}

		// Fill in sender info
		msg.SenderID = userId

		switch msg.Type {
		case "signal":
			// Forward signaling payload directly to the target peer
			RoomHub.ForwardMessage(roomId, msg.TargetID, msg)

		case "chat":
			// Broadcast chat message to all peers in the room
			RoomHub.BroadcastMessage(roomId, msg)

		case "code:update":
			// Persist code session
			go func(rId, code, lang string) {
				var session models.CodeSession
				if err := db.DB.Where("interview_id = ?", rId).First(&session).Error; err != nil {
					// Create new
					session = models.CodeSession{
						InterviewID: rId,
						Code:        code,
						Language:    lang,
					}
					db.DB.Create(&session)
				} else {
					// Update existing
					session.Code = code
					session.Language = lang
					db.DB.Save(&session)
				}
			}(roomId, msg.Code, msg.Language)

			// Broadcast updated code to other peers in the room
			RoomHub.BroadcastMessageExcept(roomId, userId, msg)
		}
	}
}

// RegisterClient adds a client to a room and notifies existing participants
func (h *Hub) RegisterClient(roomId string, client *Client) {
	h.Mutex.Lock()
	room, exists := h.Rooms[roomId]
	if !exists {
		room = &Room{
			Clients: make(map[string]*Client),
		}
		h.Rooms[roomId] = room
	}
	h.Mutex.Unlock()

	room.Mutex.Lock()
	// Notify other peers about the new client before adding it
	joinNotify := WebSocketMessage{
		Type:     "peer:joined",
		SenderID: client.UserID,
		Name:     client.Name,
	}
	notifyBytes, _ := json.Marshal(joinNotify)

	// Also list current peers in room to the joining client so they can initiate WebRTC peers
	var currentPeers []struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}

	for _, existingClient := range room.Clients {
		// Notify existing
		existingClient.Conn.WriteMessage(websocket.TextMessage, notifyBytes)

		// Collect peer
		currentPeers = append(currentPeers, struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		}{ID: existingClient.UserID, Name: existingClient.Name})
	}

	// Add new client
	room.Clients[client.UserID] = client
	room.Mutex.Unlock()

	// Send current peers list to newcomer
	peersListMsg := struct {
		Type  string `json:"type"`
		Peers []struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"peers"`
	}{
		Type:  "peers:list",
		Peers: currentPeers,
	}
	peersBytes, _ := json.Marshal(peersListMsg)
	client.Conn.WriteMessage(websocket.TextMessage, peersBytes)
}

// UnregisterClient removes client and alerts other participants
func (h *Hub) UnregisterClient(roomId string, userId string) {
	h.Mutex.Lock()
	room, exists := h.Rooms[roomId]
	h.Mutex.Unlock()

	if !exists {
		return
	}

	room.Mutex.Lock()
	_, clientExists := room.Clients[userId]
	if clientExists {
		delete(room.Clients, userId)
	}

	// If room is empty, clean it up
	if len(room.Clients) == 0 {
		h.Mutex.Lock()
		delete(h.Rooms, roomId)
		h.Mutex.Unlock()
	}
	room.Mutex.Unlock()

	if clientExists {
		// Notify others
		leaveNotify := WebSocketMessage{
			Type:     "peer:left",
			SenderID: userId,
		}
		notifyBytes, _ := json.Marshal(leaveNotify)

		room.Mutex.Lock()
		for _, remainingClient := range room.Clients {
			remainingClient.Conn.WriteMessage(websocket.TextMessage, notifyBytes)
		}
		room.Mutex.Unlock()
	}
}

// ForwardMessage routes message to target client
func (h *Hub) ForwardMessage(roomId string, targetId string, msg WebSocketMessage) {
	h.Mutex.Lock()
	room, exists := h.Rooms[roomId]
	h.Mutex.Unlock()

	if !exists {
		return
	}

	room.Mutex.Lock()
	target, exists := room.Clients[targetId]
	if exists {
		msgBytes, err := json.Marshal(msg)
		if err == nil {
			target.Conn.WriteMessage(websocket.TextMessage, msgBytes)
		}
	}
	room.Mutex.Unlock()
}

// BroadcastMessage sends message to all clients in a room
func (h *Hub) BroadcastMessage(roomId string, msg WebSocketMessage) {
	h.Mutex.Lock()
	room, exists := h.Rooms[roomId]
	h.Mutex.Unlock()

	if !exists {
		return
	}

	msgBytes, err := json.Marshal(msg)
	if err != nil {
		return
	}

	room.Mutex.Lock()
	for _, client := range room.Clients {
		client.Conn.WriteMessage(websocket.TextMessage, msgBytes)
	}
	room.Mutex.Unlock()
}

// BroadcastMessageExcept sends message to all clients in a room except the excluded client
func (h *Hub) BroadcastMessageExcept(roomId string, excludedUserId string, msg WebSocketMessage) {
	h.Mutex.Lock()
	room, exists := h.Rooms[roomId]
	h.Mutex.Unlock()

	if !exists {
		return
	}

	msgBytes, err := json.Marshal(msg)
	if err != nil {
		return
	}

	room.Mutex.Lock()
	for _, client := range room.Clients {
		if client.UserID != excludedUserId {
			client.Conn.WriteMessage(websocket.TextMessage, msgBytes)
		}
	}
	room.Mutex.Unlock()
}
