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
    inputVal: "",
    workTypes: [{
      'code': '',
      'name': '选择类型'
    }, {
      'code': 'Repair',
      'name': '维修工单'
    }, {
      'code': 'Install',
      'name': '安装工单'
    }, {
      'code': 'Leave',
      'name': '请假工单'
    }, {
      'code': 'Inbox',
      'name': '入库工单'
    }, {
      'code': 'Delivery',
      'name': '物流工单'
    }, {
      'code': 'MoneyAsk',
      'name': '催款工单'
    }, {
      'code': 'Outbox',
      'name': '出库工单'
    }, {
      'code': 'Patch',
      'name': '补件工单'
    }, {
      'code': 'Dell',
      'name': '拆机工单'
    }, {
      'code': 'Found',
      'name': '勘察工单'
    }, {
      'code': 'Travel',
      'name': '出差工单'
    }, {
      'code': 'DWipe',
      'name': '报销工单'
    }],
    workStatus: [{
      'code': '',
      'name': '选择状态'
    }, {
      'code': 0,
      'name': '未查看'
    }, {
      'code': 5,
      'name': '已查看'
    }],
    workTypeIndex: 0,
    workStatusIndex: 0,
    workTypeText: '选择类型',
    _page_start: 0
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
      self.setData({
        _page_start: self.data._page_start + 20
      })
      self._page_loadListData(self.data._page_start + 20)
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
    let that = this;
    console.log('加载更多')
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  scroll: function(e) {

  },

  toFlowPage: function(e) {
    let navigateUrl = '';
    let item = e.currentTarget.dataset.item;


    if (item.workStatus == 20) {
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
          navigateUrl = '/pages/workOrder/travel/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Leave') {
          navigateUrl = '/pages/workOrder/leave/index?item=' + JSON.stringify(item);
        } else if (item.workType == 'Change') {
          navigateUrl = '/pages/workOrder/jqbg/index?item=' + JSON.stringify(item);
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
      } else if (item.workType == 'Leave') {
        navigateUrl = '/pages/orderDetail/leave/index?item=' + JSON.stringify(item);
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

  loadListData_search:function(){
    this.setData({
      _page_start:0
    })
    this.loadListData();
  },

  tabClick: function(e) {
    let that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      workTypeIndex: 0,
      workStatusIndex: 0,
      _page_start: 0
    });

    that.loadListData();
  },
  loadListData: function() {
    let self = this;
    let wrCode = self.data.inputVal
    let _workStatus = "0";
    const {
      workTypes,
      workStatus,
      workTypeIndex,
      workStatusIndex,
      activeIndex,
      listType,
      user
    } = self.data
    // let _wstatus = self.getWorkStatus();
    let _p = new Promise(function (resolve, reject) {
      wx.getStorage({
        key: 'user',
        success: function (res) {
          // 构建工单状态筛选条件
          // 如果是员工
          if (res.data.type == 1) {
            if (activeIndex == 0) {
              if (workStatusIndex == 0) {
                _workStatus = "0,5,8";
              } else if (workStatusIndex == 1) {
                _workStatus = "0";
              } else if (workStatusIndex == 2) {
                _workStatus = "5";
              }
            } else if (activeIndex == 1) {
              _workStatus = "10,12,20";
            }
          } else if (res.data.type == 2) {
            if (listType == 'audit') {
              if (activeIndex == 0) {
                _workStatus = "6";
              } else if (activeIndex == 1) {
                _workStatus = "8,12"
              }
            } else {
              if (activeIndex == 0) {
                if (workStatusIndex == 0) {
                  _workStatus = "0,5";
                } else if (workStatusIndex == 1) {
                  _workStatus = "0";
                } else if (workStatusIndex == 2) {
                  _workStatus = "5";
                }
              } else if (activeIndex == 1) {
                //领导已完成
                _workStatus = "10,20";
              }
            }
          }
        }
      })
      resolve();
    })

    _p.then(function(){
      console.log('结束' + _workStatus)
      wx.getStorage({
        key: 'user',
        success: function (res) {
          self.setData({
            userId: res.data.userId
          })
          api.fetch({
            url: 'rest/work/findUserIdAndSatus?userId=' + self.data.userId + '&wrCode=' + wrCode + '&workType=' + workTypes[workTypeIndex].code + '&status=' + _workStatus + '&start=0&pageSize=20',
            callback: (err, result) => {
              if (result.success) {
                self.getDataSuccess(result);
              }
            }
          });
        },
      });
    })

      
  },

  _page_loadListData: function (start){
    let self = this;
    let wrCode = self.data.inputVal
    let _workStatus = "0";
    const {
      workTypes,
      workStatus,
      workTypeIndex,
      workStatusIndex,
      activeIndex,
      listType,
      user
    } = self.data
    // let _wstatus = self.getWorkStatus();
    let _p = new Promise(function (resolve, reject) {
      wx.getStorage({
        key: 'user',
        success: function (res) {
          // 构建工单状态筛选条件
          // 如果是员工
          if (res.data.type == 1) {
            if (activeIndex == 0) {
              if (workStatusIndex == 0) {
                _workStatus = "0,5,8";
              } else if (workStatusIndex == 1) {
                _workStatus = "0";
              } else if (workStatusIndex == 2) {
                _workStatus = "5";
              }
            } else if (activeIndex == 1) {
              _workStatus = "10,12,20";
            }
          } else if (res.data.type == 2) {
            if (listType == 'audit') {
              if (activeIndex == 0) {
                _workStatus = "6";
              } else if (activeIndex == 1) {
                _workStatus = "8,12"
              }
            } else {
              if (activeIndex == 0) {
                if (workStatusIndex == 0) {
                  _workStatus = "0,5";
                } else if (workStatusIndex == 1) {
                  _workStatus = "0";
                } else if (workStatusIndex == 2) {
                  _workStatus = "5";
                }
              } else if (activeIndex == 1) {
                //领导已完成
                _workStatus = "10,20";
              }
            }
          }
        }
      })
      resolve();
    })

    _p.then(function(){
      wx.getStorage({
        key: 'user',
        success: function (res) {
          self.setData({
            userId: res.data.userId
          })
          api.fetch({
            url: 'rest/work/findUserIdAndSatus?userId=' + self.data.userId + '&wrCode=' + wrCode + '&workType=' + workTypes[workTypeIndex].code + '&status=' + _workStatus + '&start=' + start + '&pageSize=20',
            callback: (err, result) => {
              if (result.success) {
                self._page_getDataSuccess(result);
              }
            }
          });
        },
      });
    })
  },
  getListDataRequest: function (_workStatus){
    let self = this;
    let wrCode = self.data.inputVal
    const {
      workTypes,
      workStatus,
      workTypeIndex,
      workStatusIndex,
      activeIndex,
      listType,
      user
    } = self.data
    wx.getStorage({
      key: 'user',
      success: function (res) {
        self.setData({
          userId: res.data.userId
        })
        api.fetch({
          url: 'rest/work/findUserIdAndSatus?userId=' + self.data.userId + '&wrCode=' + wrCode + '&workType=' + workTypes[workTypeIndex].code + '&status=' + _workStatus + '&start=0&pageSize=20',
          callback: (err, result) => {
            if (result.success) {
              self.getDataSuccess(result);
            }
          }
        });
      },
    });
  },

  _promise_getWorkStatus: function(){
    let self = this;
    let _p = new Promise(function (resolve, reject){
    const {
      workTypes,
      workStatus,
      workTypeIndex,
      workStatusIndex,
      activeIndex,
      listType,
      user
    } = self.data
    let _workStatus = "0";
    wx.getStorage({
      key: 'user',
      success: function (res) {
        // 构建工单状态筛选条件
        // 如果是员工
        if (res.data.type == 1) {
            if (activeIndex == 0) {
              if (workStatusIndex == 0) {
                _workStatus = "0,5,8";
              } else if (workStatusIndex == 1) {
                _workStatus = "0";
              } else if (workStatusIndex == 2) {
                _workStatus = "5";
              }
            } else if (activeIndex == 1){
              _workStatus = "10,12,20";
            }
        }else if(res.data.type == 2){
          if (listType == 'audit') {
            if (activeIndex == 0) {
              _workStatus = "6";
            } else if (activeIndex == 1){
              _workStatus = "8,12"
            }
          } else {
            if (activeIndex == 0) {
              if (workStatusIndex == 0) {
                _workStatus = "0,5";
              } else if (workStatusIndex == 1) {
                _workStatus = "0";
              } else if (workStatusIndex == 2) {
                _workStatus = "5";
              }
            } else if (activeIndex == 1){
              //领导已完成
              _workStatus = "10,20";
            }
          }
        }
      }
    }) 
    resolve();
  })
  },




  _pageLowLoad: function() {
    // let that = this;
    // this.setData({
    //   _page_start: that.data._page_start
    // })
  },
  _page_getDataSuccess:function(data){
    let that = this;
    let { listdata, doneListData, activeIndex} = that.data
    if (that.data.listType == 'audit') {
      if(activeIndex == 0){
        this.setData({
          listdata: Object.assign(listdata,data.one.noAudite)
        })
      } else if (activeIndex == 1){
        this.setData({
          doneListData: Object.assign(doneListData, data.one.hasAudite)
        })
      }
      
    } else {
      if (activeIndex == 0){
        console.log()
        this.setData({
          listdata: Object.assign(listdata, data.one.notDO)
        })
      } else if (activeIndex == 1){
        this.setData({
          doneListData: Object.assign(doneListData, data.one.done)
        })
      }
    }
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
    self.loadListData();
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
    this.setData({
      inputVal: e.detail.value
    });
    // this.loadListData(e.detail.value)
  },
  bindWorkStatusChange: function(e) {
    this.setData({
      workStatusIndex: e.detail.value
    })
  },
  bindWorkTypeChange: function(e) {
    let that = this;

    this.setData({
      workTypeIndex: e.detail.value,
    })
  },
})