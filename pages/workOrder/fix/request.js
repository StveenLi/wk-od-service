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
    workLinkId:'',
    partsAddress:''

  },

  partsAddressChange:function(e){
    this.setData({
      partsAddress:e.detail.value
    })
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
    let that = this;
    this.setData({
      workLinkId: options.workLinkId,
      machineType: options.machineType
    })
    wx.getStorage({
      key: 'user',
      success: function(res) {
        api.fetch({
          url: 'rest/wkuser/userinfo?userId='+res.data.userId,
          callback: (err, result) => {
            if (result.success) {
              that.setData({
                user: res.data,
                partsAddress: result.one.address
              })
            }
          }
        });
          
      },
    })
  },

  loadParts: function (partName){
    let self = this;
    api.fetch({
      url: 'rest/comment/getParts?partName=' + partName +'&machineType='+self.data.machineType,
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
    let errmsg = '';
    
    const {finalVal,inputVal} = this.data;
    if(finalVal.length === 0){
      wx.showToast({
        title: '请提交零件列表里已有的零件，谢谢！！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    for(let i=0;i<finalVal.length;i++){
      if (finalVal[i] == null){
        errmsg += inputVal[i]+',';
      }
    }

    if(errmsg!=''){
      wx.showToast({
        title: errmsg +' 请提交零件列表里已有的零件，谢谢！！',
        duration:2000,
        icon:'none'
      })
      return;
    }

    for (let item of self.data.finalVal){
      item.num = self.data.finalValNum[self.data.finalVal.indexOf(item)]
      submitValues.push(item);
    }
    api.fetch({
      url: 'rest/work/doPatch',
      data:{
        workLinkId: self.data.workLinkId,
        parts: submitValues,
        address: self.data.partsAddress == undefined ? '' : self.data.partsAddress
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
    let finalValNum = self.data.finalValNum;
    let inputVal = self.data.inputVal;
    let citem = e.currentTarget.dataset.citem;
    inputVal[item] = e.currentTarget.dataset.citem.name
    let finalVal = self.data.finalVal;
    finalVal[item] = { name: citem.name, value: citem.value, id: citem.id}
    finalValNum[item] = "1";

    this.setData({
      inputVal: inputVal,
      inputSearch: false,
      finalVal: finalVal,
      finalValNum: finalValNum
    });
  }, 
})