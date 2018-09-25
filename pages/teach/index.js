// pages/teach/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valid:'获取验证码',
    items: [
        { 'as': [1,2,3,4] }, 
        { 'as': [1,2,3]}
      ]
  },


  bindValidChange:function(){

    let that = this;
    let max_time = 60;
    this.timer = setInterval(function () {
      that.setData({
        valid: max_time,
      })
      --max_time;
      if (max_time == 0) {
        clearInterval(that.timer);
        that.setData({
          codeTitle: '获取验证码',
        })
      }
    }, 1000)
    // this.setData({
    //   valid:'60'
    // })
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