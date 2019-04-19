// pages/workOrder/remove/index.js

const App = getApp();
const api = App.api;
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    isPhoneFix: false,
    outAddress: '',
    signOutTime: '',
    nowAddress: '',
    signInTime: '',
    remarks: '',
    photoFiles: [],
    user: {},
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
    removeRs: [],
    removeRIndex: 0,
    cjfwbb_photoFiles:[],
    cjjqmp_photoFiles:[],
    jqwg_photoFiles:[],
    fenpeqi_photoFiles:[],
    cjfwbb_files:[],
    cjjqmp_files:[],
    jqwg_files:[],
    fenpeqi_files:[]
  },
  getRemoveReasonList: function() {
    let that = this;
    api.fetch({
      url: 'rest/comment/findFaultList?code=cjyy',
      callback: (err, result) => {
        if (result.success) {
          that.setData({
            removeRs: result.list[0].nodes
          })
        }
      }
    })
  },
  bindRemoveRChange: function(e) {
    this.setData({
      removeRIndex: e.detail.value
    })
  },
  switchChange: function() {
    let self = this;
    this.setData({
      isPhoneFix: !self.data.isPhoneFix
    })
  },
  loadDetail: function(item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          let fis = [];
          if (result.dell.photoFiles instanceof Array) {
            for (let item of result.dell.photoFiles) {
              // fis.push(item.url);
              if (item.filePro == 'cjfwbb') {
                self.setData({
                  cjfwbb_photoFiles: new Array().concat(item),
                  cjfwbb_files: new Array().concat(item)
                })
              } else if (item.filePro == 'cjjqmp'){
                self.setData({
                  cjjqmp_photoFiles: new Array().concat(item),
                  cjjqmp_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqwg'){
                self.setData({
                  jqwg_photoFiles: new Array().concat(item),
                  jqwg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'fenpeqi'){
                self.setData({
                  fenpeqi_photoFiles: new Array().concat(item),
                  fenpeqi_files: new Array().concat(item)
                })
              }
            }
          }
          self.setData({
            orderDetail: result,
            nowAddress: result.signInAddress == null ? '' : result.signInAddress,
            signInTime:result.signInTime,
            signOutTime:result.signOutTime,
            outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
            files: fis,
            photoFiles: fis
          })
          self._seeDoneChange();
        }
      }
    });
  },

  _seeDoneChange: function() {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.dell.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.dell.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Dell',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
  },

  // chooseImage: function(e) {
  //   var that = this;
  //   wx.chooseImage({
  //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     count: 6,
  //     success: function(res) {
  //       for (let tempImg of res.tempFilePaths) {
  //         wx.uploadFile({
  //           url: api.url + '/rest/comment/upload',
  //           filePath: tempImg,
  //           name: 'file',
  //           header: {
  //             "Content-Type": "multipart/form-data"
  //           },
  //           success: function(result) {
  //             var resultData = JSON.parse(result.data)
  //             let pfs = that.data.photoFiles;
  //             if (resultData.success) {
  //               pfs.push(resultData.url);
  //               that.setData({
  //                 photoFiles: pfs
  //               })
  //               api.cacheImg(that.data.orderDetail.dell.id, 'Dell', resultData.url);

  //             }
  //           },
  //           fail: function(e) {
  //             console.log(e);
  //           }
  //         })
  //       }
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       that.setData({
  //         files: that.data.files.concat(res.tempFilePaths)
  //       });
  //     }
  //   })
  // },
  // previewImage: function(e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  // delImage: function(e) {
  //   let fis = this.data.files;
  //   let index = fis.indexOf(e.target.dataset.currentimg)
  //   fis.splice(index, 1);
  //   this.setData({
  //     files: fis,
  //     photoFiles: fis
  //   })
  // },

  setImgPath:function(e){
    this.loadDetail(this.data.listItem);
  },
  
  // _cjjqmp_setImgPath:function(e){
  //   // this.setData({
  //   //   cjjqmp_files: e.detail
  //   // })
  //   this.loadDetail(this.data.listItem);
  // },
  // _jqwg_setImgPath:function(e){
  //   // this.setData({
  //   //   jqwg_files: e.detail
  //   // })
  //   this.loadDetail(this.data.listItem);
  // },
  // _fenpeqi_setImgPath:function(e){
  //   this.loadDetail(this.data.listItem);
  // },
  
  lastSubmit: function(e) {
    let that = this;
    //doUpdate
    const { cjfwbb_files,
      cjjqmp_files,
      jqwg_files,
      fenpeqi_files} = that.data
    if (that.data.nowAddress == '') {
      wx.showToast({
        title: '您还未签入！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.outAddress == '') {
      wx.showToast({
        title: '您还未签出！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.removeRs[that.data.removeRIndex].dicCode == 'buxuanze'){
      wx.showToast({
        title: '拆机原因必须选择！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (cjfwbb_files.length == 0) {
      wx.showToast({
        title: '拆机服务报告照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (cjjqmp_files.length == 0) {
      wx.showToast({
        title: '拆机机器名牌照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (jqwg_files.length == 0) {
      wx.showToast({
        title: '机器外观照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (fenpeqi_files.length == 0) {
      wx.showToast({
        title: '分配器照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        photoFiles: that.data.photoFiles,
        remarks: that.data.remarks,
        workLinkId: that.data.orderDetail.dell.links.id,
        stype: 'Dell',
        id: that.data.orderDetail.dell.id,
        dellReason: that.data.removeRs[that.data.removeRIndex].dicCode
      },
      callback: (err, result) => {
        //doSubmit
        api.fetch({
          url: 'rest/work/doSubmit',
          data: {
            bigWorkOrderId: that.data.orderDetail.dell.pWrok.id,
            workId: that.data.listItem.id,
            status: 10,
            stype: 'Dell'
          },
          callback: (err, result) => {
            console.log(result);
            if (result.success) {
              // wx.redirectTo({
              //   url: '../../work/index?listType=workOrder',
              // })
              wx.navigateBack({})
            }
          }
        })
      }
    })
  },
  remarkChange: function(e) {
    this.setData({
      remarks: e.detail.value
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
    this.getRemoveReasonList();
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
    this.setlocation();
  },
  setlocation:function(){
    let self = this;
    const item = self.data.listItem;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          if (result.dell.photoFiles instanceof Array) {
            for (let item of result.dell.photoFiles) {
              // fis.push(item.url);
              if (item.filePro == 'cjfwbb') {
                self.setData({
                  cjfwbb_photoFiles: new Array().concat(item),
                  cjfwbb_files: new Array().concat(item)
                })
              } else if (item.filePro == 'cjjqmp') {
                self.setData({
                  cjjqmp_photoFiles: new Array().concat(item),
                  cjjqmp_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqwg') {
                self.setData({
                  jqwg_photoFiles: new Array().concat(item),
                  jqwg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'fenpeqi') {
                self.setData({
                  fenpeqi_photoFiles: new Array().concat(item),
                  fenpeqi_files: new Array().concat(item)
                })
              }
            }
          }
          self.setData({
            nowAddress: result.signInAddress == null ? '' : result.signInAddress,
            signInTime: result.signInTime,
            signOutTime: result.signOutTime,
            outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
          })
        }
      }
    });
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

  toSignInMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Dell',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },
  locationSignIn: function() {
    let that = this;
    api.getNowLocation(that.getSignInSuccessFunc);
  },
  getSignInSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Dell',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
    console.log('拆机单签入成功')
    });
    that.setData({
      signInTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      nowAddress: addrRes.result.address
    })
  },
  
  loactionSignOut: function() {
    let that = this;
    if (that.data.nowAddress == "") {
      wx.showToast({
        title: '请签入后再签出！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    api.getNowLocation(that.getSignOutSuccessFunc);
  },
  getSignOutSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Dell',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('拆机单签出成功')
    });
    that.setData({
      signOutTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      outAddress: addrRes.result.address
    })
  },
  toSignOutMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Dell',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },

  //评论组件
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
      that.data.orderDetail.dell.pWrok.id,
      that.data.orderDetail.dell.links.id, that.commentSuccess, commentFilePaths)
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
  }
})