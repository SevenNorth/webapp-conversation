import type { AppInfo, IModeOpts } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: '津医卫',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans',
}

export const isShowPrompt = true
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48

// 显示模式切换
export const APP_SHOW_MODE_SWITCH = true
export const APP_INPUT_PARAMS_MODE_KEY = 'ms'
export const APP_MODE_OPTIONS: IModeOpts[] = [
  { label: '健康咨询', value: 'consultation', pushBotMsg: true, botMsg: 'AAA' },
  { label: '智能导诊', value: 'guide', pushBotMsg: true, botMsg: 'BBB' },
  { label: '就诊小结', value: 'summary', pushBotMsg: false, botMsg: 'summary', pushQuery: true, queryMsg: '查询就诊小结' },
]
