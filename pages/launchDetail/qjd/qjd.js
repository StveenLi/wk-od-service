// pages/launchDetail/patch/index.js
const App = getApp();
const api = App.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
    user: {},
    hiderevoke:'',
    files: [],
  },

  unLaunch: function () {
    let that = this;
    api._unLaunch(that.data.orderDetail.leave.links.id, that.unLaunchSuccessFunc);
  },

  unLaunchSuccessFunc() {
    wx.navigateBack({

    })
  },
  loadDetail: function (item) {
    console.log(item)
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        let fis = [];
        for (let fi of result.leave.photoFiles) {
          fis.push(fi.url);
        }
        if (result.success) {
          self.setData({
            orderDetail: result,
            files: fis
          })
        }
      }
    });
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
     let that = this;
    let item = JSON.parse(options.item);
    that.loadDetail(item);
      this.setData({
        oitem: item,
        hiderevoke:item.workStatus
      })
    
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
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
      that.data.orderDetail.leave.pWrok.id,
      that.data.orderDetail.leave.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.oitem)
  },
  delCommentImage(e) {
    let { commentFilePaths } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
    })
  }
})