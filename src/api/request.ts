import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import mockAdapter from './mock-adapter'

const isProd = import.meta.env.PROD

const request: AxiosInstance = axios.create({
  baseURL: isProd ? '' : 'http://localhost:3001',
  timeout: 8000,
  ...(isProd ? { adapter: mockAdapter as any } : {}),
})

request.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const msg = (error.response?.data as { message?: string })?.message ?? '网络请求失败，请稍后重试'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default request
