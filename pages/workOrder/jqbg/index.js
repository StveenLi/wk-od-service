// pages/workOrder/jqbg/index.js

const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    files: [],
    photoFiles:[],
    showPopup:false,
    commentVal:'',
    upFilesBtn: true,
    upVideoArr:[],
    commentFilePaths:[],
    remarks:'',
    newMachineCode:'',
    currentVideo:'',
    progress:'正在加载……',
    mengbdis:'none'
  },


  _download:function(url){
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
      that.setData({
        progress: '已加载：' + (res.totalBytesWritten/1000)+'kb',
      })
      console.log('下载进度', res.progress)
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },

  _downTheVideo:function(){
    let that = this;
    that.setData({
      mengbdis: '',
    })
    that._download(that.data.upVideoArr[0].tempFilePath);
  },

  waitVideo:function(e){
    console.log('wait')

    console.log(e)
  },
  progressVideo:function(e){
    console.log('progress');
    console.log(e);
  }, 
  errorVideo:function(e){
    console.log('error');
    console.log(e);
  },

  newMachineChange: function (e) {
    this.setData({
      newMachineCode: e.detail.value
    })
  },

  _seeDoneChange: function () {
    let that = this;
    if (that.data.user.type == 1 && that.data.orderDetail.change.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.change.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Change',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
  },

  remarkChange:function(e){
    this.setData({
      remarks:e.detail.value
    })
  },

  lastSubmit: function () {
    let that = this;
    const { files, photoFiles, orderDetail, remarks, date, newMachineCode} = that.data
    if (files.length == 0) {
      wx.showToast({
        title: '请上传图片后再提交~',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: date,
        remarks: remarks,
        workLinkId: orderDetail.change.links.id,
        stype: 'Change',
        id: orderDetail.change.id,
        photoFiles: photoFiles,
        newMachineNr: newMachineCode
      },
      callback: (err, result) => {
        if (result.success) {
          //doSubmit
          let status = 10;
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.change.pWrok.id,
              workId: that.data.listItem.id,
              status: status,
              stype: 'Change',
            },
            callback: (err, result) => {
              if (result.success) {
                wx.redirectTo({
                  url: '../../work/index?listType=workOrder',
                })
              } else {
                wx.showToast({
                  title: result.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
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
    let item = JSON.parse(options.item);
    this.setData({
      listItem: JSON.parse(options.item)
    })
    this.loadDetail(item);
  },

  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          let fis = [];
          let videoFis = [];
          let allFis = [];
          let jqjxArray = [];
          if (result.change.photoFiles instanceof Array) {
            for (let item of result.change.photoFiles) {
              if (item.fileType == 'IMG') {
                fis.push(item.url)
              } else {
                videoFis.push({
                  'id':item.id,
                  'tempFilePath': item.url
                })
                
                // self._download(item.url)
              }
              allFis.push(item.url)
            }
            if(videoFis.length>0){
              self.setData({
                upFilesBtn:false
              })
            }
          }
          self.setData({
            orderDetail: result,
            newMachineCode: result.change.newMachineNr,
            files: fis,
            photoFiles: allFis,
            upVideoArr: videoFis
          })
          self._seeDoneChange();
        }
      }
    });
  },
  toRequestPage: function () {
    let that = this;
    let oldMachineNr = that.data.orderDetail.change.oldMachineNr
    let machineType = oldMachineNr.split('/')[1]
    wx.navigateTo({
      url: '/pages/launchPages/jqbg/request?workLinkId=' + that.data.orderDetail.change.links.id + '&machineType=' + machineType
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
    this.setPatch()
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
          })
        }
      }
    })
  },

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
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['compressed'], 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 9,
      success: function (res) {
        for (let tempImg of res.tempFilePaths) {
          wx.uploadFile({
            url: api.url + '/rest/comment/upload',
            filePath: tempImg,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              "chartset": "utf-8"
            },
            success: function (result) {
              let resultData = JSON.parse(result.data)
              api.cacheImg(that.data.orderDetail.change.id, 'Change', resultData.url);
              let pfs = that.data.photoFiles;
              if (resultData.success) {
                pfs.push(resultData.url);
                that.setData({
                  photoFiles: pfs
                })
              }
            },
            fail: function (e) {
              console.log(e);
            }
          })
        }

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
  delImage: function (e) {
    let fis = this.data.files;
    let index = fis.indexOf(e.target.dataset.currentimg)
    fis.splice(index, 1);
    this.setData({
      files: fis,
      photoFiles: fis
    })
  },


  //上传视频

  uploadVideo: function () {
    let t = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      compressed: true,
      camera: 'back',
      success: function (res) {
        t.setData({
          mengbdis: '',
        })
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
        // api._uploadFile(res.tempFilePath, t.uploadVideoSuccessFunc)

        
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
            t.uploadVideoSuccessFunc(res.tempFilePath,result);
          },
          fail: function (e) {
            console.log(e);
          }
        });
        uploadTask.onProgressUpdate((res) => {
          t.setData({
            mengbdis: '',
            progress: '已上传：' + res.progress+'%',
          })
        })
      },
      complete:function(res){
        console.log(res)
        t.setData({
          mengbdis: 'none'
        })
      }
    })
  },

  uploadVideoSuccessFunc: function (tempFile,resultData) {
    let that = this;
    let pfs = that.data.photoFiles;
    resultData = JSON.parse(resultData.data);
    if (resultData.success) {
      pfs.push(resultData.url);
      that.setData({
        photoFiles: pfs
      })
      api.cacheImg(that.data.orderDetail.change.id, 'Change', resultData.url, '', '', that.cacheVideo_after,tempFile);
    }
  },

  cacheVideo_after: function (cacheResult, tempFile){
    let that = this;
    let videoFis = [];
    videoFis.push({
      'id': cacheResult.one,
      'tempFilePath': tempFile
    })
    that.setData({
      currentVideo:tempFile,
      upFilesBtn: false,
      upVideoArr: videoFis
    })
  },


  delFile: function (e) {
    let _this = this;
    console.log(e)
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
                  if(upVideoArr.length == 0){
                    _this.setData({
                      upFilesBtn:true
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
      that.data.orderDetail.change.pWrok.id,
      that.data.orderDetail.change.links.id, that.commentSuccess, commentFilePaths)
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