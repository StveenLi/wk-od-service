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
        value: '0',
      checked:false
      },
      {
        name: '空开容量满足全部电器负荷',
        value: '1',
        checked: false
      },
      {
        name: '楼梯电器和门的尺寸能否将机器搬运进现场',
        value: '2',
        checked: false
      },
      {
        name: '空开具备漏电保护功能',
        value: '3',
        checked: false
      },
      {
        name: '是否有货梯',
        value: '4',
        checked: false
      },
    ],
    nowAddress: '',
    outAddress: '',
    signOutTime: '',
    signInTime: '',
    selectIndex: 0,
    typeSelect: ["具备", "不具备"],
    isPhoneConfirm: false,
    remarks: '',
    user: {},
    commentFilePaths:[],
    commentVal:'',
    floor:''
  },

  floorChange:function(e){
    this.setData({
      floor:e.detail.value
    })
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
    if (that.data.checkboxItems[4].checked == false){
      if(that.data.floor==''){
        wx.showToast({
          title: '没有货梯必须要填写楼层！',
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
        ladder: that.data.checkboxItems[4].checked,
        remoteConfirm: that.data.isPhoneConfirm,
        workLinkId: that.data.orderDetail.found.links.id,
        stype: 'Found',
        id: that.data.orderDetail.found.id,
        remarks: that.data.remarks,
        floor:that.data.floor
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

  toSignInMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Found',
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
      stype: 'Found',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('勘察单签入成功')
    });
    that.setData({
      signInTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      nowAddress: addrRes.result.address
    })
  },
  
  loactionSignOut: function() {
    let that = this;
    api.getNowLocation(that.getSignOutSuccessFunc);
  },
  getSignOutSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Found',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('勘察单签出成功')
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
      stype: 'Found',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
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
    console.log(options)
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