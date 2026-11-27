# JMU AIR LAB · 集美大学无人机科创实验室

这是集美大学无人机科创实验室的网站。Astro 提供实验室介绍与公开项目目录，Starlight 承载工程知识库。[网站首页](https://boomboomfly.github.io/) · [公开项目](https://boomboomfly.github.io/#projects) · [BoomBoomFly GitHub 组织](https://github.com/BoomBoomFly)

## 本地开发

使用 Node.js LTS（最低 22.23.4）。在本目录运行以下命令。

```sh
npm install --no-package-lock
npm run dev
```

`npm run build` 生成 `dist/`，`npm run preview` 预览构建。GitHub Pages 在推送 `main` 后从本仓库构建和部署。[部署配置](.github/workflows/deploy-pages.yml)

## 更新知识库

在相邻私有仓库 `knowledge-base/40_发布/` 中编辑公开源稿（标记为 `visibility: public` 且状态为 `ready` 或 `published`），并将合格正文及引用的 `_附件/` 图片同步到本站。手写知识库入口与同步正文共用 `src/content/docs/knowledge/`，图片位于 `public/images/generated/`。

站点固定跳转维护在 [Astro 配置](astro.config.mjs)。
