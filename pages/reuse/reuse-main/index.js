// pages/reuse/reuse-main/index.js

const app = getApp();
const api = app.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["待寄回", "已寄回"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    parts:[],
    doneParts:[],
    chooseParts:[],
    showModal:false,
    expressNum:'',
    searchValue:''
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  inputTyping:function(e){
    this.setData({
      searchValue:e.detail.value
    })
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 70) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.getPartsData();
    that.getDonePartsData();
  },

  partsboxChange:function(e){
    this.setData({
      chooseParts: e.detail.value
    })
  },
  getPartsData:function(){
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        api.fetch({
          url: 'rest/wkuser/receive?applyUserId=' + res.data.userId+'&status=0',
          callback: (err, result) => {
            if (result.success) {
              that.setData({
                parts:result.list
              })
            }
          }
        })
      },
    })
  },

  getDonePartsData:function(){
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        api.fetch({
          url: 'rest/wkuser/receive?applyUserId=' + res.data.userId + '&status=10' +'&partName='+that.data.searchValue,
          callback: (err, result) => {
            if (result.success) {
              that.setData({
                doneParts: result.list
              })
            }
          }
        })
      },
    })
  },


  showDialogBtn:function(){
    const { chooseParts} = this.data
    if (chooseParts.length == 0){
      wx.showToast({
        title: '您还没有选择要寄回的零件!',
        duration:3000,
        icon:'none'
      })
      return;
    }
    this.setData({
      showModal:true
    })
  },

  expressChange:function(e){
    this.setData({
      expressNum:e.detail.value
    })
  },
  onCancel:function(e){
    this.setData({
      showModal:false
    })
  },
  onConfirm:function(e){
    let that = this;
    const { expressNum, chooseParts} = this.data
    if (expressNum==''){
      wx.showToast({
        title: '请输入正确的快递单号！',
        icon:'none',
        duration:2000
      })
      return;
    }
    let _ncps = '';
    for (let _ncp of chooseParts){
      _ncps += _ncp + ',';
    }

    _ncps.substr(0, _ncps.length-1)
    
    api.fetch({
      url:'rest/wkuser/doSendParts',
      data: { kdCode: expressNum, ids: _ncps.substr(0, _ncps.length - 1)},
      callback: (err, result) => {
        if (result.success) {
            that.setData({ showModal: false })
            that.getPartsData();
            that.getDonePartsData();
          } else {
            wx.showToast({
              title: res.msg,
              duration: 2000,
              icon: 'none'
            })
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

  }
})