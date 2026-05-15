# 微信朋友圈 Hugo 主题

一个仿微信朋友圈风格的 Hugo 博客主题，支持文章、图片九宫格、音乐、视频、暗色模式等功能。

## 功能特性

- 📱 **仿微信朋友圈界面** - 还原微信朋友圈的视觉风格
- 🖼️ **图片九宫格** - 支持 1-9 张图片的网格布局
- 🎵 **音乐播放** - 支持音乐分享卡片，自动提取封面颜色
- 🎬 **视频播放** - 支持视频嵌入播放
- 🌙 **暗色模式** - 支持亮色/暗色主题切换
- 💬 **点赞/评论** - 仿微信风格的操作菜单
- 🖼️ **图片灯箱** - 点击图片放大查看，支持左右切换
- ⏰ **相对时间** - 显示"刚刚"、"5分钟前"等友好时间格式
- 📄 **分页加载** - 首页每次显示5篇，滚动加载更多
- 🔗 **链接卡片** - 支持分享链接的卡片样式
- 📍 **位置信息** - 支持显示发布位置

## 安装

1. 将主题文件夹复制到 Hugo 项目的 `themes/` 目录：
```bash
cp -r hugo-theme-wechat-moments your-site/themes/
```

2. 在 `hugo.toml` 中配置主题：
```toml
theme = "wechat-moments"
```

## 配置

在 `hugo.toml` 中添加以下配置：

```toml
[params]
  showTitle = false  # 是否显示文章标题，false 隐藏，true 显示（默认）
  [params.profile]
    sitename = "向晚朋友圈"      # 封面显示的网站名称
    nickname = "向晚"            # 文章列表显示的昵称
    signature = "个性签名"       # 个性签名
    avatar = "/images/avatar.jpeg"  # 头像图片路径
    cover = "/images/cover1.webp"   # 封面图片路径
    cover_dark = "/images/cover2.webp"  # 暗色模式封面（可选）
```

## 写文章

在 `content/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: 文章标题
date: 2024-01-01
location: "温州市·瓯江路"
images:
  - https://example.com/photo1.jpg
  - https://example.com/photo2.jpg
---

文章正文内容...
```

### 支持的参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题 | `今天天气真好` |
| `date` | 发布时间 | `2024-01-01` 或 `2024-01-01T14:30:00` |
| `location` | 发布位置 | `温州市·瓯江路` |
| `images` | 图片列表（1-9张） | `["https://...jpg"]` |
| `link` | 分享链接 | `https://example.com` |
| `linkTitle` | 链接标题 | `文章标题` |
| `linkImage` | 链接缩略图 | `/images/thumb.jpg` |
| `video` | 视频地址 | `/videos/demo.mp4` |
| `music` | 音乐信息 | 见下方示例 |

### 音乐卡片示例

```markdown
---
title: "分享一首歌"
date: 2024-01-01T14:30:00
music:
  title: "不要说话"
  artist: "陈奕迅"
  url: "http://music.163.com/song/media/outer/url?id=25906124.mp3"
  cover: "/images/music-cover.jpg"
---

这首歌很好听...
```

**效果：** 显示音乐播放卡片，左侧封面，右侧歌曲信息+播放按钮

### 视频示例

```markdown
---
title: "旅行记录"
date: 2024-01-01
video: "/videos/trip.mp4"
---

这次旅行很开心...
```

**效果：** 显示视频播放器，宽度 333px，保持原始比例

### 文字内容示例

```markdown
---
title: "今日感想"
date: 2024-01-01
location: "温州市·瓯江路"
---

这两年的工作中，我摸索出了一个方向：它有些模糊，但我知道那是正确的。

只是我始终未能看清自己的心意 —— 我要的，到底是什么？

每次有新的领悟出现，都像拨开一层迷雾...
```

**效果：** 纯文字朋友圈，显示位置

## 目录结构

```
hugo-theme-wechat-moments/
├── archetypes/
│   └── default.md          # 新文章模板
├── layouts/
│   ├── _default/
│   │   ├── baseof.html     # 基础模板（所有页面父模板）
│   │   ├── single.html     # 文章内页
│   │   ├── list.html       # 列表页
│   │   ├── category.html   # 分类页
│   │   ├── taxonomy.html   # 分类法模板
│   │   └── terms.html      # 分类列表
│   ├── categories/
│   │   └── list.html       # 分类列表页
│   ├── partials/
│   │   ├── moment.html     # 朋友圈文章卡片
│   │   ├── profile.html    # 封面+个人信息
│   │   ├── head.html       # HTML头部（meta、字体）
│   │   ├── header.html     # 页面头部
│   │   ├── footer.html     # 页面底部
│   │   ├── lightbox.html   # 图片灯箱
│   │   └── scripts.html    # JavaScript脚本
│   ├── index.html          # 主页
│   └── section.html        # 区块页
└── static/
    ├── css/style.css       # 样式表
    └── js/main.js          # JavaScript脚本
```
https://my-moments.pages.dev/posts/2026-05-15-first/ #文章内页
## 部署

```bash
# 生成静态文件
hugo --minify

# 部署到 GitHub Pages
# 将 public/ 目录推送到 gh-pages 分支
```

## 许可证

MIT License
