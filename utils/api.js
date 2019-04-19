'use strict';
var QQMapWX = require('qqmap-wx-jssdk.js');
var qqmapsdk;
// api 路径
//测试
const HOST = 'https://test.tianchu.linkitchen.com/CServer';
//正式
// const HOST = 'https://www.jiexianchina.com';

// const HOST = 'http://192.168.0.182:8080/CServer';
// const HOST = 'http://localhost:8022';

const p_positiveNum = /^\+?[1-9][0-9]*$/;
const Constant={
    HOST:HOST
};
const Util={
    constant:{
        PEI_ER:{
            Q_J:4,
            CG:2,
            LJ:1,
        },
        SERVICE_PHONE:'4009029021',
        EMPTY_PAGE_CONTENT:{}
    },
    url:HOST,
    screenWidth:null,
    pageSize:15,
    weiUserInfo:null,
    key:{
        USER_PHONE:'user_phone',
        USER_INFO:'user_info'
    },
    userPhone:null,
    userId:null,
    user: function () {
      wx.getStorage({
        key: 'user',
        success: function (res) {
          return res.data
        },
      });
    },
    role:null,
  bj: { name: '补件单', icon: '../../images/icon/bj.png', navigateUrl: '../launchPages/bj/index' },
  jqbg: { name: '翻修单', icon: '../../images/icon/xl.png', navigateUrl: '../launchPages/jqbg/index' },
  xsbf: { name: '销售拜访工单', icon: '../../images/icon/bx.png', navigateUrl: '../launchPages/xsbf/index' },
  travel: { name: '出差单', icon: '../../images/icon/cc.png', navigateUrl: '../launchPages/travel/index' },
  qj: { name: '请假单', icon: '../../images/icon/qj.png', navigateUrl: '../launchPages/vacate/vacate' },
  xxxm:{ name: '销售项目详细', icon: '../../images/icon/qj.png', navigateUrl: '' },
  wxby: { name: '维修保养单', icon: '../../images/icon/by.png', navigateUrl: '../launchPages/wxby/index' },

    fetch:function (config) {
        var loadTitle=config.loadTitle||'加载中';
        var operType=config.operType||'query';
            wx.showLoading({
                title: loadTitle,
                mask: true
            })
        var header=config.header|| {'content-type': 'application/json;charset=utf-8'};
        var method=config.method||'GET';
        if (config.beforeFn){
            config.beforeFn();
        }
        wx.request({
            url: HOST+'/'+config.url,
            method: method,
            data:config.data,
            header: header,
            success: function(res) {
                if ('query'==operType) {
                    wx.hideLoading();
                }else{
                    if (res.data.success){
                        wx.hideLoading();
                    }
                }
              config.callback(null, res.data);

            },
            fail:function (e) {
                wx.hideLoading();
                config.callback(e)
            }
        })
    },

  getNowLocation(getAddressResSuccessFunc) {
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'O2ABZ-GXFCP-YY5D3-VOVIV-PWJ2Q-D7BKJ' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            getAddressResSuccessFunc(addressRes);
          }
        })
      }
    })
  },
  cacheImg: function (id, stype, url, filePro, fileName,successFunc,tempFile) {
    if (filePro == undefined){
      filePro = ''
    }
    if (fileName == undefined){
      fileName = ''
    }
    console.log(stype)
      this.fetch({
        // url: 'rest/comment/cacheImg?id=' + id + '&stype=' + stype + '&url=' + url + '&filePro=' + filePro + '&fileName=' + fileName,
        url: 'rest/comment/cacheImg',
        data:{
          id:id,
          stype:stype,
          url:url,
          filePro: filePro,
          fileName: fileName
        },
        callback: (err, result) => {
          if (result.success) {
            if(successFunc){
              successFunc(result, tempFile);
            }
          }
        }
      });
    },

    cacheSign: function (id, stype, url) {
      this.fetch({
        url: 'rest/comment/cacheSign?id=' + id + '&stype=' + stype + '&signUrl=' + url,
        callback: (err, result) => {
          if (result.success) {
            console.log('signUrl cache success')
          }
        }
      });
    },
    isPhoneNume:function (phoneNum) {
        if (!phoneNum){
            return false;
        }else {
            var myreg = /^1[0-9]{10}$/;
            if (!myreg.test(phoneNum)) {
                return false;
            } else {
                return true;
            }
        }
    },
    getNowDate:function () {
        var today=new Date();
        var month=today.getMonth()+1;
        if (month<10){
            month="0"+month;
        }
        var date=today.getDate();
        if (date<10){
            date="0"+date;
        }
        return today.getFullYear()+"-"+month+"-"+date;
    },
    failToast:function (title) {
        var title=title||'操作失败';
        wx.showModal({
            title: '提示',
            showCancel:false,
            confirmText:'关闭',
            content:title
        })
    },
    successToast:function () {
        wx.showToast({
            title: '操作成功',
            duration: 2000
        })
    },
    showLoading:function () {
        wx.showLoading({
            title: '加载中',
            mask: true

        })
    },
    hideLoading:function () {
        wx.hideLoading();
    },
    stopPullRefresh:function () {
        wx.stopPullDownRefresh();
    },
    isPositiveNum:function (num) {
        return p_positiveNum.test(num);
    },
    mergeJson:function (olderJson,newJson) {
        var resultJsonObject={};
        for(var attr in olderJson){
            resultJsonObject[attr]=olderJson[attr];
        }
        for(var attr in newJson){
            resultJsonObject[attr]=newJson[attr];
        }
        return resultJsonObject;
    },
    queryPageList:function (config) {
        var api=this;
        var that = config._this;
        var currentPage = that.data.currentPage;
        var pageSize = api.pageSize;
        var arr=that.data.list||[];
        var paramter=null;
        var first=config.first;
        if (config.data){
            paramter=api.mergeJson(config.data,{
                pagesize: pageSize,
                start: (currentPage - 1) * pageSize
            });
        }else{
            paramter={
                pagesize: pageSize,
                start: (currentPage - 1) * pageSize
            };
        }
        api.fetch({
            url:config.url,
            data: paramter,
            callback: function (e, result) {
                var data = result.list;
                if (data.length) {
                    arr=arr.concat(data);
                    that.setData({
                        loading:false,
                        list: arr
                    })
                    if (result.total<pageSize){
                        that.setData({
                            loadingComplete: true
                        })
                    }
                    if (first){
                        that.setData({
                            isEmpty:true
                        })
                    }
                } else {
                    if (first){
                        that.setData({
                            emptyTitle:config.emptyTitle,
                            isEmpty:false
                        })
                    }
                    that.setData({
                        loadingComplete: true,
                        loading:false
                    })
                }
            }
        })
    },
    doOperation:function (config) {
        let _this=config._this;
        let that=this;
        that.fetch({
            loadTitle:'正在提交',
            beforeFn:function () {
                _this.setData({
                    btnDisabled:true
                })
            },
            url:config.url,
            data:config.data,
            callback:function (err,result) {
                if (result.success){
                    config.callback(result);
                }else{
                    that.failToast(result.errorMsg);
                }
                _this.setData({
                    btnDisabled:false
                })
            }
        })
    },
    strLen:function (str) {
        if (str){
             return str.replace(/[^\x00-\xff]/g,"aa").length;
        }else{
            return 0;
        }
    },
    saveUserInfo:function (userInfo) {
        if (userInfo) {
            this.userId = userInfo.dyrId;
            this.role=userInfo.role;
            this.userPhone=userInfo.mPhone;
            wx.setStorageSync(this.key.USER_PHONE, this.userPhone);
            wx.setStorageSync(this.key.USER_INFO, userInfo);
        }
    },

    _uploadFile:function(filePath,uploadSuccessFunc){
      const uploadTask = wx.uploadFile({
        count: 1,
        url: this.url + '/rest/comment/upload',
        filePath: filePath,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        success: function (result) {
          uploadSuccessFunc(result);
        },
        fail: function (e) {
          console.log(e);
        }
      });
      uploadTask.onProgressUpdate((res) => {
        wx.showLoading({
          title: '上传进度：' + res.progress +'%',
        })
        // console.log('上传进度', res.progress)
        // console.log('已经上传的数据长度', res.totalBytesSent)
        // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })
    },
  _submitComment: function (commentVal, userId, pWrokId, linksId, commentSuccess,photos){
      let that = this;
      that.fetch({
        url: 'rest/work/doAddComment',
        data: {
          commentContent: commentVal,
          userId: userId,
          workId: pWrokId,
          workLinkId: linksId,
          photos: photos
        },
        callback: (err, result) => {
          if (result.success) {
            commentSuccess(result);
          }
        }
      })
    },
  reg__submitComment: function (commentVal, userId, pWrokId, sname,commentSuccess, photos) {
    let that = this;
    that.fetch({
      url: 'rest/work/doAddComment',
      data: {
        commentContent: commentVal,
        userId: userId,
        workId: pWrokId,
        stype:'Register',
        sname: sname,
        photos: photos
      },
      callback: (err, result) => {
        if (result.success) {
          commentSuccess(result);
        }
      }
    })
  },
  _unLaunch: function (workLinkId,unLaunchSuccessFunc){
      let that = this;
      that.fetch({
        url: '/rest/work/doCancel',
        data: {
          workLinkId: workLinkId
        },
        callback: (err, result) => {
          if (result.success) {
            unLaunchSuccessFunc(result);
          }else{
            wx.showToast({
              title: result.msg,
              icon:'none',
              duration:2000
            })
          }
        }
      })
    },
    
  formatDateTime: function(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  loactionSign: function (inOrOut, stype, workId, userId, latitude, longitude,address,successFunc) {
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'O2ABZ-GXFCP-YY5D3-VOVIV-PWJ2Q-D7BKJ' // 必填
    });
    
    var inSign = {};
    inSign.signAddress = address;
    inSign.signTime = new Date().format("yyyy-MM-dd hh:mm:ss");

    inSign.signType = inOrOut == 'in' ? 1 : inOrOut=='out'?2:3; //1签入2签出3到达
    inSign.signX = latitude;
    inSign.signY = longitude;
    inSign.stype = stype;
    inSign.workId = workId;
    wx.getStorage({
      key: 'systemInfo',
      success: function (res) {
        inSign.phone = res.data.model
      },
    });
    inSign.userId = userId
    inSign.signArddessDetail = address;
    // inOrOut == 'in' ? that.setData({ nowAddress: address }) : that.setData({ outAddress: address });

    that.fetch({
      url: 'rest/work/sign',
      data: inSign,
      callback: (err, result) => {
        successFunc();
      }
    })
  },

}

module.exports = Util;
