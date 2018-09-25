//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    src: 'http://mmbiz.qpic.cn/mmbiz_png/icTdbqWNOwNTTiaKet81gQJDXYnPiaJFSzRlp9frTTX2hSN01xhiackVLHHrG7ZQI3XQsbM7Gr9USZdN4f26SO5xjg/0?wx_fmt=png',
    info: '',
    systemInfo: '',
    userInfo: '',
    grids: [{ id: 0, name: '工单', pageUrl: '../work/index' }, { id: 0, name: '首页', pageUrl: '../work/index' }, { id: 0, name: '第一', pageUrl: '../work/index' }]

  },
  // //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  toFlowPage:function(){
    wx.navigateTo({
      url: '/pages/workOrder/inStorageN/index',
    })
  },

  onTap: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },

  toWorkPage: function(){
    wx.navigateTo({
      url: '../work/index',
    })
  },

  getLocation: function(){
    let self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        self.setData({
          info: self.format(res)
        })
      }
    });

  },
  format(obj) {
    return '{\n' +
      Object.keys(obj).map(function (key) { return '  ' + key + ': ' + obj[key] + ',' }).join('\n') + '\n' +
      '}'
  },

  getSystemInfo : function(){
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.environment === 'wxwork'){
          
        }else{
        }
        self.setData({
          systemInfo: self.format(res)
        })
      }
    })
  },
  onLoad: function () {
    this.getSystemInfo();
    // wx.getUserInfo({
    //   success: function (res) {
    //     console.log(res)
    //     var userInfo = res.userInfo
    //     var nickName = userInfo.nickName
    //     var avatarUrl = userInfo.avatarUrl
    //     var gender = userInfo.gender //性别 0：未知、1：男、2：女
    //     self.setData({
    //       userInfo: self.format(res)
    //     })
    //   }
    // })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  getUserInfo: function(e) {
    // console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  }
})
