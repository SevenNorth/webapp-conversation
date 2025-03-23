import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: '健康管家',
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
export const APP_MODE_OPTIONS = [
  { label: '健康咨询', value: 'consultation' },
  { label: '智能导诊', value: 'guide' },
]
