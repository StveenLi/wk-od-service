// pages/workOrder/fix/index.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listItem:{},
    orderDetail:{},
    contentList:[],
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    isPhoneFix:false,
    getParts:false,
    files:[],
    remarks:'',
    showPopup: false,
    user: {},
    commentVal: '',
    upVideoArr:[],
    upFilesProgress: false,
    maxUploadLen: 6,
    upFilesBtn: true,
    showPopup: false,
    commentFilePaths: [],
    du_patchs:[],
    currentVideo: '',
    mengbdis: 'none',
    progress: '正在下载……'
  },

  _download: function (url) {
    let that = this;
    const downloadTask = wx.downloadFile({
      url: url, // 仅为示例，并非真实的资源
      success: function (res) {
        if (res.statusCode === 200) {
          that.setData({
            mengbdis: 'none',
            currentVideo: res.tempFilePath
          })
        }
      },
      fail: function (res) {
        console.log(res);
        that.setData({
          progress: JSON.stringify(res)
        })
      }
    })
    downloadTask.onProgressUpdate((res) => {
      that.setData({
        progress: '已加载：' + (res.totalBytesWritten / 1000) + 'kb',
      })      
    })
  },

  _downTheVideo: function () {
    let that = this;
    that.setData({
      mengbdis: '',
    })
    that._download(that.data.upVideoArr[0].tempFilePath);
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
    this.setData({
      listItem:JSON.parse(options.item)
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

  loadDetail: function (item){
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id+'&stype='+item.workType,
      callback: (err, result) => {
        if (result.success) {
          let fis = [];
          let videoFis = [];
          let allFis = [];
          if (result.repair.photoFiles instanceof Array) {
            for (let item of result.repair.photoFiles) {
              if (item.fileType == 'IMG') {
                fis.push(item.url)
              } else {
                videoFis.push({ 'tempFilePath': item.url })
              }
              allFis.push(item.url)
            }
          }

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
            orderDetail: result,
            isPhoneFix: result.repair.isPhoneFix,
            files: fis,
            upVideoArr: videoFis,
            du_patchs: du_patches
          })
        }
      }
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
      that.data.orderDetail.repair.pWrok.id,
      that.data.orderDetail.repair.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.listItem)
    this.setData({
      commentVal: ''
    })
  },
  delCommentImage(e) {
    let { commentFilePaths } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
    })
  },
  popStatusChange(e) {
    this.setData({
      showPopup: e.detail
    })
  }
})