// pages/signMoudle/doSign/index.js
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signTypes:['销售拜访','日常保养','送发票','出差'],
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
    date: new Date().format("yyyy-MM-dd")
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
    let sign_type = signTypeIndex == 0 ? "XSBF" : signTypeIndex == 1 ? "WXBY" : signTypeIndex == 2?"SFP":"CC";
    api.fetch({
      url: 'rest/register/doAdd',
      data: { 
        type: sign_type,
        typeName: signTypes[signTypeIndex],
        customer: customer,
        createUser: user.userId
      },
      // type=' + sign_type + '&typeName=' + signTypes[signTypeIndex] + '&customer=' + customer +'&createUser='+user.userId,
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
    const { customer, signTypeIndex, signTypes, user, remarks, photoFiles, signId, nowAddress,outAddress} = that.data;

    if (nowAddress == ''){
      wx.showToast({
        title:'请签入之后再提交！',
        duration:2000,
        icon:'none'
      })
      return;
    }
    if(outAddress == ''){
      wx.showToast({
        title: '请签出之后再提交！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    let sign_type = signTypeIndex == 0 ? "XSBF" : signTypeIndex == 1 ? "WXBY" : "SFP";
    api.fetch({
      url: 'rest/register/doUpdate' ,
      data:{
        type: sign_type,
        typeName: signTypes[signTypeIndex],
        customer: customer,
        createUser: user.userId,
        remarks: remarks,
        // photoFiles: photoFiles,
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
      let obj = JSON.parse(options.obj)

      that.setData({
        signId: obj.id,
        pageSwich:true,
        customer:obj.customer
      })
      if (obj.type == 'XSBF'){
        that.setData({
          signTypeIndex:0
        })
      }else if(obj.type == 'WXBY'){
        that.setData({
          signTypeIndex: 1
        })
      }else{
        that.setData({
          signTypeIndex: 2
        })
      }
    }
    // that.loadPhotos();
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
    if (that.data.signId != 0) {
      api.fetch({
        url: 'rest/register/findById?id=' + that.data.signId,
        callback: (err, result) => {
          if (result.success) {
            let fis = [];

            if (result.one.photoFiles instanceof Array) {
              for (let item of result.one.photoFiles) {
                fis.push(item.url)
              }
            }
            that.setData({
              files: fis,
              photoFiles: result.one.photoFiles
            })
            if (result.signInAddress){
              that.setData({
                signInTime: result.signInTime,
                nowAddress: result.signInAddress
              })
              if(result.signOutAddress){
                that.setData({
                  outAddress: result.signOutAddress,
                  signOutTime: result.signOutTime
                })
              }
            }
          }
        }
      })
    }
  },

  setImgPath:function(){
    this.loadPhotos()
  },

    loadPhotos:function(){
      let that = this;
      if (that.data.signId != 0) {
        api.fetch({
          url: 'rest/register/findById?id=' + that.data.signId,
          callback: (err, result) => {
            if (result.success) {

              let fis = [];

              if (result.one.photoFiles instanceof Array) {
                for (let item of result.one.photoFiles) {
                  fis.push(item.url)
                }
              }
              that.setData({
                files: fis,
                photoFiles: result.one.photoFiles
              })
              if (result.signInAddress && result.signOutAddress) {
                that.setData({
                  signInTime: result.signInTime,
                  nowAddress: result.signInAddress
                })
              }
              if (result.signOutAddress) {
                that.setData({
                  outAddress: result.signOutAddress,
                  signOutTime: result.signOutTime
                })
              }
            }
          }
        })
      }
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
  locationSignIn: function () {
    let that = this;
    api.getNowLocation(that.getSignInSuccessFunc);
  },

  getSignInSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Register',
      workId: that.data.signId,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('签到成功')
    });
    that.setData({
      signInTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      nowAddress: addrRes.result.address
    })
  },

  toSignInMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Register',
      workId: that.data.signId,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },
  loactionSignOut: function () {
    let that = this;
    api.getNowLocation(that.getSignOutSuccessFunc);
  },
  getSignOutSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Register',
      workId: that.data.signId,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('签出成功')
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
      stype: 'Register',
      workId: that.data.signId,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
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
                  files:pfs
                })
                api.cacheImg(that.data.signId, 'Register', resultData.url, '','',that.setImgPath);
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


  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  delImage: function (e) {
    let that = this;
    console.log(e)
    api.fetch({
      url: 'rest/comment/toDeteleImg',
      data: {
        fileId: e.currentTarget.dataset.imgid
      },
      callback: (err, result) => {
        if (result.success) {
          that.setImgPath();
        }
      }
    })
  },

  // delImage: function (e) {
  //   let fis = this.data.files;
  //   let index = fis.indexOf(e.target.dataset.currentimg)
  //   fis.splice(index, 1);
  //   this.setData({
  //     files: fis,
  //     photoFiles: fis
  //   })
  // },
})