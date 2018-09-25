// pages/workOrder/outStorage/index.js

const App = getApp();
const api = App.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    machines: ["类型A", "类型B"],
    machineCodeIndex: 0,
    inputShowed: false,
    inputVal: "",
    inputSearch: true,
    remarks: '',
    user:{},
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
  },



  bindMachineChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    this.setData({
      machineCodeIndex: e.detail.value
    })
  },



  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    let self = this;
    this.setData({
      inputVal: e.detail.value,
      inputSearch: true
    });

    this.getMachineOption(self.data.orderDetail.outbox.stockId, e.detail.value)


  },
  itemOptionClick: function(e) {
    this.setData({
      inputVal: e.currentTarget.dataset.item,
      inputSearch: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
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
          self.getMachineOption(result.outbox.stockId, '');
          self._seeDoneChange();
        }
      }
    });
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
      that.data.orderDetail.outbox.pWrok.id,
      that.data.orderDetail.outbox.links.id, that.commentSuccess, commentFilePaths)
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

  _seeDoneChange: function () {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.outbox.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.outbox.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Outbox',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
  },

  lastSubmit: function(e) {
    let that = this;
    
    if (that.data.inputVal == ''){
      wx.showToast({
        title: '机器编号不能为空！',
        icon:'none',
        duration: 2000
      })
      return;
    }

    let currentItem = {};
    for (let item of that.data.resultList) {
      if (item.machineNrs == that.data.inputVal) {
        currentItem = item;
        break;
      }
    }
    if (currentItem.machineNrs == ''){

    }
    if(JSON.stringify(currentItem) == '{}'){
      wx.showToast({
        title: '请选择仓库中的一台机器再提交！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    //doUpdate
    api.fetch({
      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        remarks: that.data.remarks,
        workLinkId: that.data.orderDetail.outbox.links.id,
        stype: 'Outbox',
        id: that.data.orderDetail.outbox.id,
        machineId: currentItem.machineId,
        machineNrs: currentItem.machineNrs,
        machineType: currentItem.machineType
      },
      callback: (err, result) => {
        if (result.success) {
          console.log(result);
          //doSubmit
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.outbox.pWrok.id,
              workId: that.data.listItem.id,
              status: 10,
              stype: 'Outbox'
            },
            callback: (err, result) => {
              console.log(result);
              if (result.success) {
                wx.navigateBack({
                  url: '/pages/work/index'
                });
              }
            }
          })
        }
      }
    })
  },
  getMachineOption: function(whId, searchContent) {
    let self = this;
    api.fetch({
      url: 'rest/comment/getMachines?whId=' + whId + '&machineNrs=' + searchContent,
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

  remarkChange: function (e) {
    this.setData({
      remarks: e.detail.value
    })
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

  }
})