// pages/workOrder/parts/index.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    showPopup: false,
    commentVal: ''
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
  lastSubmit:function(){
    let that = this;
    api.fetch({
      url: 'rest/work/doSubmit',
      data: {
        bigWorkOrderId: that.data.orderDetail.patch.pWrok.id,
        workId: that.data.listItem.id,
        status: 10,
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
        workId: that.data.orderDetail.patch.pWrok.id,
        workLinkId: that.data.orderDetail.patch.links.id
      },
      callback: (err, result) => {
        if (result.success) {
          console.log(result);
          this.setData({
            showPopup: !this.data.showPopup,
            commentVal: ''
          });
          that.loadDetail(that.data.listItem)
        }
      }
    })
  },
})