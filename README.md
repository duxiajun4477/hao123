# InfoVault 信息金库 🛡️

个人信息安全管理工具 — 支持网站/账号密码、虚拟钱包、证件信息、安全笔记、收藏夹管理。

## ✨ 特性

- **🏠 全类型管理** — 密码、钱包、证件、笔记、收藏，一站式管理
- **🔍 全局搜索** — 跨所有类型全文搜索（支持中文分词），`Ctrl+K` 快速调起
- **🔐 端到端加密** — AES-256-GCM 加密，同步到 GitHub 时数据安全
- **🔄 多设备同步** — 通过 GitHub 私有仓库自动同步，免费不限设备
- **📱 响应式设计** — 桌面端 + 移动端双版本，深色科技蓝主题
- **🎲 密码生成器** — 内置强密码生成器，实时强度评估
- **💾 本地优先** — IndexedDB 本地存储，离线可用

## 🚀 快速开始

### 桌面端

直接打开 `info-vault-desktop/index.html` 即可使用。

> 推荐使用 VS Code 的 Live Server 或任何静态服务器运行。

### 移动端

在手机浏览器打开 `info-vault-mobile/index.html`。

### 配置同步（可选）

1. 创建一个 GitHub 私有仓库（免费）
2. 生成 Personal Access Token：GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 勾选 `repo` 权限
3. 在 InfoVault 设置中填入 Token 和仓库地址

## 🏗️ 项目结构

```
info-vault/                  # 共享资源
├── colors_and_type.css      # 设计系统（品牌色、间距、字体）
├── js/
│   ├── db.js                # IndexedDB 数据库层
│   ├── search.js            # 全文搜索引擎
│   ├── crypto.js            # 加密/密码生成/强度评估
│   └── sync.js              # GitHub 同步引擎

info-vault-desktop/          # 桌面端 SPA
├── index.html               # 主入口
├── js/desktop.js            # 桌面端应用逻辑（62+ 方法）

info-vault-mobile/           # 移动端 SPA
├── index.html               # 主入口
├── js/mobile.js             # 移动端应用逻辑
```

## 📦 数据模型

| 类型 | 说明 | 关键字段 |
|------|------|---------|
| `password` | 网站账号 | name, url, username, password, category |
| `wallet` | 虚拟钱包 | name, platform, accountName, balance, currency |
| `identity` | 证件 | realName, idNumber, identityType, issuingAuthority |
| `note` | 安全笔记 | title, content, tags |
| `bookmark` | 收藏夹 | url, title, description, tags |

## 🔒 安全说明

- 所有数据存储在浏览器本地 IndexedDB 中
- 同步到 GitHub 时使用 AES-256-GCM 加密
- 主密码用于加密同步数据
- 建议开启浏览器同步功能作为额外备份

## 📸 截图

桌面端：侧边栏导航 + 内容区 + 顶部搜索/同步
移动端：底部 Tab 导航 + 底部弹出表单

## 🧰 技术栈

- 纯原生 JavaScript (ES2022+)
- IndexedDB 本地存储
- Web Crypto API (AES-256-GCM)
- GitHub REST API v3
- CSS 自定义属性设计系统
- 零外部依赖
