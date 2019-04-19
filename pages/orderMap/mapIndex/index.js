// pages/orderMap/mapIndex/index.js
const app = getApp();
const api = app.api;
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      iconPath: '/images/icon_wo/baoyang.png',
      id: 1,
      latitude: 31.15979,
      longitude: 121.13426,
      width: 25,
      height: 25
    }],
    scale:14,
    controls: [{
      id: 1,
      iconPath: '/images/suoding.png',
      position: {
        left: 30,
        top:500,
        width: 30,
        height: 30
      },
      clickable: true
    }, {
        id: 10,
        iconPath: '/images/icon/bj.png',
        position: {
          left: 80,
          top: 0,
          width: 30,
          height: 30
        },
        clickable: true
      },
      {
        id: 20,
        iconPath: '/images/icon/bx.png',
        position: {
          left: 10,
          top: 0,
          width: 30,
          height: 30
        },
        clickable: true
      }
    ]
  },
  regionchange(e) {
  },
  markertap(e) {
    let item = e.markerId;
    let navigateUrl = '';
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
    } else if (item.workType == 'DWipe') {
      navigateUrl = '/pages/workOrder/wipeOut/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Leave') {
      navigateUrl = '/pages/workOrder/leave/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Change') {
      navigateUrl = '/pages/workOrder/jqbg/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Maintain') {
      navigateUrl = '/pages/workOrder/maintain/index?item=' + JSON.stringify(item);
    }
    wx.navigateTo({
      url: navigateUrl,
    })
  },
  controltap(e) {
    var that = this;
    if (e.controlId === 10) {
      that.setData({
        scale: --this.data.scale
      })
    } else if(e.controlId == 20) {
      that.setData({
        scale: ++this.data.scale
      })
    }else{
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          that.setData({
            latitude: latitude,//纬度 
            longitude: longitude,//经度 
          })
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowLocation();
  },

  loadListData: function () {
    let self = this;
    api.fetch({
      url: 'rest/work/findUserIdAndSatus?userId=' + self.data.user.userId + '&status=0,5',
      callback: (err, result) => {
        if (result.success) {
          let markets = [];
          for (let i in result.one.notDO){
            for (let item of result.one.notDO[i].dtos){
              let market = {
                iconPath: '/images/icon_wo/baoyang.png',
                id: item,
                latitude: item.latitude,
                longitude: item.longitude,
                width: 25,
                height: 25,
                marketItem:item
              }
              if(item.canDO == 'Y'){
                if(item.workType == 'Install'){
                  market.iconPath = '/images/icon_wo/install.png'
                  markets.push(market);
                } else if (item.workType == 'Repair'){
                  market.iconPath = '/images/icon_wo/repair.png'
                  markets.push(market);
                } else if (item.workType == 'Dell') {
                  market.iconPath = '/images/icon_wo/remove.png'
                  markets.push(market);
                } else if (item.workType == 'Found') {
                  market.iconPath = '/images/icon_wo/kancha.png'
                  markets.push(market);
                } else if (item.workType == 'Maintain') {
                  market.iconPath = '/images/icon_wo/baoyang.png'
                  markets.push(market);
                }
              }
            }
          }
          this.setData({
            markers:markets,
            listdata: result.one.notDO
          })
        }
      }
    });
  },


  getNowLocation(getAddressResSuccessFunc) {
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'O2ABZ-GXFCP-YY5D3-VOVIV-PWJ2Q-D7BKJ' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
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
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
        that.loadListData();
      },
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

  }
})