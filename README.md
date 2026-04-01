# 微信点奶茶全栈小程序

这是一个可运行的示例项目，包含：

- `miniprogram/`：微信小程序前端（菜单、购物车、订单页）
- `backend/`：Node.js 原生 HTTP 后端（菜单接口、下单接口、订单接口、微信登录换取 openid）

## 你提供的环境信息（已接入）

- API 公网域名（HTTPS）：`https://1483abb4.r19.vip.cpolar.cn`
- 微信云开发环境 ID：`wxd6d37edecab159ac`
- 小程序密钥（AppSecret）：**仅可放后端环境变量，不可写入小程序前端代码**

## 1. 启动后端

先配置环境变量：

```bash
cd backend
cp .env.example .env
```

然后在 `.env` 中填写：

```env
WECHAT_APP_ID=你的小程序AppID
WECHAT_APP_SECRET=你的小程序AppSecret
PORT=3000
```

> 注意：本项目不会在前端存储 `AppSecret`，避免密钥泄漏。

运行服务：

```bash
cd backend
export WECHAT_APP_ID="你的AppID"
export WECHAT_APP_SECRET="你的AppSecret"
npm start
```

健康检查：`GET http://127.0.0.1:3000/health`

## 2. 运行小程序

1. 打开微信开发者工具。
2. 选择 `miniprogram/` 目录导入项目。
3. 在「开发设置」配置 request 合法域名为：`https://1483abb4.r19.vip.cpolar.cn`。
4. 项目中 `miniprogram/config.js` 已配置：
   - `apiBaseUrls = [https://1483abb4.r19.vip.cpolar.cn, http://127.0.0.1:3000]`（按顺序自动重试）
   - `cloudEnvId = wxd6d37edecab159ac`

## 3. API 说明

### GET `/api/teas`
获取奶茶菜单。

### POST `/api/orders`
创建订单。

请求体示例：

```json
{
  "customerName": "小王",
  "pickupTime": "18:30",
  "items": [
    {
      "id": "mt-001",
      "name": "珍珠奶茶",
      "price": 16,
      "quantity": 2
    }
  ]
}
```

### GET `/api/orders`
获取订单列表。

### POST `/api/wechat/code2session`
小程序 `wx.login` 获取 `code` 后，后端调用微信接口换取 `openid/session_key`。

请求体：

```json
{
  "code": "wx.login返回的code"
}
```


## 4. 菜单加载不出来的排查

1. 先在浏览器打开 `https://1483abb4.r19.vip.cpolar.cn/api/teas`，确认隧道在线。
2. 如果隧道不在线，小程序会自动回退到 `http://127.0.0.1:3000`。
3. 确认本地后端已运行：

```bash
cd backend
npm start
```

4. 微信开发者工具里查看 Network，检查请求是否被合法域名拦截。
