// pages/launch/index.js
const App = getApp();
const api = App.api;

//1、运营部  补件-报修-销售  2、客服 报修 3、物流部  4、技术部 机器状态变更 带翻新
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // orderItems: [{ name: '补件单', icon: '../../images/icon/bj.png', navigateUrl: '../launchPages/bj/index' }, 
    //   // { name: '维修保养单', icon: '../../images/icon/by.png', navigateUrl: '../launchPages/wxby/index' },
    //   { name: '机器状态变更单', icon: '../../images/icon/xl.png', navigateUrl: '../launchPages/jqbg/index' },
    //   { name: '销售拜访工单', icon: '../../images/icon/bx.png', navigateUrl: '../launchPages/xsbf/index' }],
    // _second_orderItems: [{ name: '出差单', icon: '../../images/icon/cc.png', navigateUrl: '../launchPages/travel/index' },
    //   { name: '请假单', icon: '../../images/icon/qj.png', navigateUrl: '../launchPages/vacate/vacate' },
    //   { name: '销售项目详细', icon: '../../images/icon/qj.png', navigateUrl: '' },
    // ],
    orderItems:[],
    user: {},
    myOrderList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('visitInAddr','' );
    wx.setStorageSync('visitOutAddr', '');
  },

  getMyselfInfo:function(){
    wx.navigateTo({
      url: '/pages/teach/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        console.log(res.data)
        that.setData({
          user: res.data
        })

      },
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user:res.data
        })

        that.setLaunchSend();


        api.fetch({
          url: 'rest/work/myWorkList?userId=' + res.data.userId,
          callback: (err, result) => {
            if (result.success) {
              that.setData({
                myOrderList: result.list
              })

            }
          }
        });

      },
    });
    
  },


  setLaunchSend:function(){
    let { user, orderItems} = this.data;
    let newItems = [];

    if (user.role > 8 && user.role <14){
      newItems.push(api.bj);
      newItems.push(api.xsbf);
      newItems.push(api.travel);
      newItems.push(api.qj);
    } else if (user.role == 15 || user.role == 17){
      newItems.push(api.qj);
    }else if(user.role == 18){
      newItems.push(api.bj);
      newItems.push(api.jqbg);
      newItems.push(api.qj);

    }else if(user.role == 20){
      newItems.push(api.bj);
      newItems.push(api.xsbf);
      newItems.push(api.travel);
      newItems.push(api.qj);
    }


    this.setData({
      orderItems: newItems
    })
  },

  toTravel: function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.item.navigateUrl,
    })
  },

  toDetailPage:function(e){
    let navigateUrl = '';
    let item = e.currentTarget.dataset.item;
    console.log(item)
    if (item.workType == "Patch"){
      navigateUrl = '/pages/launchDetail/patch/index?item=' + JSON.stringify(item);
    } else if (item.workType == "Visit"){
      navigateUrl = '/pages/launchDetail/xsbf/index?item=' + JSON.stringify(item);
    }else if(item.workType == "Change"){
      navigateUrl = '/pages/launchDetail/jqbg/index?item=' + JSON.stringify(item);
    } else if (item.workType == "Travel") {
      navigateUrl = '/pages/launchDetail/travel/index?item=' + JSON.stringify(item);
    } else if (item.workType == "Leave") {
      navigateUrl = '/pages/launchDetail/qjd/qjd?item=' + JSON.stringify(item);
    }
    wx.navigateTo({
      url: navigateUrl,
    })
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
  
  }
})