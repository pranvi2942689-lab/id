const api = require('../../utils/api');

Page({
  data: {
    menu: [],
    cartCount: 0
  },

  onShow() {
    const app = getApp();
    this.setData({
      cartCount: app.globalData.cart.reduce((sum, item) => sum + item.quantity, 0)
    });
  },

  onLoad() {
    this.fetchMenu();
  },

  async fetchMenu() {
    try {
      const res = await api.getMenu();
      this.setData({ menu: res.data || [] });
    } catch (error) {
      wx.showToast({ title: '菜单加载失败', icon: 'none' });
    }
  },

  addToCart(e) {
    const incoming = e.currentTarget.dataset.item;
    const app = getApp();
    const cart = [...app.globalData.cart];
    const exists = cart.find((item) => item.id === incoming.id);

    if (exists) {
      exists.quantity += 1;
    } else {
      cart.push({ ...incoming, quantity: 1 });
    }

    app.globalData.cart = cart;

    this.setData({
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    });

    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  toCart() {
    wx.navigateTo({ url: '/pages/cart/cart' });
  }
});
