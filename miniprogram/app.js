const config = require('./config');

App({
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: config.cloudEnvId,
        traceUser: true
      });
    }
  },
  globalData: {
    cart: []
  }
});
