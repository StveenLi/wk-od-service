// pages/launchPages/xsbf/index.js

var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    photoFiles: [],
    nowAddress:'',
    outAddress:'',
    user:{},
    customer:'',
    remarks:''
  },

  finalSub:function(){
    let that = this;
    const { nowAddress, outAddress, customer} = that.data
    if (nowAddress == ''){
      wx.showToast({
        title: '请签入后再发起！',
        icon:'none',
        duration:2000
      })
      return;
    }
    if (outAddress == '') {
      wx.showToast({
        title: '请签出后再发起！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (customer == ''){
      wx.showToast({
        title: '请填写客户后再发起！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    api.fetch({
      url: 'rest/work/doVisit',
      data: {
        userId: that.data.user.userId,
        remarks: that.data.remarks,
        customer: that.data.customer,
        photoFiles: that.data.photoFiles

      },
      callback: (err, result) => {
        if (result.success) {
          wx.navigateBack({
            url: '/pages/launch/index'
          })
        }
      }
    });
  },
  customerChange:function(e){
    this.setData({
      customer:e.detail.value
    })
  },

  locationSignIn: function () {
    console.log('in')
    this.loactionSign('in')
  },
  loactionSignOut: function () {
    this.loactionSign('out')
  },
  loactionSign: function (inOrOut) {
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'O2ABZ-GXFCP-YY5D3-VOVIV-PWJ2Q-D7BKJ' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes);
            var address = addressRes.result.formatted_addresses.recommend;
            var inSign = {};
            inSign.signAddress = address;
            inSign.signTime = new Date().format("yyyy-MM-dd hh:mm:ss");

            inSign.signType = inOrOut == 'in' ? 1 : 2; //1签入2签出
            inSign.signX = res.latitude;
            inSign.signY = res.longitude;
            inSign.stype = 'Visit';
            // inSign.workId = that.data.listItem.id;
            wx.getStorage({
              key: 'systemInfo',
              success: function (res) {
                inSign.phone = res.data.model
              },
            });
            inSign.userId = that.data.user.userId
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

  remarkChange:function(e){
    this.setData({
      remarks:e.detail.value
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
      success: function (res) {
        wx.uploadFile({
          url: api.url + '/rest/comment/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (result) {
            var resultData = JSON.parse(result.data)
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
  }
})