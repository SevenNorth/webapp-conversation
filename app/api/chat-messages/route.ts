import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
    user: userId,
  } = body
  const { user } = getInfo(request, userId)
  const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)
  return new Response(res.data as any)
}
