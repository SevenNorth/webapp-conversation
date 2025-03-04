import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, getParamsFromUrl, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { user: userId } = getParamsFromUrl(request.url)
  const { sessionId, user } = getInfo(request, userId)
  try {
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  }
  catch (error) {
    return NextResponse.json([])
  }
}
