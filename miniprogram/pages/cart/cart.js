const api = require('../../utils/api');

Page({
  data: {
    cart: [],
    customerName: '',
    pickupTime: '',
    totalPrice: 0
  },

  onShow() {
    this.refreshCart();
  },

  refreshCart() {
    const app = getApp();
    const cart = app.globalData.cart || [];
    this.setData({
      cart,
      totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    });
  },

  onNameChange(e) {
    this.setData({ customerName: e.detail.value });
  },

  onTimeChange(e) {
    this.setData({ pickupTime: e.detail.value });
  },

  decrease(e) {
    const id = e.currentTarget.dataset.id;
    const app = getApp();
    const cart = (app.globalData.cart || [])
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
      .filter((item) => item.quantity > 0);

    app.globalData.cart = cart;
    this.refreshCart();
  },

  async submitOrder() {
    const { customerName, pickupTime, cart } = this.data;
    if (!customerName || !pickupTime || cart.length === 0) {
      wx.showToast({ title: '请完善下单信息', icon: 'none' });
      return;
    }

    try {
      await api.createOrder({ customerName, pickupTime, items: cart });
      getApp().globalData.cart = [];
      this.setData({ customerName: '', pickupTime: '' });
      this.refreshCart();
      wx.showToast({ title: '下单成功', icon: 'success' });
    } catch (error) {
      wx.showToast({ title: '下单失败', icon: 'none' });
    }
  },

  toOrders() {
    wx.navigateTo({ url: '/pages/orders/orders' });
  }
});
