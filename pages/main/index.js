//index.js
//获取应用实例
const App = getApp();
const api = App.api;

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
    grids: [{ id: 0, name: '工单', pageUrl: '../work/index' }, { id: 0, name: '首页', pageUrl: '../work/index' }, { id: 0, name: '第一', pageUrl: '../work/index' }],
    user:{},
    wxUser:{},
    mainInfo:{},
    msgList:[],
    listdata:[]

  },

  logout: function () {
    wx.setStorage({
      key: 'user',
      data: null
    })
    wx.reLaunch({
      url: '/pages/login/index',
    })
  },

  calling:function(){
    wx.makePhoneCall({
      phoneNumber: '4009029021', 
    success:function(){        console.log("拨打电话成功！")      },      
    fail:function(){        console.log("拨打电话失败！")      }    })  
  },

  toPersonalPage:function(){
    wx.navigateTo({
      url: '/pages/my/index',
    })
  },
  searchMore:function(){
    wx.navigateTo({
      url: '../teach/index',
    })
  },

  toFlowPage: function (e) {
    let navigateUrl = '';
    let item = e.currentTarget.dataset.item;
    console.log(item);
    if (item.canDO == 'Y') {
      if (item.workType == 'Repair') {
        navigateUrl = '/pages/workOrder/fix/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'Install') {
        navigateUrl = '/pages/workOrder/install/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'Inbox') {
        navigateUrl = '/pages/workOrder/inStorageN/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'Delivery') {
        navigateUrl = '/pages/workOrder/logistics/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'Found') {
        navigateUrl = '/pages/workOrder/searched/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'Outbox') {
        navigateUrl = '/pages/workOrder/outStorage/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'Dell') {
        navigateUrl = '/pages/workOrder/remove/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'MoneyAsk') {
        navigateUrl = '/pages/workOrder/moneyAsk/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'Patch') {
        navigateUrl = '/pages/workOrder/parts/index?item=' + JSON.stringify(item);
      } else if (item.workType == 'DWipe'){
        navigateUrl = '/pages/workOrder/wipeOut/index?item='+JSON.stringify(item);
      } else if (item.workType == 'Leave') {
        navigateUrl = '/pages/workOrder/leave/index?item=' + JSON.stringify(item);
      }
    }
    

    wx.navigateTo({
      url: navigateUrl,
    })
  },
  _launch:function(){
    wx.navigateTo({
      url: '/pages/launch/index',
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

  toWorkPage: function(e){
    if (e.currentTarget.dataset.type == 'audit') {
      wx.navigateTo({
        url: '../work/index?listType=audit',
      })
    } else {
      wx.navigateTo({
        url: '../work/index?listType=workOrder',
      })
    }
    
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
    


  },

  getMainIndex:function(){
    let that = this;
    api.fetch({
      url: 'rest/work/indexData?userId=' +that.data.user.userId,
      callback: (err, result) => {
        if (result.success) {
          console.log(result)
          let msgList = [];
          if (result.msgList){
            
            result.msgList[0] != null ? msgList[0] = result.msgList[0] : msgList[0] = "暂无消息";
            if (result.msgList[1] != null){
              msgList[1] = result.msgList[1];
              if (result.msgList[2]!=null){
                msgList[2] = result.msgList[2];
              }
            }
          }
          

          that.setData({
            mainInfo:result,
            msgList: msgList
          })
        }
      }
    });
  },
  loadListData:function(){
    let self = this;
    api.fetch({
      url: 'rest/work/findUserIdAndSatus?userId=' + self.data.user.userId,
      callback: (err, result) => {
        console.log(result)
        if (result.success) {
          this.setData({
            listdata: result.one.notDO
          })
        }
      }
    });
  },
  onShow:function(){
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
        that.getMainIndex();
        that.loadListData();
      },
    });
    wx.getStorage({
      key: 'wxUser',
      success: function (res) {
        that.setData({
          wxUser: res.data
        })
      },
    });
  }

})
