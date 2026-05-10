# Ray社区 — 潮流穿搭分享平台

> Vue 3 + TypeScript + Element Plus + Pinia 全栈前端项目

## 项目简介

Ray社区是一个面向年轻用户的潮流穿搭分享与服饰电商平台。用户可以浏览商品、查看穿搭分享、加入购物车、升级会员，支持中英文切换和亮暗主题。

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API + `<script setup>` |
| TypeScript | 全量类型覆盖 |
| Vite | 极速构建工具 |
| Element Plus | 企业级 UI 组件库 |
| Pinia | Vue 3 官方状态管理 |
| Vue Router 4 | 路由 + 导航守卫 |
| Axios | HTTP 请求封装 |
| JSON Server | 本地 Mock REST API |
| CSS Variables | 主题/字号动态切换 |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（Vite + JSON Server 并行）
npm run dev

# 3. 打开浏览器访问
# http://localhost:3000
```

## 功能模块

| 路由 | 功能 | 说明 |
|------|------|------|
| `/` | 首页 | Banner轮播、分类导航、热门推荐、社区预览 |
| `/shop` | 商品列表 | 分类筛选、多维度排序、搜索 |
| `/shop/:id` | 商品详情 | 颜色/尺码选择、收藏、加入购物车 |
| `/cart` | 购物车 | 数量修改、总价计算、删除 |
| `/community` | 穿搭社区 | Feed流、点赞、加载更多 |
| `/community/post` | 发布穿搭 | 图片+文字+标签（需登录） |
| `/login` | 登录 | 手机号登录 |
| `/register` | 注册 | 用户注册 |
| `/profile` | 个人中心 | 用户信息、功能入口（需登录） |
| `/profile/collections` | 我的收藏 | 已收藏商品展示（需登录） |
| `/member` | 会员中心 | 等级展示、权益对比、升级 |
| `/settings` | 设置 | 语言、主题、字号切换 |

## 项目结构

```
src/
├── api/          # API 请求层（Axios 封装 + 各模块接口）
├── components/   # 公共组件（布局/通用/会员）
├── composables/  # 逻辑复用（useAuth/useTheme/useI18n）
├── i18n/         # 中英文语言包
├── router/       # 路由配置 + 导航守卫
├── stores/       # Pinia 状态管理
├── styles/       # CSS 变量/主题/全局样式
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数（格式化/存储）
└── views/        # 页面视图
```

## 技术亮点

1. **完整 TypeScript 类型系统** — 所有接口、组件 Props、API 返回值均有类型约束
2. **主题系统** — CSS Variables 驱动，亮/暗切换瞬间生效且持久化
3. **国际化** — Pinia 驱动的响应式 i18n，无需第三方库
4. **导航守卫** — 未登录拦截 + 登录后回跳，已登录自动跳过登录页
5. **购物车** — 完整增删改查 + localStorage 持久化
6. **会员体系** — 三级会员（普通/银卡/金卡），权益对比表，升级流程
7. **Loading/Empty/Error 三态覆盖** — 骨架屏组件 + 空状态组件 + 错误提示
8. **并行数据请求** — 首页 4 个 API `Promise.all` 并发加载
