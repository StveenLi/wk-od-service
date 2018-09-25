// pages/launchPages/bj/index.js

const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreRepair: [0],
    inputShowed: false,
    inputVal: [],
    inputSearch: [],
    partsList: [],
    finalVal: [],
    finalValNum: [],
    workLinkId: '',
    date: new Date().format("yyyy-MM-dd"),
    user: {},
    remarks:'',
    finalValNum:[]

  },

  remarkChange: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  moreClick: function () {
    let moreR = this.data.moreRepair
    moreR.push(moreR.length);
    this.setData({
      moreRepair: moreR
    })
  },


  loadParts: function (partName) {
    let self = this;
    api.fetch({
      url: 'rest/comment/getParts?partName=' + partName,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            partsList: result.list
          })
        }
      }
    });
  },
  


  finalSub:function(){
    let that = this;
    let pids = '';
    let nums = '';
    for (let item of that.data.finalVal){
      pids += item.id + '@';
    }
    for (let num of that.data.finalValNum){
      nums += num + '@';
    }
    api.fetch({
      url: 'rest/work/doBigPatch',
      data:{
        receiverId:that.data.user.userId,
        etcTime:that.data.date,
        remarks:that.data.remarks,
        pids: pids,
        vs:nums
      },
      callback: (err, result) => {
        if (result.success) {
        //  console.log(result)
          wx.navigateBack({
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

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  clearInput: function (e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    let inputVal = self.data.inputVal
    inputVal[item] = ""
    this.setData({
      inputVal: inputVal,
      inputSearch: false

    });
  },

  inputTyping: function (e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    let inputVal = self.data.inputVal
    inputVal[item] = e.detail.value
    let inputSearch = [];
    inputSearch[item] = true;
    this.setData({
      inputVal: inputVal,
      inputSearch: inputSearch
    });
    self.loadParts(e.detail.value);
  },
  itemOptionClick: function (e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    console.log(item)
    let inputVal = self.data.inputVal;
    let citem = e.currentTarget.dataset.citem;
    inputVal[item] = e.currentTarget.dataset.citem.name
    let finalVal = self.data.finalVal;
    finalVal[item] = { name: citem.name, value: citem.value, id: citem.id }
    this.setData({
      inputVal: inputVal,
      inputSearch: false,
      finalVal: finalVal
    });
  },

  partsNumChange: function (e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    let finalValNum = self.data.finalValNum;
    finalValNum[item] = e.detail.value;
    self.setData({
      finalValNum: finalValNum
    })
  },
})