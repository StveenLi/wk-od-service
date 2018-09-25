// pages/workOrder/fix/request.js
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
    partsList:[],
    finalVal:[],
    finalValNum:[],
    workLinkId:''

  },
  moreClick: function () {
    let moreR = this.data.moreRepair
    moreR.push(moreR.length);
    this.setData({
      moreRepair: moreR
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      workLinkId: options.workLinkId
    })
  },

  loadParts: function (partName){
    let self = this;
    api.fetch({
      url: 'rest/comment/getParts?partName='+partName,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            partsList:result.list
          })
        }
      }
    });
  },
  partsNumChange:function(e){
    let self = this;
    let item = e.currentTarget.dataset.item;
    let finalValNum = self.data.finalValNum;
    finalValNum[item] = e.detail.value;
    self.setData({
      finalValNum: finalValNum
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
  
  sureSubmit: function(){


    let self = this;

    let submitValues = [];
    for (let item of self.data.finalVal){
      item.num = self.data.finalValNum[self.data.finalVal.indexOf(item)]
      submitValues.push(item);
    }
    console.log(submitValues)
    api.fetch({
      url: 'rest/work/doPatch',
      data:{
        workLinkId: self.data.workLinkId,
        parts: submitValues
      },
      callback: (err, result) => {
        if (result.success) {
          wx.navigateBack({
            
          })
        }
      }
    });
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
  
})