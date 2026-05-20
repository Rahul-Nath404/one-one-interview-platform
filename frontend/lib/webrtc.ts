import SimplePeer from 'simple-peer'

export interface WebRTCConfig {
  iceServers: RTCIceServer[]
  offerOptions?: RTCOfferOptions
  answerOptions?: RTCAnswerOptions
}

export interface Participant {
  id: string
  peer: SimplePeer.Instance
  stream?: MediaStream
}

const defaultConfig: WebRTCConfig = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302'] },
    { urls: ['stun:stun1.l.google.com:19302'] },
    { urls: ['stun:stun2.l.google.com:19302'] },
  ],
}

export class WebRTCManager {
  private localStream: MediaStream | null = null
  private participants: Map<string, Participant> = new Map()
  private config: WebRTCConfig

  constructor(config: Partial<WebRTCConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  async getLocalStream(
    constraints: MediaStreamConstraints = {
      audio: true,
      video: { width: 1280, height: 720 },
    }
  ): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      return this.localStream
    } catch (error) {
      console.error('Failed to get local stream:', error)
      throw error
    }
  }

  createPeer(initiator: boolean, stream: MediaStream): SimplePeer.Instance {
    const peer = new SimplePeer({
      initiator,
      stream,
      config: {
        iceServers: this.config.iceServers,
      },
    })

    return peer
  }

  addParticipant(id: string, peer: SimplePeer.Instance): void {
    this.participants.set(id, { id, peer })
  }

  removeParticipant(id: string): void {
    const participant = this.participants.get(id)
    if (participant) {
      participant.peer.destroy()
      this.participants.delete(id)
    }
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values())
  }

  getParticipant(id: string): Participant | undefined {
    return this.participants.get(id)
  }

  async stopLocalStream(): Promise<void> {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
  }

  async switchAudio(enabled: boolean): Promise<void> {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  async switchVideo(enabled: boolean): Promise<void> {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  getLocalStream_(): MediaStream | null {
    return this.localStream
  }
}
