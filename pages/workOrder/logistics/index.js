// pages/workOrder/logistics/index.js

const App = getApp();
const api = App.api;
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var content = null;
var touchs = [];
var canvasw = 0;
var canvash = 0;

wx.getSystemInfo({
  success: function (res) {
    canvasw = res.windowWidth;
    canvash = canvasw * 9 / 16;
  },
}),
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contentList: [],
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    logisticsSelect: ["三方物流", "自有物流"],
    logisticsSelectIndex: 0,
    signImg:'',
    machineStepper: {
      // 当前 stepper 数字
      stepper: 1,
      // 最小可到的数字
      min: 1,
      // 最大可到的数字
      max: 100,
      // 小尺寸, 默认大尺寸
      size: 'small'
    },
    typeSelect: ["类型A", "类型B", "类型C"],
    selectIndex: 0,
    stepper: {
      // 当前 stepper 数字
      stepper: 1,
      // 最小可到的数字
      min: 1,
      // 最大可到的数字
      max: 100,
      // 小尺寸, 默认大尺寸
      size: 'small'
    },
    remarks:'',
    user:{},
    goSignAddress:'',
    arriveSignAddress:'',
    returnSignAddress:'',
    signGoTime:'',
    signArriveTime: '',
    signReturnTime: '',
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
  },


  toSignGoMap:function(){
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Delivery',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },

  locationSignGo: function () {
    let that = this;
    api.getNowLocation(that.getSignGoSuccessFunc);
  },

  getSignGoSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Delivery',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('物流单出发签到成功')
    });
    that.setData({
      signGoTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      goSignAddress: addrRes.result.address
    })
  },

  toSignArriveMap:function(){
    let that = this;
    let signInfo = {
      inOrOut: 'arrive',
      stype: 'Delivery',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },
  
  locationSignArrive: function () {
    let that = this;
    if (that.data.goSignAddress == "") {
      wx.showToast({
        title: '务必按流程签到！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    api.getNowLocation(that.getSignArriveSuccessFunc);
  },

  getSignArriveSuccessFunc: function (addrRes){
    let that = this;
    let signInfo = {
      inOrOut: 'arrive',
      stype: 'Delivery',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('物流单到达签到成功')
    });
    that.setData({
      signArriveTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      arriveSignAddress: addrRes.result.address
    })
  },

  

  toSignReturnMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Delivery',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },

  locationSignReturn: function () {
    let that = this;
    if (that.data.arriveSignAddress == "") {
      wx.showToast({
        title: '务必按流程签到！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    api.getNowLocation(that.getSignReturnSuccessFunc);
  },

  getSignReturnSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Delivery',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('物流单单签出成功')
    });
    that.setData({
      signReturnTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      returnSignAddress: addrRes.result.address
    })
  },
  
  lastSubmit: function (e) {
    let that = this;
    if(that.data.signImg == ''){
      wx.showToast({
        title: '签名图片仍未保存！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // //goSignAddress:'',
    // arriveSignAddress: '',
    //   returnSignAddress: '',
    if (that.data.goSignAddress == '') {
      wx.showToast({
        title: '尚未出发签到！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.arriveSignAddress == '') {
      wx.showToast({
        title: '尚未到达签到！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.returnSignAddress == '') {
      wx.showToast({
        title: '尚未返回签到！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //doUpdate
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        signPhoto: that.data.signImg,
        remarks: that.data.remarks,
        workLinkId: that.data.orderDetail.delivery.links.id,
        stype: 'Delivery',
        id: that.data.orderDetail.delivery.id
      },
      callback: (err, result) => {
        console.log(result);
        //doSubmit
        api.fetch({
          url: 'rest/work/doSubmit',
          data: {
            bigWorkOrderId: that.data.orderDetail.delivery.pWrok.id,
            workId: that.data.listItem.id,
            status: 10,
            stype: 'Delivery',
          },
          callback: (err, result) => {
            console.log(result);
            if (result.success) {
              wx.redirectTo({
                url: '../../work/index?listType=workOrder',
              })
            }
          }
        })
      }
    })
  },
  loadDetail: function (item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            orderDetail: result,
            goSignAddress: result.depart == null ? '' : result.depart,
            arriveSignAddress: result.reach == null ? '' : result.reach,
            returnSignAddress: result.back == null?'':result.back,
            signImg: result.delivery.signPhoto
          })
          self._seeDoneChange();
        }
      }
    });
  },

  _seeDoneChange: function () {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.delivery.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.delivery.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Delivery',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
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

    //获得Canvas的上下文
    content = wx.createCanvasContext('firstCanvas')
    //设置线的颜色
    // content.setStrokeStyle("#00ff00")
    //设置线的宽度
    // content.setLineWidth(5)
    //设置线两端端点样式更加圆润
    content.setLineCap('round')
    //设置两条线连接处更加圆润
    content.setLineJoin('round');
    

  },
  remarkChange:function(e){
    this.setData({
      remarks: e.detail.value
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
    this.setlocation();
  },

  setlocation: function () {
    let self = this;
    const item = self.data.listItem;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            goSignAddress: result.depart == null ? '' : result.depart,
            arriveSignAddress: result.reach == null ? '' : result.reach,
            returnSignAddress: result.back == null ? '' : result.back,
            signGoTime:result.departTime,
            signArriveTime:result.reachTime,
            signReturnTime: result.backTime
          })
        }
      }
    });
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


  // 画布的触摸移动开始手势响应
    start: function (event) {
    // console.log("触摸开始" + event.changedTouches[0].x)
    // console.log("触摸开始" + event.changedTouches[0].y)
    //获取触摸开始的 x,y
    let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y }
    touchs.push(point)
  },

  // 画布的触摸移动手势响应
  move: function (e) {
    let point = { x: e.touches[0].x, y: e.touches[0].y }
    touchs.push(point)
    if (touchs.length >= 2) {
      this.draw(touchs)
    }
  },

  // 画布的触摸移动结束手势响应
  end: function (e) {
    console.log("触摸结束" + e)
    //清空轨迹数组
    for (let i = 0; i < touchs.length; i++) {
      touchs.pop()
    }

  },

  // 画布的触摸取消响应
  cancel: function (e) {
    console.log("触摸取消" + e)
  },

  // 画布的长按手势响应
  tap: function (e) {
    console.log("长按手势" + e)
  },

  error: function (e) {
    console.log("画布触摸错误" + e)
  },

  //绘制
  draw: function (touchs) {
    let point1 = touchs[0]
    let point2 = touchs[1]
    touchs.shift()
    content.moveTo(point1.x, point1.y)
    content.lineTo(point2.x, point2.y)
    content.stroke()
    content.draw(true)
  },
  //清除操作
  clearClick: function () {
    //清除画布
    content.clearRect(0, 0, canvasw, canvash)
    content.draw(true);
    this.setData({
      signImg:''
    })
  },
  //保存图片
  saveClick: function () {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',

      success: function (res) {
        
        //打印图片路径
        console.log(res.tempFilePath)
        wx.uploadFile({
          url: api.url + '/rest/comment/upload',
          filePath: res.tempFilePath,
          name: 'file',
          header: { "Content-Type": "multipart/form-data" },
          success: function (result) {
            var resultData = JSON.parse(result.data);
            that.setData({
              signImg: resultData.url
            })
            api.cacheSign(that.data.orderDetail.delivery.id, 'Delivery', resultData.url);

          },
          fail: function (e) {
            console.log(e);
          }
        })
        //设置保存的图片
        that.setData({
          signImage: res.tempFilePath
        })
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
    const { commentFilePaths, commentVal, user } = this.data
    api._submitComment(
      commentVal,
      user.userId,
      that.data.orderDetail.delivery.pWrok.id,
      that.data.orderDetail.delivery.links.id, that.commentSuccess, commentFilePaths)
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