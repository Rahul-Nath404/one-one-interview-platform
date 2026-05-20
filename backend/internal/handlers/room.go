package handlers

import (
	"github.com/gofiber/fiber/v2"
	"interviewos/internal/db"
	"interviewos/internal/models"
)

type JoinRoomRequest struct {
	RoomID   string `json:"roomId"`
	Password string `json:"password"`
}

func GetRoom(c *fiber.Ctx) error {
	roomId := c.Params("id")

	var room models.InterviewRoom
	if err := db.DB.Preload("Interview").First(&room, "id = ?", roomId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "room not found",
		})
	}

	return c.JSON(room)
}

func JoinRoom(c *fiber.Ctx) error {
	var req JoinRoomRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "invalid request body",
		})
	}

	var room models.InterviewRoom
	if err := db.DB.First(&room, "id = ?", req.RoomID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "room not found",
		})
	}

	// Verify password
	if room.Password != req.Password {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "invalid room password",
		})
	}

	// Load interview
	var interview models.Interview
	db.DB.First(&interview, "id = ?", room.InterviewID)

	// Update interview status
	interview.Status = "in-progress"
	db.DB.Save(&interview)

	room.Interview = &interview

	return c.JSON(room)
}

func LeaveRoom(c *fiber.Ctx) error {
	roomId := c.Params("id")

	var room models.InterviewRoom
	if err := db.DB.First(&room, "id = ?", roomId).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "room not found",
		})
	}

	// Update interview status
	var interview models.Interview
	if err := db.DB.First(&interview, "id = ?", room.InterviewID).Error; err == nil {
		interview.Status = "completed"
		db.DB.Save(&interview)
	}

	return c.JSON(fiber.Map{
		"message": "left room successfully",
	})
}
