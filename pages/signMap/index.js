// pages/signMap/index.js

var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const App = getApp();
const api = App.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageDetail:{},
    currentAddr:'',
    scrollTop: 100,
    poiPageIndex:1,
    near_locs:[],
    searchPoiVal:'',
    markers: [],
  },


  locationSubmit:function(){
    let that = this;
    const { signInfo, markers, currentAddr} = this.data;
    api.loactionSign(signInfo.inOrOut, signInfo.stype, signInfo.workId, signInfo.userId, markers[0].latitude, markers[0].longitude, currentAddr,that.signSuccessFunc);
  },

  signSuccessFunc:function(){
    const { signInfo, markers, currentAddr } = this.data;

    wx.showToast({
      title: '签到成功!',
      icon:'none',
      duration:2000
    })
    if(signInfo.stype == 'Visit'){
      if(signInfo.inOrOut == 'in'){
        wx.setStorageSync('visitInAddr', currentAddr)
      }
      if (signInfo.inOrOut == 'out'){
        wx.setStorageSync('visitOutAddr', currentAddr)
      }
    }

    wx.navigateBack({
    });
  },
  lower: function (e) {
    this.pageSearch();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    let item = JSON.parse(options.item);
    this.setData({
      signInfo: item
    })
    that.getNowLocation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getNowLocation(){
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'O2ABZ-GXFCP-YY5D3-VOVIV-PWJ2Q-D7BKJ' // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {

        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes);
            that.setData({
              pageDetail: addressRes.result,
              currentAddr: addressRes.result.address,
              latitude: res.latitude,
              longitude: res.longitude,
              circles: [{
                latitude: res.latitude,
                longitude: res.longitude,
                // color: 'rgba(0,0,0,0)',
                // fillColor: '#8000000F',
                radius: 300,
                strokeWidth: 2
              }],
              markers: [{
                iconPath: "/images/marker_red.png",
                id: 0,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 35,
                height: 35
              }],
            })
          }
        })
      }
    })
  },

  chooseLoc:function(e){
    let that = this;
    let item = e.currentTarget.dataset.item;
    console.log(item)
    that.setData({
      // latitude: item.latitude,
      // longitude: item.longitude,
      currentAddr:item.title,
      markers: [{
        iconPath: "/images/marker_red.png",
        id: 0,
        latitude: item.latitude,
        longitude: item.longitude,
        width: 35,
        height: 35
      }],
    })
  },


  searchPoi:function(e){

    this.setData({
      searchPoiVal:e.detail.value,
      poiPageIndex:1,
      near_locs: [],

    })
    this.inputSearch(e.detail.value);
  },

  reverse_search: function (){
    let that = this;
    const { latitude, longitude, poiPageIndex, near_locs, searchPoiVal} = this.data
    let cateStr = '';
    if (searchPoiVal!=''){
      cateStr = ';category=' + searchPoiVal;
    }
    console.log('policy=2;radius=1000;page_size=20;page_index=' + poiPageIndex + cateStr)
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      get_poi:1,
      poi_options: 'policy=2;radius=1000;page_size=20;page_index=' + poiPageIndex + cateStr,
      success: function (res) {
        
        for(let poiItem of res.result.pois){
          near_locs.push(poiItem);
        }
        let newPoiIndex = poiPageIndex+1;
        that.setData({
          near_locs: near_locs,
          poiPageIndex: newPoiIndex
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },


  poiSearch: function (e){
    const { latitude, longitude, } = this.data

    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: e.currentTarget.dataset.v,  //搜索关键词
      location: latitude + ',' + longitude,  //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._distance<1500){
            mks.push({ // 获取返回结果，放到mks数组中
              title: res.data[i].title,
              id: res.data[i].id,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              distance: res.data[i]._distance,
              iconPath: "/images/marker_red.png", //图标路径
              width: 20,
              height: 20
            })
          }
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          near_locs: mks
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },


  inputSearch: function (address) {
    const { latitude, longitude } = this.data

    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: address,  //搜索关键词
      location: latitude + ',' + longitude,  //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._distance < 1500) {
            mks.push({ // 获取返回结果，放到mks数组中
              title: res.data[i].title,
              id: res.data[i].id,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              distance: res.data[i]._distance,
              iconPath: "/images/marker_red.png", //图标路径
              width: 20,
              height: 20
            })
          }
        }
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          near_locs: mks
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },


  pageSearch: function () {
    let { latitude, longitude, searchPoiVal, poiPageIndex, near_locs} = this.data
    if (searchPoiVal == ''){
      searchPoiVal='餐厅'
    }
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: searchPoiVal,  //搜索关键词
      location: latitude + ',' + longitude,  //设置周边搜索中心点
      page_size:20,
      page_index: poiPageIndex,
      success: function (res) { //搜索成功后的回调
        var mks = near_locs;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._distance < 1500) {
            mks.push({ // 获取返回结果，放到mks数组中
              title: res.data[i].title,
              id: res.data[i].id,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              distance: res.data[i]._distance,
              iconPath: "/images/marker_red.png", //图标路径
              width: 20,
              height: 20
            })
          }
        }
        let newPoiIndex = poiPageIndex + 1;
        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          near_locs: mks,
          poiPageIndex: newPoiIndex
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
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

  }
})