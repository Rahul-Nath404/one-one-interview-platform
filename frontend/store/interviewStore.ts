import { create } from 'zustand'

interface InterviewStore {
  currentInterviewId: string | null
  isInRoom: boolean
  setCurrentInterview: (id: string | null) => void
  setIsInRoom: (inRoom: boolean) => void
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  currentInterviewId: null,
  isInRoom: false,
  setCurrentInterview: (id) => set({ currentInterviewId: id }),
  setIsInRoom: (inRoom) => set({ isInRoom: inRoom }),
}))
