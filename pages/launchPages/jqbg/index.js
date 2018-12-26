// pages/launchPages/jqbg/index.js

const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    photoFiles:[],
    inputShowed: false,
    inputVal: "",
    inputSearch: true,
    newMachineCode:'',currentItem:{},
    user:{},
    remarks:''
  },
  toRequestPage: function () {
    let that = this;
    wx.navigateTo({
      url: 'request?workLinkId=' + that.data.orderDetail.repair.links.id
    })
  },
  finalSub:function(){
    let that = this;
    if (!that.data.currentItem.machineId){
      wx.showToast({
        title: '请选择正确的机器编号后再发起',
        icon:'none',
        duration:2000
      })
      return;
    }
    if (that.data.newMachineCode==''){
      wx.showToast({
        title: '请输入新机器编号',
        duration:2000,
        icon:'none'
      })
      return;
    }
    api.fetch({
      url: 'rest/work/doMachineChange',
      data: {
        machineId: that.data.currentItem.machineId,
        userId: that.data.user.userId,
        oldMachineNr: that.data.inputVal,
        remarks: that.data.remarks,
        newMachineNr: that.data.newMachineCode,
        macStatus:"MAC_STATUS_TO_RENOVATION",
        // photoFiles: that.data.photoFiles

      },
      callback: (err, result) => {
        if (result.success) {
          
          wx.navigateBack({
            delta: 2
          })
          // wx.navigateBack({
          //   url:'/pages/launch/index'
          // })

          // wx.showModal({
          //   title: '是否申请补件？',
          //   // content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
          //   confirmText: "申请",
          //   cancelText: "不申请",
          //   success: function (res) {
          //     console.log(res);
          //     if (res.confirm) {
          //       wx.navigateTo({
          //         url: 'request?workLinkId=' + result.one
          //       })
          //     } else {
          //       wx.navigateBack({
          //         delta: 1
          //       })
          //     }
          //   }
          // });
          
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
  newMachineChange:function(e){
    this.setData({
      newMachineCode:e.detail.value
    })
  },

  remarkChange:function(e){
    this.setData({
      remarks:e.detail.value
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    let that = this;
    this.setData({
      inputVal: e.detail.value,
      inputSearch: true
    });
    this.getMachineOption(e.detail.value)
  },

  getMachineOption: function (searchContent) {
    let self = this;
    api.fetch({
      url: 'rest/comment/getMachines?machineNrs=' + searchContent +'&status=MAC_STATUS_TO_RENOVATION',
      callback: (err, result) => {
        if (result.success) {
          let storageMachines = [];
          for (let item of result.list) {
            storageMachines.push(item.machineNrs);
          }
          self.setData({
            machines: storageMachines,
            resultList: result.list
          })
        }
      }
    })
  },
  itemOptionClick: function (e) {
    this.setData({
      currentItem: e.currentTarget.dataset.item,
      inputVal: e.currentTarget.dataset.item.machineNrs,
      inputSearch: false
    });
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