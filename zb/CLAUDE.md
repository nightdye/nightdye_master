# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 模块概述

QQ装扮工具 (zb) - NightDye 项目的子模块，用于查询和设置 QQ 会员装扮。

## 目录结构

```
zb/
├── index.html          # 主页面（选项卡式界面）
├── css/styles.css      # 全局样式（暗色主题 + 青色调）
└── ../../js/zb/script.js  # 前端脚本（相对路径引用）
```

## 技术栈

- 前端: 原生 JavaScript + jQuery + Select2
- 后端: PHP (server_php/zb_nightdye_cn/api/)
- 数据库: MySQL (qqzb 数据库)

## 功能模块

| 选项卡 | 功能 | Cookie类型 |
|--------|------|-----------|
| 编号查询 | 查询装扮信息和购买历史 | 会员CK |
| 装扮库 | 浏览和搜索装扮列表 | - |
| 装扮设置 | 设置各类装扮（等级图标、钻石、徽章等） | 会员CK/空间CK |
| Cookie管理 | 保存和测试 Cookie | - |

## API 配置

前端 API 地址定义在 `js/zb/script.js`:
```javascript
const API_URL = 'http://172.21.195.78:3182/api/index.php';
const ITEMS_API = 'http://172.21.195.78:3182/api/items.php';
```

## Cookie 类型区分

需要空间CK的功能（定义在 `QZONE_ACTIONS`）:
- setLevelTitle (等级称号)
- setYellowDiamond (黄钻图标)
- setCoupleStyle (情侣钻石样式)
- setCardNameplate (集卡铭牌)

其他功能使用会员CK。

## 后端 API 端点

**index.php** - 主 API:
| Action | 描述 |
|--------|------|
| queryInfo | 查询装扮编号信息 |
| queryBuy | 查询购买历史 |
| testCookie | 测试 Cookie 有效性 |
| set* | 各类装扮设置接口 |

**items.php** - 装扮库 API:
| Action | 描述 |
|--------|------|
| list | 分页获取装扮列表 |
| categories | 获取分类统计 |
| search | 搜索装扮 |

## 数据库表

`zb_items` - 装扮数据表:
- category: 装扮类型
- item_id: 装扮ID
- name: 名称
- image_url: 预览图URL
- status: 状态

## 关键函数

**script.js**:
- `apiCall(action, data)` - 统一 API 请求封装
- `getCookieForAction(action)` - 根据功能自动选择 Cookie 类型
- `buildParams(type, id, extra)` - 构建不同设置类型的请求参数
- `Library` 对象 - 装扮库的分页、搜索、筛选逻辑

**index.php**:
- `calculateGTK($p_skey)` - 计算 QQ GTK 签名
- `extractPSkey($cookie)` - 从 Cookie 提取 p_skey
- `extractUin($cookie)` - 从 Cookie 提取 QQ 号

## 图片预览 URL 模式

装扮预览图 CDN 地址模式（定义在 `IMAGE_URLS`）:
```
https://tianquan.gtimg.cn/{类型}/item/{ID}/{后缀}
```

## 语言要求

所有代码注释和用户提示使用中文。
