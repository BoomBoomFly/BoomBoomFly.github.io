# BoomBoomFly 网站

本目录是无人机科创实验室的公开网站仓库。第一阶段实现包含 Astro 首页、Starlight 知识层、已经批准的航空冷银视觉体系，以及研究方向、项目、团队、加入我们和实验室背景等稳定的公开路由。

## 本地开发

```bash
npm install
npm run dev
npm run check
npm run build
```

浏览器质量检查位于 `tests/browser/`，覆盖公开路由、导航与主题行为、Starlight 控件、响应式状态、自动化无障碍检查和截图证据。

## 内容边界

私有的 `knowledge-base/` 是唯一的编辑来源。受信任的本地导出器只读取 `knowledge-base/40_发布/`，并且只导出包含以下元数据的笔记：

- `visibility: public`
- `status: ready` or `status: published`

合格笔记还必须通过元数据、附件、链接、路由和敏感信息检查。公开副本只能单向进入本仓库，绝不能反向写回知识库。

## 公开 CI 边界

公开 CI 必须：

1. 只检出 `website` 仓库。
2. 不得接收访问私有知识库的凭据，也不得克隆、获取、挂载或读取私有知识库。
3. 只验证已经提交到本仓库的公开内容、生成文件所有权、链接、路由、构建输出和其他产物。
4. 遇到无效或缺失的公开产物时必须失败，不得静默跳过。

因此，私有源内容的筛选和导出只能在受信任的本地工作区完成；公开产物经过审核后才能提交到本仓库。

## 发布生成路径

- `src/content/docs/knowledge/legacy/`：由 Starlight 加载的公开文本生成内容。
- `public/images/generated/`：生成的公开附件副本。
- `generated-content-manifest.json`：记录所有权、哈希、路由和重定向的清单。
- `tools/content-policy.json`：机器可读的发布约定。
- `tools/validate-generated.mjs`：只在网站仓库内验证已提交公开产物的工具。

已经审核的旧版归档内容已启用生成发布。在本仓库运行 `npm run validate:content`，即可在不读取私有知识库的情况下验证已提交的公开副本。
