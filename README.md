# 微信点奶茶全栈小程序

这是一个可运行的示例项目，包含：

- `miniprogram/`：微信小程序前端（菜单、购物车、订单页）
- `backend/`：Node.js 原生 HTTP 后端（菜单接口、下单接口、订单接口）

## 1. 启动后端

```bash
cd backend
npm start
```

默认端口：`3000`

健康检查：`GET http://127.0.0.1:3000/health`

## 2. 运行小程序

1. 打开微信开发者工具。
2. 选择 `miniprogram/` 目录导入项目。
3. 在「详情 -> 本地设置」里勾选不校验合法域名（开发环境）。
4. 确保后端在本机 `127.0.0.1:3000` 运行。

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
