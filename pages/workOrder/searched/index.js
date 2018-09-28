// pages/workOrder/searched/index.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().format('yyyy-MM-dd hh:mm:ss'),
    checkboxItems: [{
        name: '水压是否正常',
        value: '0'
      },
      {
        name: '空开容量满足全部电器负荷',
        value: '1'
      },
      {
        name: '楼梯电器和门的尺寸能否将机器搬运进现场',
        value: '2'
      },
      {
        name: '空开具备漏电保护功能',
        value: '3'
      },
    ],
    nowAddress: '',
    outAddress: '',
    selectIndex: 0,
    typeSelect: ["具备", "不具备"],
    isPhoneConfirm: false,
    remarks: '',
    user: {},
    commentFilePaths:[],
    commentVal:''
  },
  lastSubmit: function(e) {
    let that = this;
    if (!that.data.isPhoneConfirm) {
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
    }
    //doUpdate
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        checkResult: that.data.selectIndex,
        elecs: that.data.checkboxItems[1].checked, //电情况
        postions: that.data.checkboxItems[2].checked, //位置情况
        waters: that.data.checkboxItems[0].checked,
        switchs: that.data.checkboxItems[3].checked,
        remoteConfirm: that.data.isPhoneConfirm,
        workLinkId: that.data.orderDetail.found.links.id,
        stype: 'Found',
        id: that.data.orderDetail.found.id
      },
      callback: (err, result) => {
        if (result.success) {
          console.log(result);
          //doSubmit
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.found.pWrok.id,
              workId: that.data.listItem.id,
              status: 10,
              stype: 'Found',
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
        }
      }
    })
  },
  locationSignIn: function() {
    this.loactionSign('in')
  },
  loactionSignOut: function() {
    this.loactionSign('out')
  },
  loactionSign: function(inOrOut) {
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'O2ABZ-GXFCP-YY5D3-VOVIV-PWJ2Q-D7BKJ' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            console.log(addressRes);
            var address = addressRes.result.formatted_addresses.recommend;
            var inSign = {};
            inSign.signAddress = address;
            inSign.signTime = new Date().format("yyyy-MM-dd hh:mm:ss");

            inSign.signType = inOrOut == 'in' ? 1 : 2; //1签入2签出
            inSign.signX = res.latitude;
            inSign.signY = res.longitude;
            inSign.stype = 'Found';
            inSign.workId = that.data.listItem.id;
            wx.getStorage({
              key: 'systemInfo',
              success: function(res) {
                inSign.phone = res.data.model
              },
            });
            wx.getStorage({
              key: 'user',
              success: function(res) {
                inSign.userId = res.data.userId
              },
            });
            inSign.signArddessDetail = addressRes.result.address;
            inOrOut == 'in' ? that.setData({
              nowAddress: address
            }) : that.setData({
              outAddress: address
            });

            api.fetch({
              url: 'rest/work/sign',
              data: inSign,
              callback: (err, result) => {
                console.log(result);
              }
            })
          }
        })
      }
    })
  },
  switchChange: function(e) {
    let self = this;
    this.setData({
      isPhoneConfirm: !self.data.isPhoneConfirm
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  remarkChange: function(e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  bindSelectChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      selectIndex: e.detail.value
    })
  },


  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
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

  loadDetail: function(item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            orderDetail: result,
          })
        }
        self._seeDoneChange();
      }
    });
  },

  _seeDoneChange: function() {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.found.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.found.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Found',
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
      that.data.orderDetail.found.pWrok.id,
      that.data.orderDetail.found.links.id, that.commentSuccess, commentFilePaths)
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
  },
})