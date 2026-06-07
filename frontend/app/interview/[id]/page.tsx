'use client'

import { InterviewRoom } from '@/components/InterviewRoom'

export default function InterviewRoomPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  return <InterviewRoom roomId={id} />
}
