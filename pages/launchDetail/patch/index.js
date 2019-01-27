// pages/launchDetail/patch/index.js
const App = getApp();
const api = App.api;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
    user: {},
    moreRepair:[],
    finalVal:[],
    finalValNum:[],
    inputVal: []
  },

  loadDetail: function (item) {
    let self = this;
    let moreRepair = [];
    let finalVal = [];
    let finalValNum = [];
    let inputVal = [];
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          for(let item of result.parts){
            moreRepair.push(result.parts.indexOf(item));
            finalVal.push({ name: item.groupName, value: item.groupType, id: item.groupId, partStatus: item.partStatus,num:1});
            finalValNum.push(1);
            inputVal.push(item.groupName)
          }
          let formatData = result.fromData.splice(3, result.fromData.length-3);
          self.setData({
            moreRepair: moreRepair,
            finalVal: finalVal,
            finalValNum: finalValNum,
            orderDetail: result,
            oitem:item,
            inputVal:inputVal,
            formatData:result.formatData
          })
        }
      }
    });
  },

  unLaunch: function () {
    let that = this;
    api._unLaunch(that.data.orderDetail.patch.links.id, that.unLaunchSuccessFunc);
  },

  unLaunchSuccessFunc() {
    wx.navigateBack({

    })
  },

  inputTyping: function (e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let inputVal = self.data.inputVal
    inputVal[index] = e.detail.value
    let inputSearch = [];
    inputSearch[index] = true;
    this.setData({
      inputVal: inputVal,
      inputSearch: inputSearch
    });
    self.loadParts(e.detail.value);
  },
  itemOptionClick: function (e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    console.log(e.currentTarget)
    let finalValNum = self.data.finalValNum;
    let inputVal = self.data.inputVal;
    let inputSearch = self.data.inputSearch;
    let citem = e.currentTarget.dataset.citem;
    inputVal[index] = e.currentTarget.dataset.citem.name
    inputSearch[index] = false;
    let finalVal = self.data.finalVal;
    finalVal[index] = { name: citem.name, value: citem.value, id: citem.id,num:'1' }
    finalValNum[item] = "1";

    this.setData({
      inputVal: inputVal,
      inputSearch: inputSearch,
      finalVal: finalVal,
      finalValNum: finalValNum
    });
  }, 


  moreClick: function () {
    let moreR = this.data.moreRepair
    let finalVal = this.data.finalVal
    moreR.push(moreR.length);
    finalVal.push({ name: '', value: '', id: '', partStatus:-1,num:'1'})
    this.setData({
      moreRepair: moreR,
      finalVal: finalVal
    })
  },

  delPart:function(e){
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset)
    let {inputVal,finalVal} = this.data;
    inputVal.splice(index, 1)
    finalVal.splice(index, 1)
    this.setData({
      inputVal: inputVal,
      finalVal: finalVal
    })
  },

  clearInput: function (e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let inputVal = self.data.inputVal
    let finalVal = self.data.finalVal
    finalVal[index] = { name: '', value: '', id: '', partStatus: -1,num:'1' }
    inputVal[index] = ""
    this.setData({
      inputVal: inputVal,
      inputSearch: false,
      finalVal: finalVal
    });
  },

  loadParts: function (partName) {
    let self = this;
    // let mt = self.orderDetail.machineType
    
    api.fetch({
      url: 'rest/comment/getParts?partName=' + partName + '&machineType=' + self.data.orderDetail.machineType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            partsList: result.list
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let item = JSON.parse(options.item);
    that.setData({listItem:item})
    that.loadDetail(item);
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
    });
  },

  sureSubmit: function () {
    let self = this;
    let submitValues = [];
    let errmsg = '';

    const { finalVal, inputVal } = this.data;
    if (finalVal.length === 0) {
      wx.showToast({
        title: '请提交零件列表里已有的零件，谢谢！！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    for (let i = 0; i < finalVal.length; i++) {
      if (finalVal[i] == null) {
        errmsg += inputVal[i] + ',';
      }
    }

    if (errmsg != '') {
      wx.showToast({
        title: errmsg + ' 请提交零件列表里已有的零件，谢谢！！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }

    // for (let item of self.data.finalVal) {
    //   item.num = self.data.finalValNum[self.data.finalVal.indexOf(item)]
    //   submitValues.push(item);
    // }
    api.fetch({
      url: 'rest/work/doUpdatePatch',
      data: {
        workLinkId: self.data.orderDetail.patch.links.id,
        parts: finalVal,
      },
      callback: (err, result) => {
        if (result.success) {
          wx.navigateBack({

          })
        }
      }
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
    // this.setPatch();
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
      that.data.orderDetail.patch.pWrok.id,
      that.data.orderDetail.patch.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.oitem)
  },
  delCommentImage(e) {
    let { commentFilePaths } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
    })
  }
})