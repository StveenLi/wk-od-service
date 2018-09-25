// pages/launchPages/wxby/index.js

const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:new Date().format('yyyy-MM-dd'),
    inputShowed: false,
    inputVal: '',
    inputSearch: true,
    user:{},
    remarks:'',
    cc:[],
    finalVal: [],
    currentItem:{},
    pValue:'',
    mobileValue:'',
    faultValue:''
  },
  finalSub:function(){
    let that = this;
    api.fetch({
      url: 'rest/work/doMaintain',
      data: {
        projectId: that.data.currentItem.projectId,
        etcTime:that.data.date,
        remarks: that.data.remarks,
        userId:that.data.user.userId,
        faultDetail: that.data.faultValue,
        machineType: that.data.currentItem.machineType,
        customer: that.data.currentItem.name,
        wrCode: that.data.currentItem.wrCode,
        contacts: that.data.pValue,
        phone:that.data.mobileValue
      },
      callback: (err, result) => {
        if (result.success) {
          // console.log(resutl)
          wx.navigateBack({
            url:'../../launch/index'
          })
        }
      }
    });
  },
  faultChange:function(e){
    this.setData({
      faultVal:e.detail.value
    })
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    let that = this;
    this.setData({
      inputVal: e.detail.value,
      inputSearch: true
    });
    // this.getMachineOption(self.data.orderDetail.outbox.stockId, e.detail.value)
    this.getOption(e.detail.value,that.data.user.userId);
  },

  getOption: function (ccName, lsSaler) {
    let self = this;
    api.fetch({
      url: 'rest/comment/getUserProjects?ccName=' + ccName + '&lsSaler=' + lsSaler,
      callback: (err, result) => {
        if (result.success) {
          let cc = [];
          for (let item of result.list) {
            cc.push(item.name);
          }
          self.setData({
            cc: cc,
            resultList: result.list
          })
        }
      }
    })
  },
  itemOptionClick: function (e) {
    this.setData({
      inputVal: e.currentTarget.dataset.item.name,
      inputSearch: false,
      currentItem: e.currentTarget.dataset.item
    });
  },

  pChange:function(e){
    this.setData({
      pValue: e.detail.value
    })
  },

  mobileChange:function(e){
    this.setData({
      mobileValue: e.detail.value
    })
  },
  faultChange:function(e){
    this.setData({
      faultValue:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          user:res.data
        })
      },
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