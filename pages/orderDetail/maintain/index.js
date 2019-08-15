const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listItem: {},
    orderDetail: {},
    contentList: [],
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    isPhoneFix: false,
    getParts: false,
    files: [],
    remarks: '',
    nowAddress: '',
    outAddress: '',
    signOutTime: '',
    signInTime: '',
    photoFiles: [],
    user: {},
    confirmMachineCode: '',
    currentItem: {},
    inputVal: '',
    showModal: false,
    bjs: [],
    bjIndex: 0,
    upFilesProgress: false,
    maxUploadLen: 6,
    upFilesBtn: true,
    upVideoArr: [],
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
    patch: [],
    du_patchs: [],
    faultResult: {},
    undoNum: 0,
    fwbg_files: [],
    jqmp_files: [],
    gzbw_files: [],
    jqwgzp_files: [],
    jqzxbzg_files: [],
    canjuquanjing_files: [],
    fpqkjssg_files: [],
    qjjt_files: [],
    xwjxdgzs_files: [],
    fwbg_photoFiles: [],
    jqmp_photoFiles: [],
    gzbw_photoFiles: [],
    jqwgzp_photoFiles: [],
    jqzxbzg_photoFiles: [],
    fpqkjssg_photoFiles: [],
    qjjt_photoFiles: [],
    xwjxdgzs_photoFiles: [],
    canjuquanjing_photoFiles: [],
    mengbdis: 'none',
    progress: '正在加载……',
    currentVideo: '',
    showModal: false,
    MNTItems: [],
    MNTIndex: 0,
    MNT2: '',
    MNT1: '',
  },
  getMNTFaultList: function () {
    let that = this;
    api.fetch({
      url: 'rest/comment/findFaultList?code=XWJXH',
      callback: (err, result) => {
        if (result.success) {
          let xwjjxs = ['请选择'];
          for (let item of result.list[0].nodes) {
            xwjjxs.push(item.dicCode);
          }
          that.setData({
            MNTItems: xwjjxs
          })
        }
      }
    })
  },

  showDialogBtn: function () {
    let that = this;
    const {
      confirmMachineCode,
      nowAddress,
      outAddress,
      faultIndex,
      fwbg_files,
      jqmp_files,
      gzbw_files,
      jqwgzp_files,
      jqzxbzg_files,
      canjuquanjing_files,
      fpqkjssg_files,
      qjjt_files,
      xwjxdgzs_files
    } = that.data

    if (nowAddress == '') {
      wx.showToast({
        title: '您还未签入',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (outAddress == '') {
      wx.showToast({
        title: '您还未签出',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (fwbg_files.length == 0) {
      wx.showToast({
        title: '服务报告照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (jqmp_files.length == 0) {
      wx.showToast({
        title: '机器名牌照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (gzbw_files.length == 0) {
      wx.showToast({
        title: '故障部位照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (jqwgzp_files.length == 0) {
      wx.showToast({
        title: '机器外观照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (jqzxbzg_files.length == 0) {
      wx.showToast({
        title: '机器主洗臂、主洗缸照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (canjuquanjing_files.length == 0) {
      wx.showToast({
        title: '洗涤完毕餐具全景照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (fpqkjssg_files.length == 0) {
      wx.showToast({
        title: '分配器照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (qjjt_files.length == 0) {
      wx.showToast({
        title: '清洁剂桶照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (xwjxdgzs_files.length == 0) {
      wx.showToast({
        title: '洗碗机洗涤工作照片必须上传！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.orderDetail.maintain.isAudited == 0) {
      this.setData({
        showModal: true
      })
    } else {
      this.lastSubmit();
    }
  },

  lastSubmit: function () {
    let that = this;
    const {
      nowAddress,
      outAddress,
      faultIndex,
      fwbg_files,
      jqmp_files,
      gzbw_files,
      jqwgzp_files,
      jqzxbzg_files,
      canjuquanjing_files,
      fpqkjssg_files,
      qjjt_files,
      xwjxdgzs_files
    } = that.data
    let macCode = '';
    if (that.data.orderDetail.maintain.isAudited == 0) {

      if (that.data.MNT1 == '') {
        wx.showToast({
          title: '必须输入机编前缀！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.MNT2 == '') {
        wx.showToast({
          title: '必须输入机编后缀！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.MNTIndex == 0) {
        wx.showToast({
          title: '必须选择机编型号！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      macCode = that.data.MNT1 + '/' + that.data.MNTItems[that.data.MNTIndex] + '/' + that.data.MNT2
    } else {
      macCode = that.data.MNT1 + '/' + that.data.nowJX + '/' + that.data.MNT2
    }
    api.fetch({
      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        workLinkId: that.data.orderDetail.maintain.links.id,
        machineCode: macCode,
        stype: 'Maintain',
        id: that.data.orderDetail.maintain.id
      },
      callback: (err, result) => {
        if (result.success) {
          let status = 10;
          if (that.data.undoNum == 20) {
            status = 20
          }
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.maintain.pWrok.id,
              workId: that.data.listItem.id,
              status: status,
              stype: 'Maintain',
            },
            callback: (err, result) => {
              if (result.success) {
                wx.navigateBack({})
              }
            }
          })
        }
      }
    })
  },
  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.getMNTFaultList();
          let fis = [];
          let videoFis = [];
          let allFis = [];
          let jqjxArray = [];
          
          if (result.maintain.photoFiles instanceof Array) {

            for (let item of result.maintain.photoFiles) {
              // fis.push(item.url);
              if (item.fileType == "VIDEO") {
                videoFis.push({ 'id': item.id, 'tempFilePath': item.url })
              }

              if (item.filePro == 'fwbg') {
                self.setData({
                  fwbg_photoFiles: new Array().concat(item),
                  fwbg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqmp') {
                self.setData({
                  jqmp_photoFiles: new Array().concat(item),
                  jqmp_files: new Array().concat(item)
                })
              } else if (item.filePro == 'gzbw') {
                self.setData({
                  gzbw_photoFiles: new Array().concat(item),
                  gzbw_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqwgzp') {
                self.setData({
                  jqwgzp_photoFiles: new Array().concat(item),
                  jqwgzp_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqzxbzg') {
                self.setData({
                  jqzxbzg_photoFiles: new Array().concat(item),
                  jqzxbzg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'canjuquanjing') {
                self.setData({
                  canjuquanjing_photoFiles: new Array().concat(item),
                  canjuquanjing_files: new Array().concat(item)
                })
              } else if (item.filePro == 'fpqkjssg') {
                self.setData({
                  fpqkjssg_photoFiles: new Array().concat(item),
                  fpqkjssg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'qjjt') {
                self.setData({
                  qjjt_photoFiles: new Array().concat(item),
                  qjjt_files: new Array().concat(item)
                })
              } else if (item.filePro == 'xwjxdgzs') {
                self.setData({
                  xwjxdgzs_photoFiles: new Array().concat(item),
                  xwjxdgzs_files: new Array().concat(item)
                })
              }

            }

          }
          if (result.maintain.machineNr != null) {
            jqjxArray = result.maintain.machineNr.split('/');
          }
          self.setData({
            orderDetail: result,
            date: new Date(result.maintain.links.createTime).format("yyyy-MM-dd hh:mm:ss"),
            patch: result.patch,
            nowAddress: result.signInAddress == null ? '' : result.signInAddress,
            outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
            files: fis,
            photoFiles: allFis,
            upVideoArr: videoFis,
            MNT1: jqjxArray[0],
            MNT2: jqjxArray[2],
            nowJX: jqjxArray[1]
          })
          self._seeDoneChange();
        }
      }
    });
  },
  setImgPath: function (e) {
    this.loadDetail(this.data.listItem);
  },
  _seeDoneChange: function () {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.maintain.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.maintain.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Maintain',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
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
            patch: result.patch,
            nowAddress: result.signInAddress == null ? '' : result.signInAddress,
            signInTime: result.signInTime,
            signOutTime: result.signOutTime,
            outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
          })
        }
      }
    })
  },
  toRequestPage: function () {
    let that = this;
    let machineType;
    if (that.data.orderDetail.maintain.actualMachineType == null) {
      machineType = that.data.orderDetail.maintain.machineType
    } else {
      machineType = that.data.orderDetail.maintain.actualMachineType
    }
    wx.navigateTo({
      url: 'request?workLinkId=' + that.data.orderDetail.maintain.links.id + '&machineType=' + machineType
    })
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

    console.log(options)
    let item = JSON.parse(options.item);
    this.setData({
      listItem: JSON.parse(options.item)
    })
    this.loadDetail(item);
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

  //删除补件单
  delParts: function (e) {
    let that = this;
    let item = e.currentTarget.dataset.pa;
    api.fetch({
      url: 'rest/work/doDeletePatch?id=' + item[0].wId,
      callback: (err, result) => {
        if (result.success) {
          that.setPatch();
        } else {
          wx.showToast({
            title: result.msg,
            duration: 2000,
            icon: 'none'
          })
        }
      }
    })
  },

  

  toSignInMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Maintain',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },
  locationSignIn: function () {
    let that = this;
    api.getNowLocation(that.getSignInSuccessFunc);
  },

  getSignInSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Maintain',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('保养单签入成功')
    });
    that.setData({
      signInTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      nowAddress: addrRes.result.address
    })
  },

  loactionSignOut: function () {
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
      stype: 'Maintain',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('保养单签出成功')
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
      stype: 'Maintain',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },
  uploadVideo: function () {
    let t = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      compressed: true,
      camera: 'back',
      success: function (res) {
        let videoArr = t.data.upVideoArr || [];
        let videoInfo = {};
        videoInfo['tempFilePath'] = res.tempFilePath;
        videoInfo['size'] = res.size;
        videoInfo['height'] = res.height;
        videoInfo['width'] = res.width;
        videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
        videoInfo['progress'] = 0;
        videoArr.push(videoInfo)
        t.setData({
          upVideoArr: videoArr
        })
        const uploadTask = wx.uploadFile({
          count: 1,
          url: api.url + '/rest/comment/upload',
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (result) {
            t.setData({
              mengbdis: 'none'
            })
            t.uploadVideoSuccessFunc(res.tempFilePath, result);
          },
          fail: function (e) {
            console.log(e);
          }
        });
        uploadTask.onProgressUpdate((res) => {
          t.setData({
            mengbdis: '',
            progress: '已上传：' + res.progress + '%',
          })
        })
      },
      complete: function (res) {
        t.setData({
          mengbdis: 'none'
        })
      }
    })
  },
  uploadVideoSuccessFunc: function (tempFile, resultData) {
    let that = this;
    let pfs = that.data.photoFiles;
    resultData = JSON.parse(resultData.data)
    if (resultData.success) {
      pfs.push(resultData.url);
      that.setData({
        photoFiles: pfs
      })
      api.cacheImg(that.data.orderDetail.maintain.id, 'maintain', resultData.url, '', '', that.cacheVideo_after, tempFile);
    }
  },

  cacheVideo_after: function (cacheResult, tempFile) {
    let that = this;
    let videoFis = [];
    videoFis.push({
      'id': cacheResult.one,
      'tempFilePath': tempFile
    })
    that.setData({
      currentVideo: tempFile,
      upFilesBtn: false,
      upVideoArr: videoFis
    })
  },

  _download: function (url) {
    let that = this;
    const downloadTask = wx.downloadFile({
      url: url, // 仅为示例，并非真实的资源
      success(res) {
        if (res.statusCode === 200) {
          that.setData({
            mengbdis: 'none',
            currentVideo: res.tempFilePath
          })
        }
      }
    })
    downloadTask.onProgressUpdate((res) => {
      console.log(res);
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

  delFile: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '您确认删除嘛？',
      success: function (res) {

        if (res.confirm) {
          api.fetch({
            url: 'rest/comment/toDeteleImg',
            data: {
              fileId: e.currentTarget.dataset.currentimg.id
            },
            callback: (err, result) => {
              if (result.success) {
                let delNum = e.currentTarget.dataset.index;
                let delType = e.currentTarget.dataset.type;
                let upVideoArr = _this.data.upVideoArr;
                if (delType == 'video') {
                  upVideoArr.splice(delNum, 1)
                  _this.setData({
                    upVideoArr: upVideoArr,
                  })
                  if (upVideoArr.length == 0) {
                    _this.setData({
                      upFilesBtn: true
                    })
                  }
                }
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }
      }
    })
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
    const {
      commentFilePaths,
      commentVal,
      user
    } = this.data
    api._submitComment(
      commentVal,
      user.userId,
      that.data.orderDetail.maintain.pWrok.id,
      that.data.orderDetail.maintain.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.listItem);
    this.setData({
      commentVal: ''
    })
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
  popStatusChange(e) {
    this.setData({
      showPopup: e.detail
    })
  }
})