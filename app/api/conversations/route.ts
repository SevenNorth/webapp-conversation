import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, getParamsFromUrl, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { user: userId } = getParamsFromUrl(request.url)
  const { sessionId, user } = getInfo(request, userId)
  try {
    const { data }: any = await client.getConversations(user)
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    })
  }
  catch (error: any) {
    return NextResponse.json({
      data: [],
      error: error.message,
    })
  }
}
