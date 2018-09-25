// pages/workOrder/inStorageN/index.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    listItem:{},
    contentList:[],
    selectIndex: 0,
    typeSelect: ["已接单", "已出库"],
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    files:[],
    inStorageItems: ['机器','化学品','机器和化学品'],
    inStorageIndex:2,
    qjjstepper: {
      stepper: 0,
      min: 0,
      max: 100,
      size: 'small'
    },
    ljjstepper: {
      stepper: 0,
      min: 0,
      max: 100,
      size: 'small'
    },
    cgjstepper: {
      stepper: 0,
      min: 0,
      max: 100,
      size: 'small'
    },
    orderDetail:{},
    machineNum:'',
    remarks:'',
    photoFiles:[],
    showPopup: false,
    user: {},
    commentVal: ''
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let item = JSON.parse(options.item);
    this.setData({
      listItem: item
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
    let fis = [];
    
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          for (let img of result.inbox.photoFiles) {
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

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.uploadFile({
          url: api.url + '/rest/comment/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: { "Content-Type": "multipart/form-data" },
          success: function (result) {
            var resultData = JSON.parse(result.data)
            console.log(resultData);
            let pfs = that.data.photoFiles;
            if (resultData.success){
              pfs.push(resultData.url);
              that.setData({
                photoFiles:pfs
              })
            }
          },
          fail: function (e) {
            console.log(e);
          }
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
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
      commentVal:''
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
        workId: that.data.orderDetail.inbox.pWrok.id,
        workLinkId: that.data.orderDetail.inbox.links.id
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