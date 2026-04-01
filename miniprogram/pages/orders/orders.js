const api = require('../../utils/api');

Page({
  data: {
    orders: []
  },

  onShow() {
    this.fetchOrders();
  },

  async fetchOrders() {
    try {
      const res = await api.getOrders();
      this.setData({ orders: res.data || [] });
    } catch (error) {
      wx.showToast({ title: '订单获取失败', icon: 'none' });
    }
  }
});
