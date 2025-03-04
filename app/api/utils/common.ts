import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_KEY, API_URL, APP_ID } from '@/config'

const userPrefix = `user_${APP_ID}:`

export const getInfo = (request: NextRequest, userId: string) => {
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userId || (userPrefix + sessionId)
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

export const getParamsFromUrl = (url: string) => {
  // 创建一个 URL 对象
  const parsedUrl = new URL(url)

  // 使用 URLSearchParams 解析查询参数
  const params = new URLSearchParams(parsedUrl.search)

  // 将查询参数转换为一个对象
  const paramsObject: Record<string, string> = {}
  for (const [key, value] of params.entries())
    paramsObject[key] = value

  return paramsObject
}

export const client = new ChatClient(API_KEY, API_URL || undefined)
