// pages/workOrder/searched/index.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:new Date().format('yyyy-MM-dd hh:mm:ss'),
    checkboxItems: [
      { name: '水压是否正常', value: '0' },
      { name: '空开容量满足全部电器负荷', value: '1' },
      { name: '楼梯电器和门的尺寸能否将机器搬运进现场', value: '2' },
      { name: '空开具备漏电保护功能', value: '3' },
    ],
    nowAddress: '',
    outAddress: '',
    selectIndex: 0,
    typeSelect: ["具备", "不具备"],
    isPhoneConfirm:false,
    remarks:'',
    showPopup: false,
    user: {},
    commentVal: '',
    commentFilePaths:[]
  },
  
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let item = JSON.parse(options.item);
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

  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            orderDetail: result,
          })
        }
      }
    });
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
  toCommit: function () {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
  textAreaChange: function (e) {
    this.setData({
      commentVal: e.detail.value
    })
  },
  togglePopup_false: function () {
    this.setData({
      showPopup: !this.data.showPopup,
      commentVal: ''
    });
  },
  togglePopup: function () {
    let that = this;
    if (that.data.commentVal == '') {
      wx.showToast({
        title: '请输入评论内容再评论！',
        duration: '2000',
        icon: 'none'
      })
      return;
    }
    api.fetch({
      url: 'rest/work/doAddComment',
      data: {
        commentContent: that.data.commentVal,
        userId: that.data.user.userId,
        workId: that.data.orderDetail.found.pWrok.id,
        workLinkId: that.data.orderDetail.found.links.id
      },
      callback: (err, result) => {
        if (result.success) {
          this.setData({
            showPopup: !this.data.showPopup,
            commentVal: ''
          });
          that.loadDetail(that.data.listItem)
        }
      }
    })
  },
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
      that.data.orderDetail.dell.pWrok.id,
      that.data.orderDetail.dell.links.id, that.commentSuccess, commentFilePaths)
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
  },
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
      that.data.orderDetail.found.pWrok.id,
      that.data.orderDetail.found.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.listItem)
    this.setData({
      commentVal: ''
    })
  },
  delCommentImage(e) {
    let { commentFilePaths } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
    })
  },
  popStatusChange(e) {
    this.setData({
      showPopup: e.detail
    })
  }
})