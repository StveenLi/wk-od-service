// pages/workOrder/install/index.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const App = getApp();
const api = App.api;
var content = null;
var touchs = [];
var canvasw = 0;
var canvash = 0;

//获取系统信息
wx.getSystemInfo({
    success: function(res) {
      canvasw = res.windowWidth;
      canvash = canvasw * 9 / 16;
    },
  }),


  Page({

    /**
     * 页面的初始数据
     */
    data: {
      date: new Date().format("yyyy-MM-dd hh:mm:ss"),
      files: [],
      contentList: [],
      signImage: '',
      inSign: {},
      nowAddress: '',
      outAddress: '',
      signOutTime: '',
      signInTime: '',
      listItem: {},
      remarks: '',
      orderDetail: {},
      signImg: '',
      photoFiles: [],
      user: {},
      showModal: false,
      inputVal:'',
      commentVal: '',
      commentFilePaths: [],
      MNTItems: [],
      MNTIndex: 0,
      MNT2: '',
      MNT1: '',
      nowJX: '',
      showPopup:false,
      fqbgaz_photoFiles:[],
      anzhuangjqmp_photoFiles:[],
      jqqsz_photoFiles:[],
      kjssg_photoFiles:[],
      azqjjt_photoFiles:[],
      xwjxdgzss_photoFiles:[],
      xdwbqcdcc_photoFiles:[],
      fqbgaz_files:[],
      anzhuangjqmp_files:[], 
      jqqsz_files:[], 
      kjssg_files:[], 
      azqjjt_files:[], 
      xwjxdgzss_files:[], 
      xdwbqcdcc_files:[], 
      other_files:[],
      scancodes:'',

    },

  getScancode: function () {
    var _this = this;
    const { orderDetail, user } = _this.data
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        let scancodes = res.result.split('idCard=')[1];
        
        api.fetch({
          url: 'rest/twocode/doAdd',
          data: {
            workLinkId: orderDetail.intall.links.id,
            twoCodeId: scancodes,
            userId: user.userId,
            wr: orderDetail.intall.pWrok.wr,
            projectId: orderDetail.intall.pWork.projectId
          },
          callback: (err, result) => {
            if (result.success) {
              _this.setData({
                scancodes: scancodes
              })
              wx.showToast({
                title: '绑定成功',
              })
            }else{
              wx.showToast({
                title: result.msg,
                icon:'none',
                duration:2000
              })
            }
          }
        })
      }
    })
  },
  bindMNumTypeChange: function (e) {
    this.setData({
      MNTIndex: e.detail.value
    })
  },
  MNT1Change: function (e) {
    this.setData({
      MNT1: e.detail.value
    })
  },
  MNT2Change: function (e) {
    this.setData({
      MNT2: e.detail.value
    })
  },
  getMNTFaultList: function () {
    let that = this;
    api.fetch({
      url: 'rest/comment/findFaultList?code=XWJXH',
      callback: (err, result) => {
        if (result.success) {
          let xwjjxs = ['请选择'];
          for (let item of result.list[0].nodes) {
            xwjjxs.push(item.dicCode);
          }
          that.setData({
            MNTItems: xwjjxs
          })
        }
      }
    })
  },
    lastSubmit: function(e) {
      let that = this;
      let macCode = ''
      if(that.data.orderDetail.intall.isAudited == 0){

        if (that.data.MNT1 == ''){
          wx.showToast({
            title: '必须输入机编前缀！',
            icon:'none',
            duration:2000
          })
          return;
        }
        if (that.data.MNT2 == ''){
          wx.showToast({
            title: '必须输入机编后缀！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        if (that.data.MNTIndex == 0){
          wx.showToast({
            title: '必须选择机编型号！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        macCode = that.data.MNT1 + '/' + that.data.MNTItems[that.data.MNTIndex] + '/' + that.data.MNT2
      }else{
        macCode = that.data.MNT1 + '/' + that.data.nowJX + '/' + that.data.MNT2
      }


      const { fqbgaz_files, anzhuangjqmp_files, jqqsz_files, kjssg_files, azqjjt_files, xwjxdgzss_files, xdwbqcdcc_files, other_files} = this.data

      if (fqbgaz_files.length == 0){
        wx.showToast({
          title: '安装服务报告图片必须上传！',
          icon:'none',
          duration:2000
        })
        return;
      }
      if (anzhuangjqmp_files.length == 0) {
        wx.showToast({
          title: '安装机器名牌图片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (jqqsz_files.length == 0) {
        wx.showToast({
          title: '机器全身照图片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (kjssg_files.length == 0) {
        wx.showToast({
          title: '安装分配器图片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (azqjjt_files.length == 0) {
        wx.showToast({
          title: '安装清洁剂桶图片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if (xwjxdgzss_files.length == 0) {
        wx.showToast({
          title: '洗碗机洗涤工作图片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      if (xwjxdgzss_files.length == 0) {
        wx.showToast({
          title: '洗涤完毕的餐具全景图片必须上传！',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      let finalFiles = fqbgaz_files;
      // finalFiles.concat( anzhuangjqmp_files, jqqsz_files, kjssg_files, azqjjt_files, xwjxdgzss_files, xdwbqcdcc_files, other_files);
      api.fetch({
        url: 'rest/work/doUpdate',
        data: {
          closeDate: that.data.date,
          photoFiles: finalFiles.concat(anzhuangjqmp_files, jqqsz_files, kjssg_files, azqjjt_files, xwjxdgzss_files, xdwbqcdcc_files, other_files),
          remarks: that.data.remarks,
          signUrl: that.data.signImg,
          workLinkId: that.data.orderDetail.intall.links.id,
          stype: 'Install',
          id: that.data.orderDetail.intall.id,
          machineCode: macCode,
        },
        callback: (err, result) => {
          if (result.success) {
            //doSubmit
            api.fetch({
              url: 'rest/work/doSubmit',
              data: {
                bigWorkOrderId: that.data.orderDetail.intall.pWrok.id,
                workId: that.data.listItem.id,
                status: 10,
                stype: 'Install'
              },
              callback: (err, result) => {
                if (result.success) {
                  // wx.redirectTo({
                  //   url: '../../work/index?listType=workOrder',
                  // })
                  wx.navigateBack({})
                }else{
                  wx.showToast({
                    title: result.msg,
                    duration:2000,
                    icon:'none'
                  })
                }
              }
            })
          }
        }
      })
    },

    remarkChange: function(e) {
      this.setData({
        remarks: e.detail.value
      })
    },


    

  toSignInMap: function () {
    let that = this;
    let signInfo = {
      inOrOut: 'in',
      stype: 'Install',
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
      stype: 'Install',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('安装单签入成功')
    });
    that.setData({
      signInTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      nowAddress: addrRes.result.address
    })
  },

  loactionSignOut: function () {
    let that = this;
    if (that.data.nowAddress == "") {
      wx.showToast({
        title: '请签入后再签出！',
        duration: 2000,
        icon: 'none'
      })
      return;
    }
    api.getNowLocation(that.getSignOutSuccessFunc);
  },
  getSignOutSuccessFunc: function (addrRes) {
    let that = this;
    let signInfo = {
      inOrOut: 'out',
      stype: 'Install',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, addrRes.result.location.lat, addrRes.result.location.lng, addrRes.result.address, function () {
      console.log('安装单签出成功')
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
      stype: 'Install',
      workId: that.data.listItem.id,
      userId: that.data.user.userId
    }
    wx.navigateTo({
      url: '/pages/signMap/index?item=' + JSON.stringify(signInfo),
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
    //             var resultData = JSON.parse(result.data)
    //             let pfs = that.data.photoFiles;
    //             if (resultData.success) {
    //               pfs.push(resultData.url);
    //               that.setData({
    //                 photoFiles: pfs
    //               })
    //               api.cacheImg(that.data.orderDetail.intall.id, 'Install', resultData.url);
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
    _component_setImgPath:function(e){
      this.setData({
        files:e.detail
      })

      this.loadDetail(this.data.listItem)
    },

  _fqbgaz_setImgPath:function(e){
    let that = this;
    this.setData({
      fqbgaz_files:e.detail
    })
    this.loadDetail(this.data.listItem)
  },
  _anzhuangjqmp_setImgPath:function(e){
    this.setData({
      anzhuangjqmp_files:e.detail
    })
    this.loadDetail(this.data.listItem)
  },
  _jqqsz_setImgPath:function(e){
    this.setData({
      jqqsz_files:e.detail
    })
    this.loadDetail(this.data.listItem)
  },
  _kjssg_setImgPath:function(e){
    this.setData({
      kjssg_files:e.detail
    })
    this.loadDetail(this.data.listItem)
  },
  _azqjjt_setImgPath:function(e){
    this.setData({
      azqjjt_files:e.detail
    })
    this.loadDetail(this.data.listItem)

  },
  _xwjxdgzss_setImgPath:function(e){
    this.setData({
      xwjxdgzss_files:e.detail
    })
    this.loadDetail(this.data.listItem)

  },
  _xdwbqcdcc_setImgPath:function(e){
    this.setData({
      xdwbqcdcc_files:e.detail
    })
    this.loadDetail(this.data.listItem)

  },
  _other_setImgPath:function(e){
    this.setData({
      other_files:e.detail
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

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

      //获得Canvas的上下文
      content = wx.createCanvasContext('firstCanvas')
      //设置线的颜色
      // content.setStrokeStyle("#00ff00")
      //设置线的宽度
      // content.setLineWidth(5)
      //设置线两端端点样式更加圆润
      content.setLineCap('round')
      //设置两条线连接处更加圆润
      content.setLineJoin('round');


    },
    loadDetail: function(item) {
      let self = this;
      api.fetch({
        url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
        callback: (err, result) => {
          if (result.success) {
            let fis = [];
            let jqjxArray = [];

            if (result.intall.photoFiles instanceof Array) {
              // fis = result.intall.photoFiles

              for (let item of result.intall.photoFiles) {
                if (item.filePro == 'fqbgaz') {
                  self.setData({
                    fqbgaz_photoFiles: new Array().concat(item),
                    fqbgaz_files: new Array().concat(item)

                  })
                } else if (item.filePro == 'anzhuangjqmp') {
                  self.setData({
                    anzhuangjqmp_photoFiles: new Array().concat(item),
                    anzhuangjqmp_files: new Array().concat(item)

                  })
                } else if (item.filePro == 'jqqsz') {
                  self.setData({
                    jqqsz_photoFiles: new Array().concat(item),
                    jqqsz_files: new Array().concat(item)
                  })
                } else if (item.filePro == 'kjssg') {
                  self.setData({
                    kjssg_photoFiles: new Array().concat(item),
                    kjssg_files: new Array().concat(item)
                  })
                } else if (item.filePro == 'azqjjt') {
                  self.setData({
                    azqjjt_photoFiles: new Array().concat(item),
                    azqjjt_files: new Array().concat(item)
                  })
                } else if (item.filePro == 'xwjxdgzss') {
                  self.setData({
                    xwjxdgzss_photoFiles: new Array().concat(item),
                    xwjxdgzss_files: new Array().concat(item)
                  })
                } else if (item.filePro == 'xdwbqcdcc') {
                  self.setData({
                    xdwbqcdcc_photoFiles: new Array().concat(item),
                    xdwbqcdcc_files: new Array().concat(item)
                  })
                } else {
                  self.setData({
                    photoFiles: new Array().concat(item),
                    files: new Array().concat(item)
                  })
                }
              }
            }

            if (result.fromData[3].value != null) {
              jqjxArray = result.fromData[3].value.split('/');
            }

            self.setData({
              orderDetail: result,
              date: new Date(result.intall.links.createTime).format("yyyy-MM-dd hh:mm:ss"),
              nowAddress: result.signInAddress == null ? '' : result.signInAddress,
              outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
              files: fis,
              // photoFiles: fis,
              MNT1: jqjxArray[0],
              MNT2: jqjxArray[2],
              nowJX: jqjxArray[1],
              signImg:result.intall.signUrl

            })

            if (result.intall.isBinding == 'Y'){
              self.setData({
                scancodes: result.intall.twoCodeId
              })
            }
            self._seeDoneChange();
            self.getMNTFaultList();

          }
        }
      });
    },

    _seeDoneChange: function() {
      let that = this;
      //如果用户为员工&&工单未被查看
      if (that.data.user.type == 1 && that.data.orderDetail.intall.links.subStatus == 0) {
        api.fetch({
          url: 'rest/work/doSubmit',
          data: {
            bigWorkOrderId: that.data.orderDetail.intall.pWrok.id,
            workId: that.data.listItem.id,
            status: 5,
            stype: 'Install',
          },
          callback: (err, result) => {
            console.log('see done');
          }
        })
      }
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
        this.setlocation();
    },

  setlocation: function () {
    let self = this;
    const item = self.data.listItem;
    api.fetch({
      url: 'rest/work/findById?workId=' + item.id + '&stype=' + item.workType,
      callback: (err, result) => {
        if (result.success) {
          self.setData({
            nowAddress: result.signInAddress == null ? '' : result.signInAddress,
            outAddress: result.signOutAddress == null ? '' : result.signOutAddress,
            signInTime: result.signInTime,
            signOutTime: result.signOutTime,
          })
        }
      }
    });
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

    cacheImg: function(url) {
      api.fetch({
        url: 'rest/comment/cacheImg?id=' + this.data.orderDetail.intall.id + '&stype=Install&url=' + url,
        callback: (err, result) => {
          if (result.success) {
            console.log('Img cache success')
          }
        }
      });
    },

    // 画布的触摸移动开始手势响应
    start: function(event) {
      // console.log("触摸开始" + event.changedTouches[0].x)
      // console.log("触摸开始" + event.changedTouches[0].y)
      //获取触摸开始的 x,y
      let point = {
        x: event.changedTouches[0].x,
        y: event.changedTouches[0].y
      }
      touchs.push(point)
    },

    // 画布的触摸移动手势响应
    move: function(e) {
      let point = {
        x: e.touches[0].x,
        y: e.touches[0].y
      }
      touchs.push(point)
      if (touchs.length >= 2) {
        this.draw(touchs)
      }
    },

    // 画布的触摸移动结束手势响应
    end: function(e) {
      console.log("触摸结束" + e)
      //清空轨迹数组
      for (let i = 0; i < touchs.length; i++) {
        touchs.pop()
      }

    },

    // 画布的触摸取消响应
    cancel: function(e) {
      console.log("触摸取消" + e)
    },

    // 画布的长按手势响应
    tap: function(e) {
      console.log("长按手势" + e)
    },

    error: function(e) {
      console.log("画布触摸错误" + e)
    },

    //绘制
    draw: function(touchs) {
      let point1 = touchs[0]
      let point2 = touchs[1]
      touchs.shift()
      content.moveTo(point1.x, point1.y)
      content.lineTo(point2.x, point2.y)
      content.stroke()
      content.draw(true)
    },
    //清除操作
    clearClick: function() {
      //清除画布
      content.clearRect(0, 0, canvasw, canvash)
      content.draw(true)
      this.setData({
        signImg: ''
      })
    },
    //保存图片
    saveClick: function() {
      var that = this
      wx.canvasToTempFilePath({
        canvasId: 'firstCanvas',

        success: function(res) {
          //打印图片路径
          console.log(res)
          wx.uploadFile({
            url: api.url + '/rest/comment/upload',
            filePath: res.tempFilePath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(result) {
              var resultData = JSON.parse(result.data);
              that.setData({
                signImg: resultData.url
              })
              api.cacheSign(that.data.orderDetail.intall.id, 'Install', resultData.url);
            },
            fail: function(e) {
              console.log(e);
            }
          })
          //设置保存的图片
          that.setData({
            signImage: res.tempFilePath
          })
        }
      })
    },
  /**
     * 弹窗
     */
  showDialogBtn: function () {
    let that = this;
    if (that.data.nowAddress == '') {
      wx.showToast({
        title: '您还未签入！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.outAddress == '') {
      wx.showToast({
        title: '您还未签出！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    // if (that.data.photoFiles.length < 1) {
    //   wx.showToast({
    //     title: '机器机身情况照片必须上传！',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    if (that.data.signImg == '') {
      wx.showToast({
        title: '请确认签名后再提交！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if(that.data.orderDetail.intall.isAudited == 1){
      wx.showModal({
        content: '该机器系统编号为' + that.data.orderDetail.intall.machineNrs +'，如实际机编与系统机编不符，点击不提交，工作时间联系客服。如相符，点击提交!',
        showCancel:true,

        cancelText:'不提交',
        cancelColor:'#3c8df9',
        confirmColor:'#3c8df9',
        confirmText:'提交',
        success:function(res){
          if(res.confirm){
            that.lastSubmit();
          }
        }
      })
      
    }else{
      this.setData({
        showModal: true
      })
    }
    
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  confirmChange: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.lastSubmit();
  },
  //评论组件
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
      that.data.orderDetail.intall.pWrok.id,
      that.data.orderDetail.intall.links.id, that.commentSuccess, commentFilePaths)
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
  popStatusChange(e) {
    this.setData({
      showPopup: e.detail
    })
  }
  })