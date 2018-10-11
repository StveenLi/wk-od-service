// pages/teach/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    valid:'获取验证码',
    items: [
        { 'as': [1,2,3,4] }, 
        { 'as': [1,2,3]}
      ],
    userRes:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bindUserRes:'',
    systemRes:'',
    qyLoginRes:'',
    qyUserRes:'',
    mobileRes:''

  },


  bindValidChange:function(){

    let that = this;
    let max_time = 60;
    this.timer = setInterval(function () {
      that.setData({
        valid: max_time,
      })
      --max_time;
      if (max_time == 0) {
        clearInterval(that.timer);
        that.setData({
          codeTitle: '获取验证码',
        })
      }
    }, 1000)
    // this.setData({
    //   valid:'60'
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemRes:JSON.stringify(res)
        })

        if (res.environment) {
          wx.showToast({
            title: '企业号！',
          })
          wx.qy.login({
            success: function (res) {
              that.setData({
                qyLoginRes: JSON.stringify(res)

              })


              wx.qy.getEnterpriseUserInfo({
                success: function (res) {
                  var userInfo = res.userInfo
                  that.setData({
                    qyUserRes:JSON.stringify(userInfo)
                  })
                }
              })

              wx.qy.getMobile({
                success: function (res) {
                  that.setData({
                    mobileRes:JSON.stringify(res)
                  })
                }
              })
            }
          });
        }
      }
    })
    this.getinfo();
  },

  getinfo:function(){
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                userRes: JSON.stringify(res.userInfo)
              })
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    this.getinfo()
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
  
  }
})