// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    activeIndex: 0,
    toView: 'a0',
    scrollTop: 100,
    screenWidth: 667,
    showModalStatus: false,
    currentType: 0,
    currentIndex: 0,
    sizeIndex: 0,
    sugarIndex: 0,
    temIndex: 0,
    sugar: ['常规糖', '无糖', '微糖', '半糖', '多糖'],
    tem: ['常规冰', '多冰', '少冰', '去冰', '温', '热'],
    size: ['常规', '珍珠', '西米露'],
    cartList: [],
    scrollArr: [],
    sumMonney: 0,
    cupNumber:0,
    showCart: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sysinfo = wx.getSystemInfoSync().windowHeight;
    console.log(sysinfo)
    wx.showLoading({
      title: '努力加载中',
    })
    //将本来的后台换成了easy-mock 的接口，所有数据一次请求完 略大。。
    wx.request({
      url: 'https://easy-mock.com/mock/59abab95e0dc66334199cc5f/coco/aa',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        let scrollArr = [0];
        //动态计算联动节点
        for (let i = 0; i < res.data.length; i++) {
          scrollArr.push(scrollArr[i] + 73 * res.data[i].foods.length + 18)
        }
        that.setData({
          listData: res.data,
          loading: true
        })
      }
    })
  },
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      activeIndex: index,
      toView: 'a' + index,
      // scrollTop: 1186
    })
    console.log(this.data.toView);
  },
  scroll: function (e) {
    var dis = e.detail.scrollTop
    for (let i = 0; i < this.data.scrollArr.length; i++) {
      if (i < this.data.scrollArr.length - 1) {
        if (dis > this.data.scrollArr[i] && dis < this.data.scrollArr[i + 1]) {
          console.log(i)
          this.setData({
            activeIndex: i,
          })
          break;
        }
      } else {
        this.setData({
          activeIndex: this.data.scrollArr.length - 1,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  selectInfo: function (e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    this.setData({
      showModalStatus: !this.data.showModalStatus,
      currentType: type,
      currentIndex: index,
      sizeIndex: 0,
      sugarIndex: 0,
      temIndex: 0
    });
  },

  chooseSE: function (e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({
        sizeIndex: index
      });
    }
    if (type == 1) {
      this.setData({
        sugarIndex: index
      });
    }
    if (type == 2) {
      this.setData({
        temIndex: index
      });
    }
  },

  addToCart: function () {
    var a = this.data
    var addItem = {
      "name": a.listData[a.currentType].foods[a.currentIndex].name,
      "price": a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price,
      "detail": a.size[a.sizeIndex] + "+" + a.sugar[a.sugarIndex] + "+" + a.tem[a.temIndex],
      "number": 1,
      "sum": a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price,
    }
    var sumMonney = a.sumMonney + a.listData[a.currentType].foods[a.currentIndex].specfoods[0].price;
    var cartList = this.data.cartList;
    cartList.push(addItem);
    this.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: a.cupNumber + 1
    });
    console.log(this.data.cartList)
  },
  showCartList: function () {
    console.log(this.data.showCart)
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }

  },
  clearCartList: function () {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0
    });
  },
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;
    cartList[index].number++;
    var sum = this.data.sumMonney + cartList[index].price;
    cartList[index].sum += cartList[index].price;

    this.setData({
      cartList: cartList,
      sumMonney: sum,
      cupNumber: this.data.cupNumber+1
    });
  },
  decNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var cartList = this.data.cartList;

    var sum = this.data.sumMonney - cartList[index].price;
    cartList[index].sum -= cartList[index].price;
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber-1
    });
  },
  goBalance: function () {
    if (this.data.sumMonney != 0) {
      wx.setStorageSync('cartList', this.data.cartList);
      wx.setStorageSync('sumMonney', this.data.sumMonney);
      wx.setStorageSync('cupNumber', this.data.cupNumber);
      wx.navigateTo({
        url: '../order/balance/balance'
      })
    }
  }
})