// pages/launchPages/travel/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().format("yyyy-MM-dd"),
    startdate: new Date().format("yyyy-MM-dd"),
    hasWorks:['有派工','无派工'],
    hasWorkIndex:0,
    place:'',
    traffics:['铁路','公路','飞机'],
    trafficIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  bindDateChange:function(e){
      this.setData({
        date: e.detail.value
      })
  },

  bindWorkChange: function (e) {
    this.setData({
      hasWorkIndex: e.detail.value
    })
  },
  placeChange:function(e){
    this.setData({
      place:e.detail.value
    })
  },
  binTrafficChange:function(e){
    this.setData({
      trafficIndex: e.detail.value
    })
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