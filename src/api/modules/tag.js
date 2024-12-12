import { request } from '../../utils/request'

export const tagApi = {
  // 获取所有标签
  async getAllTags() {
    return request('/tag/all')
  }
} 