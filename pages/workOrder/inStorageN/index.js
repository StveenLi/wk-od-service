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
    MNTItems:[],
    MNTIndex:0,
    MNT2:'',
    MNT1:'',
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
    user:{},
    commentVal: '',
    commentFilePaths:[]
  },

  lastSubmit: function (e) {
    let that = this;
    console.log(that.data.MNT1 + that.data.MNTItems[that.data.MNTIndex] + that.data.MNT2)
    if (that.data.inStorageIndex == 0 || that.data.inStorageIndex == 2){
      if (that.data.MNT1 == '' || that.data.MNT2 == ''){
        wx.showToast({
          title: '机器编号不能为空！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.orderDetail.inbox.pWrok.name !='拆机工单'){
        if (that.data.photoFiles.length < 1) {
          wx.showToast({
            title: '机器机身情况照片必须上传！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
      
    } 
    //doUpdate
    api.fetch({
      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        machineCode: that.data.MNT1+'/'+that.data.MNTItems[that.data.MNTIndex]+'/'+that.data.MNT2,
        inboxType: that.data.inStorageIndex,//['机器','化学品','机器和化学品']
        scgClean:that.data.cgjstepper.stepper,
        sljClean: that.data.ljjstepper.stepper,
        sqjClean: that.data.qjjstepper.stepper,
        stockId: that.data.orderDetail.inbox.stockId,
        photoFiles: that.data.photoFiles,
        workLinkId: that.data.orderDetail.inbox.links.id,
        stype: 'Inbox',
        id: that.data.orderDetail.inbox.id,
        remarks:that.data.remarks,
      },
      callback: (err, result) => {
        //doSubmit
        if(result.success){
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.inbox.pWrok.id,
              workId: that.data.listItem.id,
              status: 10,
              stype:'Inbox'
            },
            callback: (err, result) => {
              if (result.success) {
                wx.navigateBack({
                  url: '/pages/work/index'
                })
              }else{
                wx.showToast({
                  title: result.msg,
                  icon:'none',
                  duration:2000
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: result.msg,
            icon:'none',
            duration:2000
          })
        }
      }
    })
  },
  
  remarkChange: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  machineNumChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      machineNum: e.detail.value
    })
  },
  handleqjjstepperChange({
    detail: stepper
  }) {
    this.setData({
      'qjjstepper.stepper': stepper
    });
  },
  handleljjstepperChange({
    detail: stepper
  }) {
    this.setData({
      'ljjstepper.stepper': stepper
    });
  },
  handlecgjstepperChange({
    detail: stepper
  }) {
    this.setData({
      'cgjstepper.stepper': stepper
    });
  },
  bindInStorageChange: function (e) {
    this.setData({
      inStorageIndex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindSelectChange: function (e) {
    this.setData({
      selectIndex: e.detail.value
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
      listItem: item
    })
    this.loadDetail(item);
  },
  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          this.getFaultList(result.inbox.machineType);

          let fis = [];
          if (result.inbox.photoFiles instanceof Array) {
            for (let item of result.inbox.photoFiles) {
              fis.push(item.url)
            }
          }
          // let hxps = result.fromData[4].value;
          // hxps = hxps.substr(1, hxps.length - 2);
          // let hxpsArray = hxps.split('+');
          self.setData({
            orderDetail: result,
            files: fis,
            photoFiles: fis,
            qjjstepper: {
              stepper: result.inbox.qjClean,
              min: 0,
              max: 100,
              size: 'small'
            },
            ljjstepper: {
              stepper: result.inbox.ljClean,
              min: 0,
              max: 100,
              size: 'small'
            },
            cgjstepper: {
              stepper: result.inbox.cgClean,
              min: 0,
              max: 100,
              size: 'small'
            },
          })
          self._seeDoneChange();
        }
      }
    });
  },

  getFaultList:function(machineType){
    let that = this;
    api.fetch({
      url: 'rest/comment/findFaultList?code=XWJXH',
      callback: (err, result) => {
        if (result.success) {
          let xwjjxs = []; 
          let MNTIndex = 0;
          for(let item of result.list[0].nodes){
            if (machineType == item.dicCode){
              MNTIndex = result.list[0].nodes.indexOf(item)
            }
            xwjjxs.push(item.dicCode);
          }
          that.setData({
            MNTIndex: MNTIndex,
            MNTItems: xwjjxs
          })
        }
      }
    })
  },
  bindMNumTypeChange:function(e){
    this.setData({
      MNTIndex: e.detail.value
    })
  },
  MNT1Change:function(e){
    this.setData({
      MNT1: e.detail.value
    })
  },
  MNT2Change: function (e) {
    this.setData({
      MNT2: e.detail.value
    })
  },

  _seeDoneChange: function () {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.inbox.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.inbox.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Inbox',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
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
      count:6,
      success: function (res) {
        for (let tempImg of res.tempFilePaths) {
          wx.uploadFile({
            url: api.url + '/rest/comment/upload',
            filePath: tempImg,
            name: 'file',
            header: { "Content-Type": "multipart/form-data" },
            success: function (result) {
              var resultData = JSON.parse(result.data)
              let pfs = that.data.photoFiles;
              if (resultData.success){
                pfs.push(resultData.url);
                that.setData({
                  photoFiles:pfs
                })
                api.cacheImg(that.data.orderDetail.inbox.id, 'Inbox', resultData.url);
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
      that.data.orderDetail.inbox.pWrok.id,
      that.data.orderDetail.inbox.links.id, that.commentSuccess, commentFilePaths)
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