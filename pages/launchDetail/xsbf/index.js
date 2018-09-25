// pages/launchDetail/patch/index.js
const App = getApp();
const api = App.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup:false,
    commentVal:'',
    commentFilePaths:[],
    user:{},
    files:[],
  },

  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        let fis = [];
        for(let fi of result.visit.photoFiles){
          fis.push(fi.url);
        }
        if (result.success) {
          self.setData({
            orderDetail: result,
            files:fis
          })
        }
      }
    });
  },

  unLaunch:function(){
    let that = this;
    api._unLaunch(that.data.orderDetail.visit.links.id, that.unLaunchSuccessFunc);
  },

  unLaunchSuccessFunc(){
    wx.navigateBack({
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let item = JSON.parse(options.item);
    that.setData({
      oitem:item
    })
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
    });
    that.loadDetail(item)
  },
  toCommit:function(options){
    this.setData({
      showPopup:true
    })
  },
  textAreaChange:function(e){
    this.setData({
      commentVal:e.detail.value
    })
  },
  pathTo(e){
    let that = this;
    let flieUploadResult = JSON.parse(e.detail);
    let commentFilePaths = that.data.commentFilePaths
    commentFilePaths.push(flieUploadResult.url);
    that.setData({
      commentFilePaths: commentFilePaths
    })
  },
  subComment(e){
    let that = this;
    const { commentFilePaths, commentVal,user} = this.data
    api._submitComment(
      commentVal, 
      user.userId, 
      that.data.orderDetail.visit.pWrok.id, 
      that.data.orderDetail.visit.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess(){
    this.loadDetail(this.data.oitem)
  },
  delCommentImage(e) {
    let { commentFilePaths } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
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