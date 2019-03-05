// pages/workOrder/fix/index.js
const App = getApp();
const api = App.api;
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listItem: {},
    orderDetail: {},
    contentList: [],
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    isPhoneFix: false,
    getParts: false,
    files: [],
    remarks: '',
    nowAddress: '',
    outAddress: '',
    signOutTime: '',
    signInTime: '',
    photoFiles: [],
    user: {},
    confirmMachineCode: '',
    currentItem: {},
    inputVal: '',
    showModal: false,
    errors: ["请选择", "机器部件质量问题", "机器零件需要更换", "机器需要清洗", "人员操作导致问题"],
    errorIndex: 0,
    bjs: [],
    bjIndex: 0,
    upFilesProgress: false,
    maxUploadLen: 6,
    upFilesBtn: true,
    upVideoArr: [],
    faultIndex: [0, 0],

    faultList: [],
    MNTItems: [],
    MNTIndex: 0,
    MNT2: '',
    MNT1: '',
    nowJX: '',
    showPopup: false,
    commentVal: '',
    commentFilePaths: [],
    patch: [],
    du_patchs:[],
    faultResult:{},
    undoNum:0,
    fwbg_files:[],
    jqmp_files:[],
    gzbw_files: [],
    jqwgzp_files: [],
    jqzxbzg_files: [],
    canjuquanjing_files: [],
    fpqkjssg_files: [],
    qjjt_files: [],
    xwjxdgzs_files: [],
    fwbg_photoFiles:[],
    jqmp_photoFiles:[],
    gzbw_photoFiles:[],
    jqwgzp_photoFiles:[],
    jqzxbzg_photoFiles:[],
    fpqkjssg_photoFiles:[],
    qjjt_photoFiles:[],
    xwjxdgzs_photoFiles:[],
    canjuquanjing_photoFiles:[]

  },

  setPatch: function() {
    let self = this;
    let item = this.data.listItem
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          let du_patches = [];
          let du_id = 0;
          let du_times = 0;
          let du_patch_children = [];

          for (let pa of result.patch) {
            if (result.patch.indexOf(pa) === 0) {
              du_id = pa.wId;
            }
            if (du_id == pa.wId) {
              du_patch_children.push(pa);
            }
            if (du_id != pa.wId) {
              du_patches.push(du_patch_children);
              du_patch_children = [];
              du_patch_children.push(pa);
              du_times++;
              du_id = pa.wId;
            }
            if (result.patch.indexOf(pa) === result.patch.length - 1) {
              du_patches.push(du_patch_children);
            }
          }

          self.setData({
            du_patchs: du_patches
          })
          this.setData({
            patch: result.patch,
            nowAddress: result.signInAddress == null ? '' : result.signInAddress,
            signInTime: result.signInTime,
            signOutTime: result.signOutTime,
            outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
          })
        }
      }
    })
  },

  bindMNumTypeChange: function(e) {
    this.setData({
      MNTIndex: e.detail.value
    })
  },
  MNT1Change: function(e) {
    this.setData({
      MNT1: e.detail.value
    })
  },
  MNT2Change: function(e) {
    this.setData({
      MNT2: e.detail.value
    })
  },
  getMNTFaultList: function() {
    let that = this;
    api.fetch({
      url: 'rest/comment/findFaultList?code=XWJXH',
      callback: (err, result) => {
        if (result.success) {
          let xwjjxs = ['请选择'];
          for (let item of result.list[0].nodes) {
            // if (that.data.nowJX == item.dicCode) {
            //   this.setData({
            //     MNTIndex: xwjjxs.length
            //   })
            // }
            xwjjxs.push(item.dicCode);
          }
          that.setData({
            MNTItems: xwjjxs
          })
        }
      }
    })
  },
  switchChange: function() {
    let self = this;
    this.setData({
      isPhoneFix: !self.data.isPhoneFix
    })
  },
  toRequestPage: function() {
    let that = this;
    let machineType;
    if (that.data.orderDetail.repair.actualMachineType == null){
      machineType = that.data.orderDetail.repair.machineType
    }else{
      machineType = that.data.orderDetail.repair.actualMachineType
    }
    wx.navigateTo({
      url: 'request?workLinkId=' + that.data.orderDetail.repair.links.id + '&machineType=' + machineType
    })
  },
  getPartsChange: function() {
    let self = this;
    this.setData({
      getParts: !self.data.getParts
    })
  },

  handleConfirmMachine: function(e) {
    this.setData({
      confirmMachineCode: e.detail.value
    })
  },

  bindErrorChange: function(e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      errorIndex: e.detail.value
    })
    if (e.detail.value == 1) {
      this.getFaultList();
    }
  },

  bindBjChange: function(e) {
    this.setData({
      bjIndex: e.detail.value
    })
  },


  getFaultList: function(__badMood) {
    let that = this;
    api.fetch({
      url: 'rest/comment/findFaultList?code=FAULT_TYPE',
      callback: (err, result) => {
        if (result.success) {
          that.setData({
            bjs: result.list[0].nodes,
            faultResult:result
          })

          let allList = [];
          let aList = ['请选择'];

          let aaList = [];
          for (let item of result.list[0].nodes) {
            aList.push(item.text);
          }
          allList.push(aList);
          allList.push(aaList);

          // allList[1] = aaList;
          that.setData({
            faultList: allList
          })
        }
      }
    })
  },

  bindFaultColumnChange: function(e) {
    const { faultList, faultIndex, faultResult} = this.data;
    let allList = this.data.faultList;

    if (e.detail.column == 0 && e.detail.value != 0) {
      
      let _A2_list = []
      if (faultResult.list[0].nodes[e.detail.value - 1].nodes){
        for (let item of faultResult.list[0].nodes[e.detail.value-1].nodes){
          _A2_list.push(item.text);
        }
      }
      allList[1] = _A2_list;
      
      
        
    }
    if (e.detail.column == 0 && e.detail.value == 0) {
      allList[1] = []
    }

    this.setData({
      faultList: allList
    })
  },

  bindFaultPickerChange: function(e) {
    this.setData({
      faultIndex: e.detail.value
    })
  },

  lastSubmit: function (undoSuccess) {
    let that = this;

    if(that.data.isPhoneFix == null){
      wx.showToast({
        title: '电话确认数据异常，请重新进入页面',
        icon:'none',
        duration:2000,
      })
      return;
    }

    let macCode = ''
    if (that.data.orderDetail.repair.isAudited == 0) {

      if (that.data.MNT1 == '') {
        wx.showToast({
          title: '必须输入机编前缀！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.MNT2 == '') {
        wx.showToast({
          title: '必须输入机编后缀！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (that.data.MNTIndex == 0) {
        wx.showToast({
          title: '必须选择机编型号！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if(that.data.remarks == ''){
        wx.showToast({
          title: '必须填写解决方案！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      macCode = that.data.MNT1 + '/' + that.data.MNTItems[that.data.MNTIndex] + '/' + that.data.MNT2
    } else {
      macCode = that.data.MNT1 + '/' + that.data.nowJX + '/' + that.data.MNT2
    }
    //doUpdate
    let faultChildType =  that.data.bjs[that.data.faultIndex[0] - 1].nodes == null ? null : that.data.bjs[that.data.faultIndex[0] - 1].nodes[that.data.faultIndex[1]].dicCode

    // console.log(faultChildType)
    api.fetch({

      url: 'rest/work/doUpdate',
      data: {
        closeDate: that.data.date,
        applyParts: that.data.getParts,
        remarks: that.data.remarks,
        workLinkId: that.data.orderDetail.repair.links.id,
        stype: 'Repair',
        id: that.data.orderDetail.repair.id,
        photoFiles: that.data.photoFiles,
        isPhoneFix: that.data.isPhoneFix,
        // actualMachineId: that.data.currentItem.machineId
        machineCode: macCode,
        faultType: that.data.bjs[that.data.faultIndex[0] - 1].dicCode,
        faultChildType: faultChildType
      },
      callback: (err, result) => {
        if (result.success) {
          //doSubmit
          let status = 10;
          if (that.data.undoNum == 20){
            status = 20
          }
          api.fetch({
            url: 'rest/work/doSubmit',
            data: {
              bigWorkOrderId: that.data.orderDetail.repair.pWrok.id,
              workId: that.data.listItem.id,
              status: status,
              stype: 'Repair',
            },
            callback: (err, result) => {
              if (result.success) {
                wx.navigateBack({})
              }
            }
          })
        }
      }
    })
  },
  // chooseImage: function(e) {
  //   var that = this;
  //   wx.chooseImage({
  //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     count: 6,
  //     success: function(res) {
  //       for (let tempImg of res.tempFilePaths) {
  //         wx.uploadFile({
  //           url: api.url + '/rest/comment/upload',
  //           filePath: tempImg,
  //           name: 'file',
  //           header: {
  //             "Content-Type": "multipart/form-data",
  //             "chartset": "utf-8"
  //           },
  //           success: function(result) {

  //             let resultData = JSON.parse(result.data)
  //             api.cacheImg(that.data.orderDetail.repair.id, 'Repair', resultData.url);

  //             // console.log('1' + resultData.url)

  //             let pfs = that.data.photoFiles;
  //             if (resultData.success) {
  //               pfs.push(resultData.url);
  //               that.setData({
  //                 photoFiles: pfs
  //               })
  //             }
  //           },
  //           fail: function(e) {
  //             console.log(e);
  //           }
  //         })
  //       }

  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       that.setData({
  //         files: that.data.files.concat(res.tempFilePaths)
  //       });
  //     }
  //   })
  // },
  // previewImage: function(e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  // delImage: function(e) {
  //   let fis = this.data.files;
  //   let index = fis.indexOf(e.target.dataset.currentimg)
  //   fis.splice(index, 1);
  //   this.setData({
  //     files: fis,
  //     photoFiles: fis
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getStorage({
      key: 'user',
      success: function(res) {
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
    this.getFaultList();
  },

  loadDetail: function(item) {
    let self = this;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          let fis = [];
          let videoFis = [];
          let allFis = [];
          let jqjxArray = [];
          if (result.repair.photoFiles instanceof Array) {
            for (let item of result.repair.photoFiles) {
              // fis.push(item.url);
              if (item.filePro == 'fwbg') {
                self.setData({
                  fwbg_photoFiles: new Array().concat(item),
                  fwbg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqmp') {
                self.setData({
                  jqmp_photoFiles: new Array().concat(item),
                  jqmp_files: new Array().concat(item)
                })
              } else if (item.filePro == 'gzbw') {
                self.setData({
                  gzbw_photoFiles: new Array().concat(item),
                  gzbw_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqwgzp') {
                self.setData({
                  jqwgzp_photoFiles: new Array().concat(item),
                  jqwgzp_files: new Array().concat(item)
                })
              } else if (item.filePro == 'jqzxbzg') {
                self.setData({
                  jqzxbzg_photoFiles: new Array().concat(item),
                  jqzxbzg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'canjuquanjing') {
                self.setData({
                  canjuquanjing_photoFiles: new Array().concat(item),
                  canjuquanjing_files: new Array().concat(item)
                })
              } else if (item.filePro == 'fpqkjssg') {
                self.setData({
                  fpqkjssg_photoFiles: new Array().concat(item),
                  fpqkjssg_files: new Array().concat(item)
                })
              } else if (item.filePro == 'qjjt') {
                self.setData({
                  qjjt_photoFiles: new Array().concat(item),
                  qjjt_files: new Array().concat(item)
                })
              } else if (item.filePro == 'xwjxdgzs') {
                self.setData({
                  xwjxdgzs_photoFiles: new Array().concat(item),
                  xwjxdgzs_files: new Array().concat(item)
                })
              }
            }
          }
          if (result.fromData[3].value != null) {
            jqjxArray = result.fromData[3].value.split('/');
          }
          self.setData({
            orderDetail: result,
            patch: result.patch,
            nowAddress: result.signInAddress == null ? '' : result.signInAddress,
            outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
            files: fis,
            photoFiles: allFis,
            upVideoArr: videoFis,
            MNT1: jqjxArray[0],
            MNT2: jqjxArray[2],
            nowJX: jqjxArray[1]
          })
          this.getMNTFaultList();

          self._seeDoneChange();
        }
      }
    });
  },

  _seeDoneChange: function() {
    let that = this;
    //如果用户为员工&&工单未被查看
    if (that.data.user.type == 1 && that.data.orderDetail.repair.links.subStatus == 0) {
      api.fetch({
        url: 'rest/work/doSubmit',
        data: {
          bigWorkOrderId: that.data.orderDetail.repair.pWrok.id,
          workId: that.data.listItem.id,
          status: 5,
          stype: 'Repair',
        },
        callback: (err, result) => {
          console.log('see done');
        }
      })
    }
  },


  setImgPath: function (e) {
    this.loadDetail(this.data.listItem);
  },

  toSignInMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Repair',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },
  locationSignIn: function () {
    let that = this;
    api.getNowLocation(that.getSignInSuccessFunc);
  },

  getSignInSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Repair',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('维修单签入成功')
    });
    that.setData({
      signInTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      nowAddress: addrRes.result.address
    })
  },

  loactionSignOut: function () {
    let that = this;
    api.getNowLocation(that.getSignOutSuccessFunc);
  },
  getSignOutSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Repair',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('勘察单签出成功')
    });
    that.setData({
      signOutTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      outAddress: addrRes.result.address
    })
  },
  toSignOutMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Repair',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
    })
  },


  remarkChange: function(e) {
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
  onShow: function(options) {
    // this.loadDetail(this.data.listItem);
    this.setPatch()
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
    let self = this;
    this.setData({
      inputVal: e.detail.value,
      inputSearch: true
    });

    this.getMachineOption(e.detail.value)


  },
  itemOptionClick: function(e) {
    this.setData({
      inputVal: e.currentTarget.dataset.item.machineNrs,
      inputSearch: false,
      currentItem: e.currentTarget.dataset.item
    });
  },
  getMachineOption: function(searchContent) {
    let self = this;
    api.fetch({
      url: 'rest/comment/getMachines?machineNrs=' + searchContent,
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


  unDoSuccess: function(){
    let that = this;
    const {
      inputVal,
      confirmMachineCode,
      nowAddress,
      outAddress,
      faultIndex
      
    } = that.data

    this.setData({
      undoNum: 20
    })
    if (!that.data.isPhoneFix) {

      if (nowAddress == '') {
        wx.showToast({
          title: '您还未签入',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (outAddress == '') {
        wx.showToast({
          title: '您还未签出',
          icon: 'none',
          duration: 2000
        })
        return;
      }

    }
    if (faultIndex[0] == 0) {
      wx.showToast({
        title: '请选择故障类型再提交！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (that.data.orderDetail.repair.isAudited == 0) {
      this.showDialogBtn();
      
    }else{
      this.lastSubmit();
    }

    
  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {
    let that = this;
    
    const {
      inputVal,
      confirmMachineCode,
      nowAddress,
      outAddress,
      faultIndex,
      fwbg_files,
      jqmp_files,
      gzbw_files,
      jqwgzp_files,
      jqzxbzg_files,
      canjuquanjing_files,
      fpqkjssg_files,
      qjjt_files,
      xwjxdgzs_files
    } = that.data
    if (!that.data.isPhoneFix) {

      if (nowAddress == '') {
        wx.showToast({
          title: '您还未签入',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (outAddress == '') {
        wx.showToast({
          title: '您还未签出',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (fwbg_files.length == 0){
        wx.showToast({
          title: '服务报告照片必须上传！',
          icon:'none',
          duration:2000
        })
        return;
      }
      if (jqmp_files.length == 0) {
        wx.showToast({
          title: '机器名牌照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (gzbw_files.length == 0) {
        wx.showToast({
          title: '故障部位照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      
      if (jqwgzp_files.length == 0) {
        wx.showToast({
          title: '机器外观照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (jqzxbzg_files.length == 0) {
        wx.showToast({
          title: '机器主洗臂、主洗缸照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (canjuquanjing_files.length == 0) {
        wx.showToast({
          title: '洗涤完毕餐具全景照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (fpqkjssg_files.length == 0) {
        wx.showToast({
          title: '分配器照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (qjjt_files.length == 0) {
        wx.showToast({
          title: '清洁剂桶照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (xwjxdgzs_files.length == 0) {
        wx.showToast({
          title: '洗碗机洗涤工作照片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    if (faultIndex[0] == 0) {
      wx.showToast({
        title: '请选择故障类型再提交！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // //isPhoneFix 不用确认机器编号了
    // if (that.data.isPhoneFix) {
    //   that.lastSubmit();
    // } else {

      if(that.data.orderDetail.repair.isAudited == 0){
        this.setData({
          showModal: true
        })
      }else{
        this.lastSubmit();
      }
      
    // }

  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  confirmChange: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.lastSubmit();
  },


  //删除补件单
  delParts:function(e){
    let that = this;
    let item = e.currentTarget.dataset.pa;
    api.fetch({
      url: 'rest/work/doDeletePatch?id='+item[0].wId,
      callback: (err, result) => {
        if (result.success) {
          that.setPatch();
        }else{
          wx.showToast({
            title: result.msg,
            duration:2000,
            icon:'none'
          })
        }
      }
    })
  },

  uploadVideo: function() {
    let t = this;
    api._test();
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      compressed: true,
      camera: 'back',
      success: function(res) {
        let videoArr = t.data.upVideoArr || [];
        let videoInfo = {};
        videoInfo['tempFilePath'] = res.tempFilePath;
        videoInfo['size'] = res.size;
        videoInfo['height'] = res.height;
        videoInfo['width'] = res.width;
        videoInfo['thumbTempFilePath'] = res.thumbTempFilePath;
        videoInfo['progress'] = 0;
        videoArr.push(videoInfo)
        t.setData({
          upVideoArr: videoArr
        })
        // let upFilesArr = getPathArr(t);
        // if (upFilesArr.length > count - 1) {
        //   t.setData({
        //     upFilesBtn: false,
        //   })
        // }

        console.log(res)


        api._uploadFile(res.tempFilePath, t.uploadVideoSuccessFunc)
      }
    })
  },
  uploadVideoSuccessFunc: function(resultData) {
    let that = this;
    let pfs = that.data.photoFiles;
    resultData = JSON.parse(resultData.data)
    console.log(resultData);

    if (resultData.success) {
      pfs.push(resultData.url);
      that.setData({
        photoFiles: pfs
      })
      api.cacheImg(that.data.orderDetail.repair.id, 'Repair', resultData.url);
    }
  },
  delFile: function(e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '您确认删除嘛？',
      success: function(res) {
        if (res.confirm) {
          let delNum = e.currentTarget.dataset.index;
          let delType = e.currentTarget.dataset.type;
          let upVideoArr = _this.data.upVideoArr;
          if (delType == 'video') {
            upVideoArr.splice(delNum, 1)
            _this.setData({
              upVideoArr: upVideoArr,
            })
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //评论组件
  toCommit: function(options) {
    this.setData({
      showPopup: true
    })
  },
  textAreaChange: function(e) {
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
    const {
      commentFilePaths,
      commentVal,
      user
    } = this.data
    api._submitComment(
      commentVal,
      user.userId,
      that.data.orderDetail.repair.pWrok.id,
      that.data.orderDetail.repair.links.id, that.commentSuccess, commentFilePaths)
  },
  commentSuccess() {
    this.loadDetail(this.data.listItem);
    this.setData({
      commentVal: ''
    })
  },
  delCommentImage(e) {
    let {
      commentFilePaths
    } = this.data
    commentFilePaths.splice(e.detail, 1);
    this.setData({
      commentFilePaths: commentFilePaths
    })
  },
  popStatusChange(e) {
    this.setData({
      showPopup: e.detail
    })
  }
})