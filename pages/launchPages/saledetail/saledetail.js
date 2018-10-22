// pages/launchPages/saledetail/saledetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    currentTab: 0,
    showModal:false,
    scrollLeft:0,
    winHeight:'',
    azsj:'请选择 >',
    disnone:false,
    pt:'请选择 >',

    companyname:[
      { name: '上海洁先实业有限公司', value:'上海洁先实业有限公司'},
      { name: '北京安优净科技有限公司', value:'北京安优净科技有限公司'},
      { name: '深圳食卫科技有限公司', value:'深圳食卫科技有限公司' },
      { name: '上海洁先智能科技有限公司', value:'上海洁先智能科技有限公司' }

    ],
    disnone1:false,
    showModal1:false,
    khlx: '请选择 >',
    clienttype: [
      { name: '直销客户', value: '直销客户' },
      { name: '代理商客户', value: '代理商客户' },
    ],
    disnone2:false,
    showModal2: false,
    xwjjx: '请选择 >',
    dishwashermodel: [
      { name: '60D+Suma分配器', value: '60D+Suma分配器' },
      { name: '60S+Suma分配器', value: '60S+Suma分配器' },
      { name: '60D+Suma分配器', value: '60D+Suma分配器' },
      { name: '60S+Suma分配器', value: '60S+Suma分配器' }

    ],
    // 另配分配器
    disnone3: false,
    showModal3: false,
    lpfpq: '请选择 >',
    distributor: [
      { name: 'Suma分配器', value: 'Suma分配器' },
      { name: 'D3000分配器', value: 'D3000分配器' },
    ],
    //其他配件
    disnone4: false,
    showModal4: false,
    qtpj: '请选择 >',
    parts: [
      { name: '预洗缸(FT-5100A)', value: '预洗缸(FT-5100A)' },
      { name: '烘干模块(10Kw)', value: '烘干模块(10Kw)' },
      { name: '烘干机(200RE)', value: '烘干机(200RE)' },
      { name: '烘干机(200RS)', value: '烘干模块(200RS)' },
      { name: '无', value: '无' },
    ],
    //每月发货计划
    disnone5: false,
    showModal5: false,
    fhjh: '请选择 >',
    delplan: [
      { name: '(2+1+0.5)每月', value: '(2+1+0.5)每月' },
      { name: '(3+2+0.5)每月', value: '(3+2+0.5)每月' },
      { name: '(6+4+1)每月', value: '(6+4+1)每月' },
      { name: '(2+1+0.5)每2月', value: '(2+1+0.5)每2月' },
      
    ],
    //收货地址
    disnone6: false,
    showModal6: false,
    shdz: '请选择 >',
    profile: [
      { name: '客户安装地址', value: '客户安装地址' },
      { name: '系统默认地址', value: '系统默认地址' },
      { name: '其他备注请说明', value: '其他备注请说明' },
      
    ],
    //连锁客户
    disnone7: false,
    showModal7: false,
    lskh: '请选择 >',
    customer: [
      { name: '食其家', value: '食其家' },
      { name: '凯瑞集团', value: '凯瑞集团' },
      { name: '眉州东坡', value: '眉州东坡' },

    ],
    //月度/季度开票
    disnone8: false,
    showModal8: false,
    kp: '请选择 >',
    invoice: [
      { name: '月度开票', value: '月度开票' },
      { name: '季度开票', value: '季度开票' },
      
    ],
    //押金
    disnone9: false,
    showModal9: false,
    yj: '请选择 >',
    cash: [
      { name: '有', value: '有' },
      { name: '无', value: '无' },

    ],
    //是否回购
    disnone10: false,
    showModal10: false,
    hg: '请选择 >',
    outsource: [
      { name: '回购', value: '回购' },
      { name: '外购', value: '外购' },

    ],
    
  },
  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        // console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    
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
  switchNav(e) {
    let that = this;
    var id = e.target.id;
    if (that.data.currentTab == id) {
      return false;
    } else {
      that.setData({
        currentTab: id
      })
    }
    that.setData({
      flag: id
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,
      flag: e.detail.current
    });
    
  },

  //000000
  
  radioChange(e){
    let that = this;
    that.setData({
      showModal:false,
      pt:e.detail.value,
      disnone: true
    })
  },
  changevalue(){
      this.setData({
      pt: '请选择 >',
      disnone: false
    })
  },

  changeShowModel() {
    this.setData({
      showModal: true
    })
  },
  
  //111111
  
  
  changeShowModel1(){
    this.setData({
      showModal1: true,

    })
  },
  radioChange1(e){
    let that = this;
    that.setData({
      showModal1: false,
      khlx: e.detail.value,
      disnone1: true
    })
  },
  changevalue1(){
    this.setData({
      khlx: '请选择 >',
      disnone1: false
    })
  },
  
  //22222222
    
  changeShowModel2() {
    this.setData({
      showModal2: true
    })
  },
  radioChange2(e) {
    let that = this;
    that.setData({
      showModal2: false,
      xwjjx: e.detail.value,
      disnone2:true
    })
  },
  changevalue2() {
    this.setData({
      xwjjx: '请选择 >',
      disnone2: false
    })
  },
  
  //3333333333
  changeShowModel3() {
    this.setData({
      showModal3: true
    })
  },
  radioChange3(e) {
    let that = this;
    that.setData({
      showModal3: false,
      lpfpq: e.detail.value,
      disnone3: true
    })
  },
  changevalue3() {
    this.setData({
      lpfpq: '请选择 >',
      disnone3: false
    })
  },
  //4444444444444
  changeShowModel4() {
    this.setData({
      showModal4: true
    })
  },
  radioChange4(e) {
    let that = this;
    that.setData({
      showModal4: false,
      qtpj: e.detail.value,
      disnone4: true
    })
  },
  changevalue4() {
    this.setData({
      qtpj: '请选择 >',
      disnone4: false
    })
  },
  //5555555555
  changeShowModel5() {
    this.setData({
      showModal5: true
    })
  },
  radioChange5(e) {
    let that = this;
    that.setData({
      showModal5: false,
      fhjh: e.detail.value,
      disnone5: true
    })
  },
  changevalue5() {
    this.setData({
      fhjh: '请选择 >',
      disnone5: false
    })
  },
  //预计安装时间
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      azsj:''
    })
  },

  //6666666666666666
  changeShowModel6() {
    this.setData({
      showModal6: true
    })
  },
  radioChange6(e) {
    let that = this;
    that.setData({
      showModal6: false,
      shdz: e.detail.value,
      disnone6: true
    })
  },
  changevalue6() {
    this.setData({
      shdz: '请选择 >',
      disnone6: false
    })
  },
  //777777777
  changeShowModel7() {
    this.setData({
      showModal7: true
    })
  },
  radioChange7(e) {
    let that = this;
    that.setData({
      showModal7: false,
      lskh: e.detail.value,
      disnone7: true
    })
  },
  changevalue7() {
    this.setData({
      lskh: '请选择 >',
      disnone7: false
    })
  },
  //88888888888
  changeShowModel8() {
    this.setData({
      showModal8: true
    })
  },
  radioChange8(e) {
    let that = this;
    that.setData({
      showModal8: false,
      kp: e.detail.value,
      disnone8: true
    })
  },
  changevalue8() {
    this.setData({
      kp: '请选择 >',
      disnone8: false
    })
  },
  //99999999999
  changeShowModel9() {
    this.setData({
      showModal9: true
    })
  },
  radioChange9(e) {
    let that = this;
    that.setData({
      showModal9: false,
      yj: e.detail.value,
      disnone9: true
    })
  },
  changevalue9() {
    this.setData({
      yj: '请选择 >',
      disnone9: false
    })
  },
  //101010101010
  changeShowModel10() {
    this.setData({
      showModal10: true
    })
  },
  radioChange10(e) {
    let that = this;
    that.setData({
      showModal10: false,
      hg: e.detail.value,
      disnone10: true
    })
  },
  changevalue10() {
    this.setData({
      hg: '请选择 >',
      disnone10: false
    })
  },
  finalSub(e){
    console.log(e);
  }

})