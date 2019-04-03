// pages/feedback/index.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["意见反馈", "历史反馈"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    areaLength:300,
    areaVal:'',
    files:[],
    photoFiles:[],
    user:{},
    resultList:[],
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 70) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
    });
    that.loadFeedbacks();
  },

  submitFeedback:function(){
    let that = this;
    if(that.data.areaVal == ""){
      wx.showToast({
        title: '请输入您的意见反馈再提交哦！',
        duration:2000,
        icon:'none'
      })
      return;
    }
    api.fetch({
      url: '/rest/feedback/doAdd',
      data:{
        userId:that.data.user.userId,
        content: that.data.areaVal,
        photoFiles: that.data.photoFiles
      },
      callback: (err, result) => {
        if(result.success){
          that.clearAll();
          that.loadFeedbacks();
          wx.showToast({
            title: '提交成功！',
            duration: 2000
          })
        }
      }
    });
  },

  clearAll:function(){
    this.setData({
      areaVal:"",
      files:[],
      photoFiles:[]
    })
  },
  areaChange:function(e){
    let that = this;
    let curLength = e.detail.value.length
    that.setData({
      areaVal:e.detail.value,
      areaLength:300 - curLength
    })

  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  loadFeedbacks:function(){
    let that = this;

    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
        api.fetch({
          url: '/rest/feedback/query?userId=' + res.data.userId,
          callback: (err, result) => {
            if (result.success) {
              // let newArr = [];
              // for(let item of result.list){
              //   item.submissionTime = api.formatDateTime(item.submissionTime);
              //   newArr.push(item);
              // }
              that.setData({
                resultList: result.list
              })
            }
          }
        });
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
      // sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 6,
      success: function (res) {
        for (let tempImg of res.tempFilePaths) {
          wx.uploadFile({
            url: api.url + '/rest/comment/upload',
            filePath: tempImg,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data",
              "chartset": "utf-8"
            },
            success: function (result) {
              var resultData = JSON.parse(result.data)
              let pfs = that.data.photoFiles;
              if (resultData.success) {
                pfs.push(resultData.url);
                that.setData({
                  photoFiles: pfs,
                  files: pfs
                })
              }
            },
            fail: function (e) {
              console.log(e);
            }
          })
        }
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },


  previewListImage: function (e) {
    console.log(e)
    let nArr = [];
    nArr.push(e.currentTarget.id)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: nArr// 需要预览的图片http链接列表
    })
  },
  previewImage:function(e){
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

   delImage: function (e) {
    let fis = this.data.files;
    let index = fis.indexOf(e.target.dataset.currentimg)
    fis.splice(index, 1);
    this.setData({
      files: fis,
      photoFiles: fis
    })
  },
})