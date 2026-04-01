const api = require('../../utils/api');

const fallbackMenu = [
  {
    id: 'mt-001',
    name: '珍珠奶茶',
    description: '经典红茶奶香，搭配Q弹黑糖珍珠',
    price: 16,
    image: 'https://dummyimage.com/240x240/f4e8d8/4a3c2f&text=Pearl+Milk+Tea'
  },
  {
    id: 'mt-002',
    name: '杨枝甘露',
    description: '芒果西柚风味，清爽不腻',
    price: 20,
    image: 'https://dummyimage.com/240x240/fcebc3/4a3c2f&text=Mango+Pomelo'
  },
  {
    id: 'mt-003',
    name: '抹茶鲜奶',
    description: '宇治抹茶与鲜奶融合，茶香浓郁',
    price: 18,
    image: 'https://dummyimage.com/240x240/e1f1d9/2d4d2f&text=Matcha+Milk'
  }
];

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
      const message = api.parseFriendlyError(error);
      this.setData({ menu: fallbackMenu });
      wx.showToast({ title: `菜单加载失败，已切换本地菜单`, icon: 'none' });
      console.error('fetch menu failed:', message, error);
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
