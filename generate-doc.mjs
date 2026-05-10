import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, convertInchesToTwip } from 'docx'
import * as fs from 'fs'

// === 辅助函数 ===
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: 22, ...opts })],
  })
}

function heading(text, level) {
  return new Paragraph({
    heading: HeadingLevel[`HEADING_${level}`],
    spacing: { before: level === 1 ? 360 : 240, after: 160 },
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: level === 1 ? 36 : level === 2 ? 28 : 24, bold: true, color: level === 1 ? 'FF6B35' : '1A1A2E' })],
  })
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: 21 })],
  })
}

function table(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, i) => new TableRow({
      children: row.map((cell) => new TableCell({
        shading: i === 0 ? { type: ShadingType.SOLID, color: 'FFF0E8' } : undefined,
        children: [new Paragraph({
          spacing: { after: 0 },
          children: [new TextRun({ text: String(cell), font: 'Microsoft YaHei', size: 20, bold: i === 0, color: i === 0 ? 'FF6B35' : '1A1A2E' })],
        })],
      })),
    })),
  })
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    border: { bottom: { color: 'FF6B35', size: 6, style: BorderStyle.SINGLE } },
    children: [new TextRun({ text, font: 'Microsoft YaHei', size: 30, bold: true, color: 'FF6B35' })],
  })
}

// === 文档内容 ===
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Microsoft YaHei', size: 22 },
      },
    },
  },
  sections: [{
    children: [
      // 封面
      new Paragraph({ spacing: { before: 2400 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Ray社区', font: 'Microsoft YaHei', size: 56, bold: true, color: 'FF6B35' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: '潮流穿搭分享平台 — 技术亮点文档', font: 'Microsoft YaHei', size: 32, color: '7B2FBE' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Vue 3 + TypeScript + Element Plus + Pinia', font: 'Microsoft YaHei', size: 24, color: '6B6B80' })],
      }),
      new Paragraph({ spacing: { before: 600 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '面试用途 · 技术深度展示', font: 'Microsoft YaHei', size: 22, color: 'A0A0B0' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: '2026年5月', font: 'Microsoft YaHei', size: 22, color: 'A0A0B0' })],

      }),

      // 一、项目概述
      sectionTitle('一、项目概述'),
      p('Ray社区是一个从零搭建的潮流穿搭分享与服饰电商平台。项目涵盖商品浏览、详情查看、购物车管理、穿搭社区Feed流、会员体系、评论互动、订单管理等完整业务闭环，支持中英文切换和亮暗主题。'),
      p('开发周期：2-3 天 | 代码量：40+ 模块文件 | TypeScript 零编译错误 | 16 个功能页面'),
      table([
        ['维度', '内容'],
        ['项目类型', '穿搭分享 + 服饰电商社区平台'],
        ['技术栈', 'Vue 3 + TypeScript + Vite + Element Plus + Pinia + Vue Router 4 + Axios'],
        ['Mock方案', 'JSON Server 本地 REST API，支持 GET/POST/PATCH/DELETE'],
        ['设计风格', '潮流撞色（活力橙 #FF6B35 + 电光紫 #7B2FBE + 柠檬黄 #FFD166）'],
        ['功能页面', '首页、商品列表、商品详情、购物车、社区Feed、发布穿搭、登录注册、个人中心、收藏、会员中心、设置、搜索、订单'],
      ]),

      // 二、架构设计
      sectionTitle('二、架构设计'),
      heading('2.1 分层架构', 2),
      p('项目采用清晰的分层架构，遵循单向数据流和关注点分离原则：'),
      table([
        ['层级', '职责', '技术实现'],
        ['View 层', '页面视图，用户交互', 'Vue 3 SFC + Element Plus'],
        ['Component 层', '可复用组件（布局/通用/业务）', 'Props/Emits/Slots 模式'],
        ['Composable 层', '逻辑复用 hooks', 'useAuth / useTheme / useI18n'],
        ['Store 层', '全局状态管理', 'Pinia Setup Store'],
        ['API 层', 'HTTP 请求封装', 'Axios 拦截器 + 类型化接口'],
        ['Mock 层', '本地 REST API', 'JSON Server (端口 3001)'],
      ]),
      heading('2.2 目录结构', 2),
      p('src/ 下划分为 api、components、composables、i18n、router、stores、styles、types、utils、views 十个模块，每个模块职责单一、边界清晰，便于理解和测试。'),

      // 三、核心技术实现
      sectionTitle('三、核心技术实现'),
      heading('3.1 CSS Variables 主题系统', 2),
      p('支持亮/暗色 + 小/中/大字号 + 中/英文三个维度的独立切换，切换瞬间生效并持久化到 localStorage。'),
      bullet('所有样式变量定义在 :root 选择器，html.dark 覆盖暗色变量'),
      bullet('字号通过 JavaScript 直接设置 html.style.fontSize 和 Element Plus 的 --el-font-size-* 系列 CSS 变量'),
      bullet('themeStore.applyTheme() 一次性同步 DOM class、fontSize、Element Plus 变量和 localStorage'),
      p('优势：纯 CSS 驱动颜色切换，零 JS 运行时开销；组件通过 var(--color-primary) 引用，无需 props 层层传递。'),

      heading('3.2 自研轻量国际化方案', 2),
      p('未引入 vue-i18n（体量大、配置重），基于 Pinia computed 实现响应式国际化。'),
      bullet('语言包定义为 TypeScript 对象（zh-CN.ts / en-US.ts），自动补全翻译 key'),
      bullet('themeStore.t 是一个 computed，根据 locale 返回当前语言包'),
      bullet('Vue 响应式自动追踪，切换语言后全页面瞬间更新'),
      p('优势：零额外依赖，TypeScript 类型安全，切换响应式即时生效。'),

      heading('3.3 路由导航守卫', 2),
      p('实现完整的页面访问控制：'),
      bullet('未登录访问需认证页面 → ElMessage 提示 + 暂存目标路由到 query.redirect → 登录后自动回跳'),
      bullet('已登录访问登录/注册页 → 重定向首页，避免重复登录'),
      bullet('meta.requiresAuth 和 meta.guestOnly 标记声明式权限控制'),
      p('16 条路由全部使用动态 import() 懒加载，Vite 自动代码分割。'),

      heading('3.4 购物车状态管理', 2),
      p('完整的购物车增删改查，关键设计如下：'),
      bullet('商品按 productId + color + size 组合作为唯一标识，避免重复添加'),
      bullet('totalPrice 和 totalCount 使用 Pinia computed 自动计算'),
      bullet('所有变更通过 persist() 写入 localStorage，刷新不丢失'),
      bullet('数量修改和删除操作即时反馈，结算一键生成订单跳转订单页'),
      bullet('总价计算做了 NaN 安全防护（Number() 强制转换 + isFinite 检查）'),

      heading('3.5 会员体系', 2),
      p('三级会员（普通/银卡/金卡）完整权益对比和升级流程：'),
      bullet('memberStore.higherLevels 自动计算当前等级可升级的目标等级'),
      bullet('权益对比表格展示三个等级的全部权益覆盖'),
      bullet('升级操作通过 JSON Server PATCH 持久化，会员折扣立即生效'),
      bullet('商品详情页和购物车实时显示会员折扣价'),

      heading('3.6 评论系统', 2),
      p('社区帖子支持评论浏览和发布：'),
      bullet('按需加载评论（toggle 展开），减少初始请求量'),
      bullet('commentMap 记录已加载的评论缓存，避免重复请求'),
      bullet('发表评论后即时更新评论数和列表，乐观 UI 策略'),

      // 四、性能优化
      sectionTitle('四、性能优化'),
      bullet('并发请求：首页 4 个 API（Banner/热门/新品/社区）通过 Promise.all 并发发起，减少总等待时间'),
      bullet('路由懒加载：16 个页面全部使用 () => import() 动态导入，首屏只加载当前页面 JS'),
      bullet('骨架屏：LoadingSkeleton 组件支持 card/list/detail 三种模式，shimmer 动画提升感知性能'),
      bullet('页面过渡：Vue <transition> fade 动画，路由级统一管理，切换柔和'),
      bullet('图片懒加载：<img loading="lazy"> 浏览器原生延迟加载'),
      bullet('Vite 原生 ESM 开发：启动 < 300ms，HMR 热更新极速响应'),

      // 五、工程化实践
      sectionTitle('五、工程化实践'),
      heading('5.1 TypeScript 全量覆盖', 2),
      bullet('API 返回值类型化：request.get<Product[]>()'),
      bullet('组件 Props 和 Emits 类型约束'),
      bullet('Store state 类型从泛型自动推导'),
      bullet('工具函数的泛型封装：getStorage<T>(key, fallback)'),

      heading('5.2 组件设计模式', 2),
      bullet('插槽模式：EmptyState 通过 <slot> 暴露操作按钮和文案，父组件完全控制行为'),
      bullet('组合式函数：useAuth / useTheme 封装常用操作，降低组件耦合'),
      bullet('条件渲染守卫：发布穿搭等敏感操作先调用 requireAuth() 鉴权'),

      heading('5.3 三态覆盖', 2),
      bullet('Loading 状态：骨架屏组件（card/list/detail 三种布局）'),
      bullet('Empty 状态：统一空状态组件，支持自定义文案和操作按钮'),
      bullet('Error 状态：Axios 拦截器统一 ElMessage.error 提示，try-catch 兜底'),

      heading('5.4 错误处理', 2),
      bullet('Axios 响应拦截器统一捕获 HTTP 错误，ElMessage.error 提示'),
      bullet('网络异常时不影响页面正常渲染'),
      bullet('收藏操作乐观更新：先改 UI 再发请求，失败时自动回滚'),
      bullet('购物车结算：金额计算 NaN 安全防护'),

      // 六、技术决策
      sectionTitle('六、关键决策总结'),
      table([
        ['决策点', '选择方案', '原因'],
        ['状态管理', 'Pinia Setup Store', 'Vue 3 官方推荐，TypeScript 友好，自动解包'],
        ['国际化', '自研轻量方案', '无额外依赖，computed 响应式，类型安全'],
        ['主题系统', 'CSS Variables + JS', '颜色切换零 JS 开销，字号动态注入'],
        ['Mock 方案', 'JSON Server', '完整 REST API（GET/POST/PATCH/DELETE），模拟真实后端'],
        ['UI 库', 'Element Plus', 'Vue 3 生态最成熟，组件丰富，TS 支持好'],
        ['路由', '动态 import 懒加载', '天然代码分割，按需加载'],
        ['购物车持久化', 'localStorage + Pinia', '刷新不丢，无需后端，实时响应'],
        ['Pinia 响应式', 'store 直读(非解构)', '避免解构丢失响应式导致 UI 不更新'],
      ]),

      // 七、功能清单
      sectionTitle('七、完整功能清单'),
      table([
        ['模块', '路由', '关键功能', '状态'],
        ['首页', '/', 'Banner轮播 + 分类导航 + 热门推荐 + 社区预览 + 并发加载', '✅'],
        ['商品列表', '/shop', '分类筛选 + 多维度排序 + 关键词搜索 + URL同步', '✅'],
        ['商品详情', '/shop/:id', '颜色尺码选择 + 收藏 + 加入购物车 + 会员折扣', '✅'],
        ['购物车', '/cart', '增删改查 + 总价计算 + 数量修改 + localStorage持久化', '✅'],
        ['穿搭社区', '/community', 'Feed流 + 点赞 + 评论 + 加载更多', '✅'],
        ['发布穿搭', '/community/post', '图片+文字+标签 + 登录鉴权', '✅'],
        ['登录/注册', '/login /register', '手机号登录 + 路由守卫 + 登录回跳', '✅'],
        ['个人中心', '/profile', '用户信息 + 会员标识 + 功能入口 + 退出登录', '✅'],
        ['我的收藏', '/profile/collections', '已收藏商品列表 + 取消收藏', '✅'],
        ['会员中心', '/member', '等级展示 + 权益对比表 + 升级流程', '✅'],
        ['设置', '/settings', '中英文切换 + 亮暗主题 + 字号调节（即时生效）', '✅'],
        ['搜索', '/search', '商品+社区双搜 + 搜索结果展示', '✅'],
        ['订单', '/orders', '购物车结算 + 订单列表 + 状态标签 + 删除', '✅'],
        ['响应式', '全局', '移动端汉堡菜单 + 自适应网格 + 触屏友好', '✅'],
      ]),

      // 八、运行说明
      sectionTitle('八、项目运行'),
      p('环境要求：Node.js >= 18'),
      p('运行命令：'),
      p('npm install          # 安装依赖', { font: 'Consolas' }),
      p('npm run dev          # 启动 Vite (3000) + JSON Server (3001)', { font: 'Consolas' }),
      p('访问 http://localhost:3000 即可体验完整功能。'),
      p('TypeScript 编译检查：npx vue-tsc --noEmit（零错误通过）', { font: 'Consolas' }),

      new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: '— 感谢阅读 —', font: 'Microsoft YaHei', size: 22, color: 'A0A0B0' })] }),
    ],
  }],
})

// 生成文件
const buffer = await Packer.toBuffer(doc)
fs.writeFileSync('Ray社区-技术亮点文档.docx', buffer)
console.log('✅ 文档已生成: Ray社区-技术亮点文档.docx')
