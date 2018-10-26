// pages/launchPages/saledetail/saledetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    flag: 0,
    currentTab: 0,
    showModal:false,
    scrollLeft:0,
    winHeight:'',
    azsj:'请选择 >',
    
    pt:'请选择 >',
    index:'',
    companyname: ['上海洁先实业有限公司', '北京安优净科技有限公司', '深圳食卫科技有限公司', '上海洁先智能科技有限公司'],
    companyname_:'',
      

    khlx: '请选择 >',
    index1:'',
    clienttype: ['直销客户', '代理商客户'],
    clienttype_:'',
    
    
    xwjjx: '请选择 >',
    index2:'',
    dishwashermodel: ['60D+Suma分配器', '60S+Suma分配器', '60D+Suma分配器', '60S+Suma分配器',],
    dishwashermodel_:'',

   
    // 另配分配器
    lpfpq: '请选择 >',
    index3:'',
    distributor: ['Suma分配器', 'D3000分配器'],
    distributor_:'',
    
    //其他配件
    qtpj: '请选择 >',
    index4:'',
    parts: ['预洗缸(FT-5100A)', '烘干模块(10Kw)', '烘干机(200RE)', '烘干机(200RS)', '无'],
    parts_:'',
    
    //每月发货计划
    fhjh: '请选择 >',
    index5:'',
    delplan: ['(2+1+0.5)每月', '(3+2+0.5)每月', '(6+4+1)每月', '(2+1+0.5)每2月'],
    delplan_:'',
    
    //收货地址
    shdz: '请选择 >',
    index6:'',
    profile: ['客户安装地址', '系统默认地址', '其他备注请说明'],
    profile_:'',
    
    //连锁客户
    lskh: '请选择 >',
    index7:'',
    customer: ['食其家', '凯瑞集团', '眉州东坡'],
    customer_:'',
    
    //月度/季度开票
    kp: '请选择 >',
    index8:'',
    invoice: ['月度开票', '季度开票'],
    invoice_:'',
    
    //押金
    yj: '请选择 >',
    index9:'',
    cash: ['有', '无'],
    cash_:'',
    
    //是否回购
    hg: '请选择 >',
    index10:'',
    outsource: ['回购', '外购'],
    outsource_:'',

    //客户名称
    custormname:'',
    //终端客户名称
    zd_custormname:'',
    //负责销售
    sell:'',


    //安装联系人
    setupman:'',
    //安装联系人电话
    setupnumber:'',
    //安装地址
    setupadddress:'',
    //安装街道详细地址
    setupdetail:'',
    //安装具体位置
    setupdetailaddress:'',
    

    //开票类型
    kp_type:'',
    //开票抬头
    kp_company:'',
    //税号
    tfn:'',
    //开票地址
    kp_address:'',
    //开户银行名称
    kp_bankname:'',
    //开户银行账号
    kp_banknumber: '',


    //收票联系人
    sp_name:'',
    sp_number:'',
    sp_address:'',
    sp_money:'',
    sp_yj:'',
    sp_request:'',








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
      },
      
    });
    
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          user: res.data
        })
      },
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

  //picker
  //000000
  
  bindPickerChange(e){
    let that = this;
    that.setData({
      index:e.detail.value,
      pt:"",
      companyname_: that.data.companyname[e.detail.value]
    })
    
  },
  
  //111111
  
  
  bindPickerChange1(e) {
    let that = this;
     that.setData({
      index1: e.detail.value,
       khlx: "",
       clienttype_: that.data.clienttype[e.detail.value]
    })
  },
  
  //22222222
    
  bindPickerChange2(e) {
    let that = this;
    that.setData({
      index2: e.detail.value,
      xwjjx: "",
      dishwashermodel_: that.data.dishwashermodel[e.detail.value],
    })
    //console.log(this.data.dishwashermodel_)
  },
  
  //3333333333
  bindPickerChange3(e) {
    let that = this;
    that.setData({
      index3: e.detail.value,
      lpfpq: "",
      distributor_: that.data.distributor[e.detail.value],
    })
  },
  //4444444444444
  bindPickerChange4(e) {
    let that = this;
    that.setData({
      index4: e.detail.value,
      qtpj: "",
      parts_: that.data.parts[e.detail.value],
    })
  },
  //5555555555
  bindPickerChange5(e) {
    this.setData({
      index5: e.detail.value,
      fhjh: ""
    })
  },
  //预计安装时间
  bindDateChange: function (e) {
    let that = this;
    that.setData({
      date: e.detail.value,
      azsj:'',
      delplan_: that.data.delplan[e.detail.value]
    })
  },

  //6666666666666666
  bindPickerChange6: function (e) {
    let that = this;
    that.setData({
      index6: e.detail.value,
      shdz: '',
      profile_: that.data.profile[e.detail.value]
    })
  },
  //777777777
  bindPickerChange7: function (e) {
    let that = this;
    that.setData({
      index7: e.detail.value,
      lskh: '',
      customer_: that.data.customer[e.detail.value]
    })
  },
  //88888888888
  bindPickerChange8: function (e) {
    let that = this;
    that.setData({
      index8: e.detail.value,
      kp: '',
      invoice_: that.data.invoice[e.detail.value]
    })
  },
  //99999999999
  bindPickerChange9: function (e) {
    let that = this;
    that.setData({
      index9: e.detail.value,
      yj: '',
      cash_: that.data.cash[e.detail.value]
    })
  },
  //101010101010
  bindPickerChange10: function (e) {
    let that = this;
    this.setData({
      index10: e.detail.value,
      hg: '',
      outsource_: that.data.outsource[e.detail.value]
    })
    
  },
  
  //去空格
  //
  verification(e){
    var name =e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    })
  },
  
  //add
  //客户名称
  add_custormname(e){
    let that = this;
    that.setData({
     custormname:e.detail.value
   }) 
  },
  //终端客户名称
  add_zd_custormname(e){
    let that = this;
    that.setData({
      zd_custormname: e.detail.value
    }) 
  },
  //负责销售
  add_sell(e){
    let that = this;
    that.setData({
      sell: e.detail.value
    })
  },

  //安装联系人
  add_setupman(e){
    let that = this;
    that.setData({
      setupman: e.detail.value
    })
  },
  //安装联系人电话
  add_setupnumber(e){
    let that = this;
    that.setData({
      setupnumber: e.detail.value
    })
  },
  //安装地址
  add_setupadddress(e){
    let that = this;
    that.setData({
      setupadddress: e.detail.value
    })
  },
  
  //安装街道详细地址
  add_setupdetail(e){
    let that = this;
    that.setData({
      setupdetail: e.detail.value
    })
  },

  //安装具体位置
  add_setupdetailaddress(e) {
    let that = this;
    that.setData({
      setupdetailaddress: e.detail.value
    })
  },

  
  
  //开票类型
  add_kp_type(e) {
    let that = this;
    that.setData({
      kp_type: e.detail.value
    })
  },
  //开票抬头
  add_kp_company(e) {
    let that = this;
    that.setData({
      kp_company: e.detail.value
    })
  },
  //税号
  add_tfn(e) {
    let that = this;
    that.setData({
      tfn: e.detail.value
    })
  },
  
  //开票地址
  add_kp_address(e) {
    let that = this;
    that.setData({
      kp_address: e.detail.value
    })
  },
  //开户银行名称
  add_kp_bankname(e) {
    let that = this;
    that.setData({
      kp_bankname: e.detail.value
    })
  },
  //开户银行账号
  add_kp_banknumber(e) {
    let that = this;
    that.setData({
      kp_banknumber: e.detail.value
    })
  },


  //收票联系人
  add_sp_name(e) {
    let that = this;
    that.setData({
      sp_name: e.detail.value
    })
  },
  //收票联系人电话
  add_sp_number(e) {
    let that = this;
    that.setData({
      sp_number: e.detail.value
    })
  },
  //收票地址
  add_sp_address(e) {
    let that = this;
    that.setData({
      sp_address: e.detail.value
    })
  },
  //月租金
  add_sp_money(e) {
    let that = this;
    that.setData({
      sp_money: e.detail.value
    })
  },
  //押金金额
  add_sp_yj(e) {
    let that = this;
    that.setData({
      sp_yj: e.detail.value
    })
  },
  //押金要求
  add_sp_request(e) {
    let that = this;
    that.setData({
      sp_request: e.detail.value
    })
  },
  
  
  
  
  
  //提交
  finalSub(e){
    
    if(e.currentTarget.dataset.num == 0){
        //基本信息
      





       this.setData({
         currentTab:1
       })

    } else if (e.currentTarget.dataset.num == 1){
        //安装信息

      this.setData({
        currentTab: 2
      })


    } else if (e.currentTarget.dataset.num == 2){
        //开票信息
      
      
      this.setData({
        currentTab: 3
      })

      }else{
        //收票信息

      // api.fetch({
      //   url: 'rest/work/doBigPatch',
      //   data: {
      //     userId: that.data.user.userId,

      //   },
      //   callback: (err, result) => {
      //     if (result.success) {

      //       wx.navigateBack({
      //       })
      //     }
      //   }
      // });

      }




   

  },
  
  

})