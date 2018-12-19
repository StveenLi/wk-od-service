// pages/workOrder/install/index.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const App = getApp();
const api = App.api;
var content = null;
var touchs = [];
var canvasw = 0;
var canvash = 0;

//获取系统信息
wx.getSystemInfo({
    success: function(res) {
      canvasw = res.windowWidth;
      canvash = canvasw * 9 / 16;
    },
  }),


  Page({

    /**
     * 页面的初始数据
     */
    data: {
      date: new Date().format("yyyy-MM-dd hh:mm:ss"),
      files: [],
      contentList: [],
      signImage: '',
      inSign: {},
      nowAddress: '',
      outAddress: '',
      listItem: {},
      remarks: '',
      orderDetail: {},
      signImg:'',
      showPopup:false,
      user:{},
      commentVal:'',
      commentFilePaths:[]
    },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
    toCommit:function(){
      this.setData({
        showPopup: !this.data.showPopup
      });
    },
  textAreaChange:function(e){
    this.setData({
      commentVal: e.detail.value
    })
  },
  togglePopup_false:function(){
    this.setData({
      showPopup: !this.data.showPopup,
      commentVal: ''
    });
  },
    togglePopup:function(){
      let that = this;
      if (that.data.commentVal == ''){
        wx.showToast({
          title: '请输入评论内容再评论！',
          duration:'2000',
          icon:'none'
        })
        return;
      }
      api.fetch({
        url:'rest/work/doAddComment',
        data: {
          commentContent: that.data.commentVal,
          userId:that.data.user.userId,
          workId:that.data.orderDetail.intall.pWrok.id,
          workLinkId:that.data.orderDetail.intall.links.id
        },
        callback: (err, result) => {
          if (result.success) {
            console.log(result);
            this.setData({
              showPopup: !this.data.showPopup,
              commentVal:''
            });
            that.loadDetail(that.data.listItem)
          }
        }
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
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
            user:res.data
          })
        },
      });
    },
    loadDetail: function(item) {
      let self = this;
      api.fetch({
        url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
        callback: (err, result) => {
          if (result.success) {
            let fis = [];
            for (let img of result.intall.photoFiles){
              fis.push(img.url);
            }
            self.setData({
              orderDetail: result,
              files:fis
            })
          }
        }
      });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

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
        that.data.orderDetail.intall.pWrok.id,
        that.data.orderDetail.intall.links.id, that.commentSuccess, commentFilePaths)
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