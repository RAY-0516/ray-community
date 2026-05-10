import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页' },
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('@/views/shop/ProductList.vue'),
      meta: { title: '商城' },
    },
    {
      path: '/shop/:id',
      name: 'product-detail',
      component: () => import('@/views/shop/ProductDetail.vue'),
      meta: { title: '商品详情' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/Cart.vue'),
      meta: { title: '购物车' },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/community/Feed.vue'),
      meta: { title: '穿搭社区' },
    },
    {
      path: '/community/post',
      name: 'post-create',
      component: () => import('@/views/community/PostCreate.vue'),
      meta: { title: '发布穿搭', requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/user/Login.vue'),
      meta: { title: '登录', guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/user/Register.vue'),
      meta: { title: '注册', guestOnly: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/user/Profile.vue'),
      meta: { title: '个人中心', requiresAuth: true },
    },
    {
      path: '/profile/collections',
      name: 'collections',
      component: () => import('@/views/user/Collections.vue'),
      meta: { title: '我的收藏', requiresAuth: true },
    },
    {
      path: '/member',
      name: 'member',
      component: () => import('@/views/member/MemberCenter.vue'),
      meta: { title: '会员中心' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { title: '设置' },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/Search.vue'),
      meta: { title: '搜索' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/Orders.vue'),
      meta: { title: '我的订单', requiresAuth: true },
    },
  ],
})

// 导航守卫
router.beforeEach((to, _from, next) => {
  document.title = `Ray社区 - ${to.meta.title ?? ''}`

  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 暂存目标路由，登录后跳转
    ElMessage.warning('请先登录')
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.guestOnly && userStore.isLoggedIn) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
