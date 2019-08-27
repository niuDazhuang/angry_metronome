// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "",
    avatarUrl: "",
    growValue: 2000,
    restaurant: "oppo茶饮",
    tabIndex: 0,
    member: [
      {name: 'oppo茶饮', rank: '金牌会员', grow: 2000, points: 1000},
      {name: '大牛小牛', rank: '钻石会员', grow: 5000, points: 5000},
      {name: '金威源餐饮', rank: '银牌会员', grow: 1000, points: 500}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
        })
      }
    })
  },
  bitphone:function(){
    wx.makePhoneCall({
      phoneNumber: '1340000' 
    })
  },
  goLog () {
    wx.navigateTo({url: '/pages/logs/logs'})
  },
  onTabTap (e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({tabIndex})
  }
})