// pages/workNode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps:[
    
    ],
    workOrderData:{}
  },

  _flowBind(e){
    let self = this;
    if(e.detail.dataset.item.text==='签到'){
      wx.navigateTo({
        url: '../locationSign/index',
      })
    }
    else if (e.detail.dataset.item.text.indexOf('填写')>-1){
      wx.navigateTo({
        url: self.data.workOrderData.navigateUrl,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options)
    this.setData({
      workOrderData:JSON.parse(options.item),
      steps: [{
        // 此步骤是否当前完成状态
        current: false,
        // 此步骤是否已经完成
        done: true,
        // 此步骤显示文案
        text: '签到',
        // 此步骤描述语
        desc: '10.01'
      },
      {
        done: true,
        current: true,
        text: '填写' + JSON.parse(options.item).name,
        desc: '10.02'
      },
      {
        done: false,
        current: false,
        text: '签出',
        desc: '10.03'
      }]
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