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
    melis:'',
    zfyf:'',
    photoFiles:[],
    firstToNowPage:true
  },
  remarksChange: function(e) {
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
  zfyfChange:function(e){
    this.setData({
      zfyf:e.detail.value
    })
  },
  otherChange: function(e) {
    this.setData({
      other: e.detail.value
    })
  },
  melisChange: function (e) {
    this.setData({
      melis: e.detail.value
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
            photoFiles: result.dWipe.photoFiles
          })
          if(self.data.firstToNowPage){
            self.setData({
              remarks: result.dWipe.remarks,
              glgq: result.dWipe.roadToll,
              p: result.dWipe.parkToll,
              other: result.dWipe.otherToll,
              melis: result.dWipe.mileNum,
              zfyf: result.dWipe.coolieToll,
              firstToNowPage:false
            })
          }
        }
        self._seeDoneChange();
      }
    });
  },


  lastSubmit: function(e) {
    let that = this;
    let {
      glgq,
      p,
      qy,
      zx,
      other,
      melis,
      zfyf,
      remarks,
      photoFiles
    } = that.data;
    console.log(photoFiles)
    if(glgq =='' && p==''&&qy==''&&zx==''&&other==''){
      wx.showToast({
        title: '不能什么都不填写就提交',
        icon:'none',
        duration:2000
      })
      return;
    }
    if(glgq>0||p>0||other>0){
      if(photoFiles.length==0){
        wx.showToast({
          title: '产生费用必须上传发票图片！',
          icon: 'none',
          duration: 2000
        })
        return
      }

    }
    if(zfyf == null){
      zfyf = ''
    }
    if(remarks == null){
      remarks = ''
    }
    //doUpdate
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        roadToll:glgq,
        postage:qy,
        parkToll:p,
        //自费油费
        coolieToll:zfyf,
        otherToll:other,
        workLinkId: that.data.orderDetail.dWipe.links.id,
        stype: 'DWipe',
        remarks: remarks,
        id: that.data.orderDetail.dWipe.id,
        mileNum: melis,
        photoFiles: photoFiles
      },
      callback: (err, result) => {
        if (result.success) {
          //doSubmit
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.dWipe.pWrok.id,
              workId: that.data.listItem.id,
              status: 6,
              stype: 'DWipe',
            },
            callback: (err, result) => {
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

  sureDone:function(){
    let that = this;
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
  },
  unSureDone: function () {
    let that = this;
    api.fetch({
      url: 'rest/work/doSubmit',
      data: {
        bigWorkOrderId: that.data.orderDetail.dWipe.pWrok.id,
        workId: that.data.listItem.id,
        status: 12,
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
  },

  _seeDoneChange: function() {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.dWipe.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.dWipe.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'DWipe',
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


  setImgPath: function (e) {
    this.loadDetail(this.data.listItem);
  },
//图片模块
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
              api.cacheImg(that.data.orderDetail.dWipe.id, 'DWipe', resultData.url);
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
    let that = this;

    api.fetch({
      url: 'rest/comment/toDeteleImg',
      data: {
        fileId: e.currentTarget.dataset.currentimg.id
      },
      callback: (err, result) => {
        if (result.success) {
          let fis = that.data.ptFiles;
          let index = 0
          for (let i = 0; i < fis.length; i++) {
            if (e.target.dataset.currentimg.id == fis[i].id) {
              index = i
              break;
            }
          }
          fis.splice(index, 1);
          this.setData({
            // files: fis,
            ptFiles: fis
          })
          this.triggerEvent('csip', fis);
        }
      }
    })


    let fis = this.data.files;
    let index = fis.indexOf(e.target.dataset.currentimg)
    fis.splice(index, 1);
    this.setData({
      files: fis,
      photoFiles: fis
    })
  },

  //评论模块
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