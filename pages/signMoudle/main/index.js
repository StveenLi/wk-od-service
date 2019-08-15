// pages/signMoudle/main/index.js
const App = getApp();
const api = App.api;
let user = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchDate: '',
    user:{},
    lisitData:[],
    date: new Date().format("yyyy-MM-dd"),
    workStatus: [{
      'code': '',
      'name': '类型'
    }, {
      'code': 'Repair',
      'name': '维修工单'
    }, {
      'code': 'Install',
      'name': '安装工单'
    }, {
      'code': 'Delivery',
      'name': '物流工单'
    },{
      'code': 'Dell',
      'name': '拆机工单'
    }, {
      'code': 'Found',
      'name': '勘察工单'
    },{
      'code':'XSBF',
      'name':'销售拜访',
      'type':'sign'
      }, {
        'code': 'SFP',
        'name': '送发票',
        'type': 'sign'
      },{
        'code': 'CC',
        'name': '出差',
        'type': 'sign'
      }],
    workStatusIndex:0,
    start:0,
    pageSize:20,
    listData:[],
    usersIndex:0,
    curSearchUser:'',
    curSearchUserId:0
  },

  
  bindUsersChange:function(e){
    const { usersList, usersIndex} = this.data
    this.setData({
      usersIndex:e.detail.value,
      curSearchUser: usersList[e.detail.value].userName,
      curSearchUserId: usersList[e.detail.value].id
    })
  },

  upper: function (e) {
    var self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },
  lower: function (e) {
    var self = this;
    // 当前页是最后一页
    setTimeout(function () {
      let ps = self.data.start + 20
      console.log('上拉加载更多' + ps);

      self.setData({
        start: ps
      })
      self.page_loadListData(ps);
      
    }, 300);
  },

  bindSearchDateChange:function(e){
    this.setData({
      searchDate:e.detail.value
    })
  },

  bindWorkStatusChange: function (e) {
    this.setData({
      workStatusIndex: e.detail.value
    })
  },

  addSign:function(e){
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        api.fetch({
          url: 'rest/register/findByUserId?userId='+res.data.userId,
          callback: (err, result) => {
            if (result.one){
              wx.navigateTo({
                url: '/pages/signMoudle/doSign/index?obj='+JSON.stringify(result.one),
              })
            }else{
              wx.navigateTo({
                url: '/pages/signMoudle/doSign/index',
              })
            }
          }
        })
      },
    });
  },

  page_loadListData: function (ps){
    let that = this;
    const { searchDate, workStatus, workStatusIndex, pageSize, start, curSearchUser, curSearchUserId} = that.data
    let _stype = '';
    let _type = '';
    if (workStatus[workStatusIndex].type == 'sign'){
      _type = workStatus[workStatusIndex].code;
    }else{
      _stype = workStatus[workStatusIndex].code;
    }
    wx.getStorage({
      key: 'user',
      success: function (res) {
        api.fetch({
          url: 'rest/register/getList',
          data: {
            signDate: searchDate,
            stype: _stype,
            type: _type,
            userId: res.data.userId,
            ownMan: curSearchUserId == 0 ? '' : curSearchUserId,
            start: ps,
            pageSize: pageSize
          },
          callback: (err, result) => {
            if (result.success) {
              that.setData({
                listData: that.data.listData.concat(result.data)
              })
            }
          }
        })
      }
    })
  },

  loadListData_search:function(){
    let that = this;

    if(that.data.searchDate != ''){
      that.setData({
        date: that.data.searchDate
      })
    }


    this.setData({
      start:0,
    })
    this.loadListData();
  },


  loadListData:function(){
    let that = this;
    const { searchDate, workStatus, workStatusIndex, curSearchUser, usersIndex, usersList, curSearchUserId} = that.data
    let _stype = '';
    let _type = '';
    if (workStatus[workStatusIndex].type == 'sign') {
      _type = workStatus[workStatusIndex].code;
    } else {
      _stype = workStatus[workStatusIndex].code;
    }
    wx.getStorage({
      key: 'user',
      success: function (res) {
        api.fetch({
          url: 'rest/register/getList',
          data: {
            signDate: searchDate,
            stype: _stype,
            type: _type,
            userId: res.data.userId,
            ownMan: curSearchUserId == 0 ? '' : curSearchUserId,
            start:0,
            pageSize:20
          },
          callback: (err, result) => {
            if (result.success) {
              that.setData({
                listData:result.data
              })
            }
          }
        })
        
      }
    })
    
  },

  scroll: function (e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
      wx.getStorage({
        key: 'user',
        success: function (res) {
          user = res.data
          that.setData({
            user: res.data
          })
          that.loadUsers(res.data);
        }
    })
    


    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          listHeight: res.windowHeight-170
        });
      }
    })
  },

  loadUsers:function(user){
    let that = this;
    if (user.type == 2) {
      api.fetch({
        url: 'rest/register/queryUserListByOrgId',
        data: {
          role: user.role
        },
        callback: (err, result) => {
          if (result.success) {
            that.setData({
              usersList: result.data
            })
            that.loadListData();

          }
        }
      })
    }
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
    that.loadListData();

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
  toOrderDetail: function (e) {
    let that = this;
    let item = e.target.dataset.item;
    item.workType = item.stype
    let navigateUrl;


    if (item.workType == 'Repair') {
      navigateUrl = '/pages/orderDetail/fix/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Install') {
      navigateUrl = '/pages/orderDetail/install/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Inbox') {
      navigateUrl = '/pages/orderDetail/inStorageN/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Delivery') {
      navigateUrl = '/pages/orderDetail/logistics/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Found') {
      navigateUrl = '/pages/orderDetail/searched/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Outbox') {
      navigateUrl = '/pages/orderDetail/outStorage/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Dell') {
      navigateUrl = '/pages/orderDetail/remove/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'MoneyAsk') {
      navigateUrl = '/pages/orderDetail/moneyAsk/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Patch') {
      navigateUrl = '/pages/orderDetail/parts/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'DWipe') {
      navigateUrl = '/pages/orderDetail/wipeOut/index?item=' + JSON.stringify(item);
    } else if (item.workType == 'Register'){
      navigateUrl = '/pages/signMoudle/signDetail/index?item=' + JSON.stringify(item);
    }else {
      wx.showToast({
        title: '暂时缺失此工单详情，请联系管理员。',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // let navigateUrl = '/pages/orderDetail/fix/index?item=' + JSON.stringify(that.data.orderDetail.workDto);
    wx.navigateTo({
      url: navigateUrl,
    })
  },
})