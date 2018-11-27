// pages/login/index.js
const App = getApp();
const api = App.api;
Page({


  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    codeTitle: '点击获取验证码',
    validCode: '',
    codeFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  handleLogin: function() {
    let that = this;
    api.fetch({
      url: 'rest/wkuser/login?phone=' + that.data.phone +'&vaildCode='+that.data.validCode,
      callback: (err, result) => {
        if(result.success){
          that.saveUserInfo(result.one);
          // wx.getUserInfo({
          //   success: function (res) {
          //     console.log(res.userInfo)
          //   }
          // })
          wx.reLaunch({
            url: "../main/index"
          })
        }else{
          wx.showToast({
            title: result.msg,
            icon:'none',
            duration:2000
          })
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    wx.setStorageSync('wxUser', e.detail.userInfo)
  },
  saveUserInfo: function (userInfo){
    let that = this;
    wx.setStorageSync('user', userInfo)
  },
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getValidCode: function(e) {
    this.setData({
      validCode: e.detail.value
    })
  },
  getCode: function() {
    let that = this;
    let phoneNum = that.data.phone;
    if (that.data.codeFlag){
      if (api.isPhoneNume(phoneNum)) {
        api.fetch({
          url: 'rest/wkuser/getVaildCode?phone='+phoneNum,
          callback: (err, result) => {
            if(result.success){
              let max_time = 60;
              this.timer = setInterval(function () {
                that.setData({
                  codeTitle: max_time,
                  codeFlag: false
                })
                --max_time;
                if (max_time == 0) {
                  clearInterval(that.timer);
                  that.setData({
                    codeTitle: '获取验证码',
                    codeFlag: true
                  })
                }
              }, 1000)
            }else{
              wx.showToast({
                title: result.msg,
                icon:'none',
                duration:2000
              })
            }
          }
        });
      } else{
        api.failToast('手机号格式不正确');
      }
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
  wx.getStorage({
    key: 'user',
    success: function (res) {
      if(res.data.userId){
        wx.reLaunch({
          url: "../main/index"
        })
      }
    },
  });
  if (wx.getStorageSync('userInfo')) {
    
  }
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

}
})