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
  },

  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            orderDetail: result,
            oitem:item
          })
        }
      }
    });
  },

  unLaunch: function () {
    let that = this;
    api._unLaunch(that.data.orderDetail.patch.links.id, that.unLaunchSuccessFunc);
  },

  unLaunchSuccessFunc() {
    wx.navigateBack({

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let item = JSON.parse(options.item);
    that.loadDetail(item);
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
    this.setPatch();
  },

  setPatch: function () {
    let self = this;
    let item = this.data.listItem
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          let du_patches = [];
          let du_id = 0;
          let du_times = 0;
          let du_patch_children = [];

          for (let pa of result.patch) {
            if (result.patch.indexOf(pa) === 0) {
              du_id = pa.wId;
            }
            if (du_id == pa.wId) {
              du_patch_children.push(pa);
            }
            if (du_id != pa.wId) {
              du_patches.push(du_patch_children);
              du_patch_children = [];
              du_patch_children.push(pa);
              du_times++;
              du_id = pa.wId;
            }
            if (result.patch.indexOf(pa) === result.patch.length - 1) {
              du_patches.push(du_patch_children);
            }
          }

          self.setData({
            du_patchs: du_patches
          })
          this.setData({
            patch: result.patch
          })
        }
      }
    })
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
      that.data.orderDetail.patch.pWrok.id,
      that.data.orderDetail.patch.links.id, that.commentSuccess, commentFilePaths)
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