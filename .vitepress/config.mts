import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "zh-Hans",
  title: "OPC商业化变现宝典",
  description: "快速打破产品0付费的魔咒",
  srcDir: "docs",
  outDir: "dist",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "开始阅读", link: "/about" },
      {
        text: "音频原版",
        link: "https://www.ximalaya.com/album/130136639",
      },
    ],
    sidebar: [
      {
        text: "本书简介",
        link: "/about",
      },
      {
        text: "第一篇：认知与产品",
        collapsed: false,
        items: [
          { text: "E01 OPC本质", link: "/lectures/e01" },
          { text: "E02 最小可赚钱产品", link: "/lectures/e02" },
          { text: "E03 知识套利", link: "/lectures/e03" },
          { text: "E04 定价权", link: "/lectures/e04" },
          { text: "E05 复利资产", link: "/lectures/e05" },
        ],
      },
      {
        text: "第二篇：增长与转化",
        collapsed: false,
        items: [
          { text: "E06 私域飞轮", link: "/lectures/e06" },
          { text: "E07 一千个铁粉", link: "/lectures/e07" },
          { text: "E08 杠杆思维", link: "/lectures/e08" },
          { text: "E09 渠道产品匹配", link: "/lectures/e09" },
          { text: "E10 转化漏斗", link: "/lectures/e10" },
        ],
      },
      {
        text: "第三篇：资产与生产力",
        collapsed: false,
        items: [
          { text: "E11 复购引擎", link: "/lectures/e11" },
          { text: "E12 个人品牌杠杆", link: "/lectures/e12" },
          { text: "E13 AI生产力倍增", link: "/lectures/e13" },
          { text: "E14 选品思维", link: "/lectures/e14" },
          { text: "E15 冷启动", link: "/lectures/e15" },
        ],
      },
      {
        text: "第四篇：规模化与飞轮",
        collapsed: false,
        items: [
          { text: "E16 时间定价", link: "/lectures/e16" },
          { text: "E17 反脆弱设计", link: "/lectures/e17" },
          { text: "E18 合作杠杆", link: "/lectures/e18" },
          { text: "E19 退出与规模化", link: "/lectures/e19" },
          { text: "E20 OPC飞轮", link: "/lectures/e20" },
        ],
      },
    ],
    socialLinks: [],
    search: {
      provider: "local",
      options: {},
    },
    footer: {
      copyright: "Copyright © 2026 AI启辰",
    },
    outline: {
      label: "本页导航",
      level: "deep",
    },
    docFooter: {
      prev: "上一讲",
      next: "下一讲",
    },
    darkModeSwitchLabel: "主题",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
  },
  vite: {},
});
