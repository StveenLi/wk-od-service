// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxUser:{}
  },
  logout:function(){
    wx.setStorage({
      key: 'user',
      data: null
    })
    wx.reLaunch({
      url: '/pages/login/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          user:res.data
        })
      },
    })
  },

  toReuse:function(){
    wx.navigateTo({
      url: '../reuse/reuse-main/index',
    })
  },

  toFeedback:function(){
    wx.navigateTo({
      url:'../feedback/index'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})