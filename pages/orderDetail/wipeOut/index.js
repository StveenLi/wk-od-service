// pages/workOrder/wipeOut/index.js

const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().format('yyyy-MM-dd hh:mm:ss'),
    selectIndex: 0,
    typeSelect: ["类型A", "类型B", "类型C"],
    files: [],
    orderDetail: {},
    commentFilePaths: [],
    commentVal: '',
    remarks: '',
    glgq: '',
    p: '',
    qy: '',
    zx: '',
    other: '',
  },
  remarkChange: function(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  glgqChange: function(e) {
    this.setData({
      glgq: e.detail.value
    })
  },
  PChange: function(e) {
    this.setData({
      p: e.detail.value
    })
  },
  qyChange: function(e) {
    this.setData({
      qy: e.detail.value
    })
  },
  zxChange: function(e) {
    this.setData({
      zx: e.detail.value
    })
  },
  otherChange: function(e) {
    this.setData({
      other: e.detail.value
    })
  },

  loadDetail: function(item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            orderDetail: result,
          })
        }
        self._seeDoneChange();
      }
    });
  },


  lastSubmit: function(e) {
    let that = this;
    const {
      glgq,
      p,
      qy,
      zx,
      other,
    } = that.data;
    if(glgq =='' && p==''&&qy==''&&zx==''&&other==''){
      wx.showToast({
        title: '不能什么都不填写就提交',
        icon:'none',
        duration:2000
      })
      return;
    }
    //doUpdate
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        roadToll:glgq,
        postage:qy,
        parkToll:p,
        mileNum:zx,
        workLinkId: that.data.orderDetail.dWipe.links.id,
        stype: 'DWipe',
        id: that.data.orderDetail.dWipe.id
      },
      callback: (err, result) => {
        if (result.success) {
          console.log(result);
          //doSubmit
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.dWipe.pWrok.id,
              workId: that.data.listItem.id,
              status: 10,
              stype: 'DWipe',
            },
            callback: (err, result) => {
              console.log(result);
              if (result.success) {
                wx.navigateBack({
                  url: '/pages/work/index'
                })
              }
            }
          })
        }
      }
    })
  },

  _seeDoneChange: function() {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.found.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.found.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Found',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  bindSelectChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      selectIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          user: res.data
        })
      },
    });
    let item = JSON.parse(options.item);
    this.setData({
      listItem: JSON.parse(options.item)
    })
    this.loadDetail(item);
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
  toCommit: function(options) {
    this.setData({
      showPopup: true
    })
  },
  textAreaChange: function(e) {
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
    const {
      commentFilePaths,
      commentVal,
      user
    } = this.data
    api._submitComment(
      commentVal,
      user.userId,
      that.data.orderDetail.dWipe.pWrok.id,
      that.data.orderDetail.dWipe.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.listItem)
  },
  delCommentImage(e) {
    let {
      commentFilePaths
    } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
    })
  },
})