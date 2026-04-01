module.exports = {
  // 小程序会按顺序尝试这些地址，直到请求成功。
  // 生产环境优先使用 HTTPS 公网域名；本地开发可回退到 localhost。
  apiBaseUrls: [
    'https://1483abb4.r19.vip.cpolar.cn',
    'http://127.0.0.1:3000'
  ],

  // 固定微信云开发环境 ID
  cloudEnvId: 'wxd6d37edecab159ac'
};
