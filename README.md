# CodeMasterHub 前端项目

CodeMasterHub是一个现代化的在线编程学习平台，提供丰富的课程资源和学习工具。

## 技术栈

- Vue 3
- Vue Router
- Element Plus
- Vite

## 功能特性

- 用户认证
  - 登录/注册
  - 个人中心

- 课程系统
  - 课程列表展示
  - 课程详情页
  - 课程收藏功能
  - 个人收藏管理

- 其他功能
  - 教程中心
  - 问答社区
  - 求职信息
  - 在线直播
  - 编程词典
  - 技术资讯

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

## 项目结构

```
src/
  ├── api/          # API 接口
  ├── assets/       # 静态资源
  ├── components/   # 公共组件
  ├── layouts/      # 布局组件
  ├── router/       # 路由配置
  ├── utils/        # 工具函数
  ├── views/        # 页面组件
  ├── App.vue      # 根组件
  └── main.js      # 入口文件
```

## API 接口

### 课程相关接口

- 获取课程列表：`POST /api/course/list`
- 获取课程详情：`GET /api/course/{id}`
- 获取收藏课程：`GET /api/course/favorite/all`
- 获取收藏ID列表：`GET /api/course/favorite/ids`
- 收藏/取消收藏：`POST /api/course/favorite/like/{id}`

## 开发团队

- 前端开发团队

## 注意事项

1. 确保后端API服务已启动并正常运行
2. 默认后端接口地址为：`http://localhost:9901`
3. 开发时请遵循项目的代码规范和提交规范

## License

[MIT](LICENSE)
