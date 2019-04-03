// pages/workOrder/moneyAsk/index.js

const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    remarks:'',
    listItem:[],
    user:{},
    commentVal:'',
    commentFilePaths:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
    });
    let item = JSON.parse(options.item);
    this.setData({
      listItem: item
    })
    this.loadDetail(item);
    
  },
  remarkChange: function (e) {
    this.setData({
      remarks: e.detail.value
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
          self._seeDoneChange()
        }
      }
    });
  },

  _seeDoneChange: function () {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.moneyAsk.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.moneyAsk.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'MoneyAsk',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
  },


  lastSubmit: function (e) {
    let that = this;
    //doUpdate
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        remarks: that.data.remarks,
        workLinkId: that.data.orderDetail.moneyAsk.links.id,
        stype: 'MoneyAsk',
        id: that.data.orderDetail.moneyAsk.id
      },
      callback: (err, result) => {
        console.log(result);
        //doSubmit
        api.fetch({
          url: 'rest/work/doSubmit',
          data: {
            bigWorkOrderId: that.data.orderDetail.moneyAsk.pWrok.id,
            workId: that.data.listItem.id,
            status: 10,
            stype: 'MoneyAsk',
          },
          callback: (err, result) => {
            if (result.success) {
              wx.redirectTo({
                url: '../../work/index?listType=workOrder',
              })
            }
          }
        })
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
      that.data.orderDetail.moneyAsk.pWrok.id,
      that.data.orderDetail.moneyAsk.links.id, that.commentSuccess, commentFilePaths)
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