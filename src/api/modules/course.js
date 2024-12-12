import { request } from '../../utils/request'

export const courseApi = {
  // 获取课程列表
  async getCourseList(params) {
    return request('/course/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
  },
  
  // 获取课程详情
  async getCourseDetail(id) {
    return request(`/course/${id}`, {
      method: 'GET'
    })
  },

  // 获取收藏的课程ID列表
  async getFavoriteIds() {
    return request('/course/favorite/ids', {
      method: 'GET'
    })
  },

  // 收藏/取消收藏课程
  async toggleFavorite(id) {
    return request(`/course/favorite/like/${id}`, {
      method: 'POST'
    })
  },

  // 获取用户收藏的所有课程
  async getFavoriteCourses() {
    return request('/course/favorite/all', {
      method: 'GET'
    })
  }
} 