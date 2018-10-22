// pages/vacate/vacate.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TypeArray:["事假","病假"],
    V_type:"请选择 >",
    V_start: "请选择 >",
    V_end: "请选择 >",
    files: [],
    photoFiles: [],
    user:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
           user: res.data
        })
      },
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (optaions) {

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
  bindTypeChange(e){
    this.setData({
      index:e.detail.value,
      V_type:""
    })
  },
  start_time(e){
    this.setData({
      date1:e.detail.value,
      V_start:""
    })
  },
  V_end(e){
    this.setData({
      date2: e.detail.value,
      V_end:''
    })
  },
  //添加图片
  chooseImage(){
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
            console.log(result)
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
  },
    //发起
  finalSub: function (e) {
     let that = this;
     console.log(e)
    api.fetch({
      // url: 'rest/work/doMachineChange',
      data: {
        userId: that.data.user.userId,
        photoFiles: that.data.photoFiles,
        V_type: e.detail.value.Date,
        V_day: e.detail.value.day,
        V_start_time: e.detail.value.start_time,
        V_end_time: e.detail.value.start_time,
        V_test_reason: e.detail.value.test_reason
      },
      callback: (err, result) => {
        if (result.success) {
          wx.navigateBack({
            url: '/pages/launch/index'
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
})