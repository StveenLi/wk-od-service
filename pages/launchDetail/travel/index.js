// pages/launchPages/travel/index.js

const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().format("yyyy-MM-dd"),
    startdate: new Date().format("yyyy-MM-dd"),
    enddate: new Date().format("yyyy-MM-dd"),
    hasWorks:['有派工','无派工'],
    hasWorkIndex:0,
    traffics:['铁路','公路','飞机'],
    trafficIndex:0,
    lives: ['否','是'],
    liveIndex:0,
    reason:'',
    user:{},
    myOrderList:[],
    myOrderListIndex:0,
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let item = JSON.parse(options.item);
    that.setData({
      listItem: item
    })
    that.loadDetail(item);

    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
        that.loadOrder();
      },
    });
  },


  unLaunch: function () {
    let that = this;
    api._unLaunch(that.data.orderDetail.travel.links.id, that.unLaunchSuccessFunc);
  },

  unLaunchSuccessFunc() {
    wx.navigateBack({

    })
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


  loadOrder:function(){
    let self = this;
    api.fetch({
      url: 'rest/work/findUserWorkList?userId='+self.data.user.userId,
      callback: (err, result) => {
        if (result.success) {
          console.log(result);
          this.setData({
            myOrderList:result.list
          })
        }
      }
    })
  },


  bindOrderChange:function(e){
    this.setData({
      myOrderListIndex: e.detail.value
    })
  },

  toOrderDetail:function(e){
    let that = this;
    let item = that.data.myOrderList[that.data.myOrderListIndex];
    let navigateUrl;
    if (item.workType == 'Repair') {
      navigateUrl = '/pages/orderDetail/fix/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Install') {
      navigateUrl = '/pages/orderDetail/install/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Inbox') {
      navigateUrl = '/pages/orderDetail/inStorageN/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Delivery') {
      navigateUrl = '/pages/orderDetail/logistics/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Found') {
      navigateUrl = '/pages/orderDetail/searched/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Outbox') {
      navigateUrl = '/pages/orderDetail/outStorage/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Dell') {
      navigateUrl = '/pages/orderDetail/remove/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'MoneyAsk') {
      navigateUrl = '/pages/orderDetail/moneyAsk/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Patch') {
      navigateUrl = '/pages/orderDetail/parts/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'DWipe') {
      navigateUrl = '/pages/orderDetail/wipeOut/index?item=' + JSON.stringify(item);
    }else{
      wx.showToast({
        title: '暂时缺失此工单详情，请联系管理员。',
        icon:'none',
        duration:2000
      })
      return;
    }
    // let navigateUrl = '/pages/orderDetail/fix/index?item=' + JSON.stringify(that.data.orderDetail.workDto);
    wx.navigateTo({
      url: navigateUrl,
    })
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

  reasonChange: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },
  binTrafficChange:function(e){
    this.setData({
      trafficIndex: e.detail.value
    })
  },

  binLiveChange: function (e) {
    this.setData({
      liveIndex: e.detail.value
    })
  },
  bindStartDateChange:function(e){
    this.setData({
      startdate:e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    this.setData({
      enddate: e.detail.value
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
      that.data.orderDetail.travel.pWrok.id,
      that.data.orderDetail.travel.links.id, that.commentSuccess, commentFilePaths)
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