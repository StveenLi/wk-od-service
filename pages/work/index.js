const App = getApp();
const api = App.api;

var sliderWidth = 96;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    hideHeader: true,
    hideBottom: true,
    loadMoreData: '加载更多……',
    tabs: ["待处理工单", "已完成工单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    listdata: [],
    doneListData: [],
    listHeight: 667,
    user: {},
    listType: '',
    inputShowed: false,
    inputVal: ""
  },

  tabChangeCallback: function(selectId) {
    console.log(selectId)
  },
  upper: function(e) {
    var self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500)
  },
  lower: function(e) {
    var self = this;
    // 当前页是最后一页
    setTimeout(function() {
      console.log('上拉加载更多');
      self.loadListData('')
      self.setData({
        hideBottom: false
      })
      setTimeout(function() {
        self.setData({
          hideBottom: true
        })
      }, 1000);
    }, 300);
  },
  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },

  toFlowPage: function(e) {
    let navigateUrl = '';
    let item = e.currentTarget.dataset.item;


    if (item.workStatus == 20){
      return;
    }
    if (this.data.activeIndex == 0) {
      if (item.canDO == 'Y') {
        if (item.workType == 'Repair') {
          navigateUrl = '/pages/workOrder/fix/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Install') {
          navigateUrl = '/pages/workOrder/install/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Inbox') {
          navigateUrl = '/pages/workOrder/inStorageN/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Delivery') {
          navigateUrl = '/pages/workOrder/logistics/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Found') {
          navigateUrl = '/pages/workOrder/searched/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Outbox') {
          navigateUrl = '/pages/workOrder/outStorage/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Dell') {
          navigateUrl = '/pages/workOrder/remove/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'MoneyAsk') {
          navigateUrl = '/pages/workOrder/moneyAsk/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Patch') {
          navigateUrl = '/pages/workOrder/parts/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'DWipe') {
          navigateUrl = '/pages/workOrder/wipeOut/index?item=' + JSON.stringify(item);
        } else if (item.workType == "Travel") {
          navigateUrl = '/pages/launchDetail/travel/index?item=' + JSON.stringify(item);
        }
      }
    } else if (this.data.activeIndex == 1) {
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
      } else if (item.workType == "Travel") {
        navigateUrl = '/pages/launchDetail/travel/index?item=' + JSON.stringify(item);
      } else if (item.workType == "Change") {
        navigateUrl = '/pages/launchDetail/jqbg/index?item=' + JSON.stringify(item);
      }
    }

    wx.navigateTo({
      url: navigateUrl,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;

    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          sliderLeft: (res.windowWidth / self.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / self.data.tabs.length * self.data.activeIndex,
          listHeight: res.windowHeight
        });
      }
    });

    wx.getStorage({
      key: 'user',
      success: function(res) {
        self.setData({
          user: res.data
        })
        if (res.data.type == 2) {
          if (options.listType == 'audit') {
            self.setData({
              tabs: ["待审核", "已审核"],
              listType: options.listType
            })
          }
        }
      },
    });
  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  loadListData: function(wrCode) {
    let self = this;
    if(!wrCode){
      wrCode=''
    }
    wx.getStorage({
      key: 'user',
      success: function(res) {
        self.setData({
          userId: res.data.userId
        })
        api.fetch({
          url: 'rest/work/findUserIdAndSatus?userId=' + self.data.userId+'&wrCode='+wrCode,
          callback: (err, result) => {
            if (result.success) {
              self.getDataSuccess(result);
            }
          }
        });
      },
    });

  },

  getDataSuccess: function(data) {
    let that = this;
    if (that.data.listType == 'audit') {
      this.setData({
        listdata: data.one.noAudite
      })
      this.setData({
        doneListData: data.one.hasAudite
      })
    } else {
      this.setData({
        listdata: data.one.notDO
      })
      this.setData({
        doneListData: data.one.done
      })
    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    self.loadListData('');
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
    this.setData({
      inputVal: e.detail.value
    });
    this.loadListData(e.detail.value)
  }
})