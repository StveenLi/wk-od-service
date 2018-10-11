// pages/workOrder/parts/index.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    commentVal: '',
    commentFilePaths: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let item = JSON.parse(options.item);
    console.log(item);
    this.setData({
      listItem: JSON.parse(options.item)
    })
    this.loadDetail(item);
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
    });
  },

  toFix:function(){
    let that = this;
    let navigateUrl = '/pages/orderDetail/fix/index?item=' + JSON.stringify(that.data.orderDetail.workDto);
    wx.navigateTo({
      url: navigateUrl,
    })
  },

  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            orderDetail: result
          })
        }
      }
    });
  },
  lastSubmit_no:function(){
    this.lastSubmit(12)
  },
  lastSubmit:function(status_no){
    let that = this;
    let status;
    if (status_no==12){
      status = 12;
    }else{
      that.data.user.type == 2 ? status = 8 : status = 10;
    }
    api.fetch({
      url: 'rest/work/doSubmit',
      data: {
        bigWorkOrderId: that.data.orderDetail.patch.pWrok.id,
        workId: that.data.listItem.id,
        status: status,
        stype: 'patch'
      },
      callback: (err, result) => {
        console.log(result);
        if (result.success) {
          wx.navigateBack({
            url: '/pages/work/index'
          });
        }
      }
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
  
  },
  //评论组件
  toCommit: function (options) {
    this.setData({
      showPopup: true
    })
  },
  textAreaChange: function (e) {
    this.setData({
      commentVal: e.detail.value
    })
  },
  pathTo(e) {
    let that = this;
    let flieUploadResult = JSON.parse(e.detail);
    let commentFilePaths = that.data.commentFilePaths
    commentFilePaths.push(flieUploadResult.url);
    that.setData({
      commentFilePaths: commentFilePaths
    })
  },
  subComment(e) {
    let that = this;
    const { commentFilePaths, commentVal, user } = this.data
    api._submitComment(
      commentVal,
      user.userId,
      that.data.orderDetail.patch.pWrok.id,
      that.data.orderDetail.patch.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.listItem)
  },
  delCommentImage(e) {
    let { commentFilePaths } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
    })
  }
})