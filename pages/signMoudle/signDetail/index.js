// pages/signMoudle/doSign/index.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signTypes:['销售拜访','维修保养'],
    signTypeIndex:0,
    pageSwich:false,
    customer:'',
    user:{},
    signInTime:'',
    signOutTime: '',
    nowAddress:'',
    outAddress:'',
    signId:0,
    remarks:'',
    photoFiles:[],
    files:[],
    showPopup: false,
    commentVal: '',
    commentFilePaths: []
  },


  signTypeChange:function(e){
    this.setData({
      signTypeIndex:e.detail.value
    })
  },

  initSign:function(e){
    let that = this;
    const { customer, signTypeIndex, signTypes, user} = that.data
    if(customer == ''){
      wx.showToast({
        title: '请填写拜访客户之后再提交！',
        duration:2000,
        icon:'none'
      })
      return;
    }
    let sign_type = signTypeIndex == 0?"XSBF":"WXBY";
    api.fetch({
      url: 'rest/register/doAdd?type=' + sign_type + '&typeName=' + signTypes[signTypeIndex] + '&customer=' + customer +'&createUser='+user.userId,
      callback: (err, result) => {
        if (result.success) {
          that.setData({
            signId:result.id,
            pageSwich:true
          })
        }
      }
    })
  },


  lastSubmit:function(){
    let that = this;
    const { customer, signTypeIndex, signTypes, user, remarks, photoFiles,signId} = that.data;
    let sign_type = signTypeIndex == 0 ? "XSBF" : "WXBY";
    api.fetch({
      url: 'rest/register/doUpdate' ,
      data:{
        type: sign_type,
        typeName: signTypes[signTypeIndex],
        customer: customer,
        createUser: user.userId,
        remarks: remarks,
        photoFiles: photoFiles,
        id: signId
      },
      callback: (err, result) => {
        if (result.success) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },


  customerChange:function(e){
    this.setData({
      customer:e.detail.value
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
          user:res.data
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          listHeight: res.windowHeight
        });
      }
    });

    if(options.obj){
      that.setData({
        signId: obj.id,
        pageSwich:true,
        customer:obj.customer
      })
      if (obj.type == 'XSBF'){
        that.setData({
          signTypeIndex:0
        })
      }else{
        that.setData({
          signTypeIndex: 1
        })
      }
    }

    let item = JSON.parse(options.item)
    that.setData({
      listItem:item
    })
      api.fetch({
        url: 'rest/register/findById?id=' + item.id,
        callback: (err, result) => {
          if (result.success) {

            let fis = [];

            if (result.one.photoFiles instanceof Array) {
              for (let item of result.one.photoFiles) {
                fis.push(item.url)
              }
            }
            that.setData({
              orderDetail:result,
              files: fis,
              photoFiles: result.one.photoFiles,
              customer: result.one.customer,
              remarks: result.one.remarks,
              signInTime: result.signInTime,
              signOutTime: result.signOutTime,
              nowAddress: result.signInAddress,
              outAddress: result.signOutAddress,
            })
          }
        }
      })
  },

  loadDetail:function(){
    let that = this;
    
    api.fetch({
      url: 'rest/register/findById?id=' + that.data.listItem.id,
      callback: (err, result) => {
        if (result.success) {

          let fis = [];

          if (result.one.photoFiles instanceof Array) {
            for (let item of result.one.photoFiles) {
              fis.push(item.url)
            }
          }
          that.setData({
            orderDetail: result,
            files: fis,
            photoFiles: fis,
            customer: result.one.customer,
            remarks: result.one.remarks,
            signInTime: result.signInTime,
            signOutTime: result.signOutTime,
            nowAddress: result.signInAddress,
            outAddress: result.signOutAddress,
          })
        }
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


  


  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
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
    const { commentFilePaths, commentVal, user ,orderDetail} = this.data
    api.reg__submitComment(
      commentVal,
      user.userId,
      orderDetail.one.id,
      orderDetail.one.type,
      that.commentSuccess, commentFilePaths)
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
  popStatusChange(e) {
    this.setData({
      showPopup: e.detail
    })
  }
  
})