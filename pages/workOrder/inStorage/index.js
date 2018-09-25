// pages/workOrder/inStorage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "2018-06-01",
    disabled: {
      title: '用户信息',
      disabled: true,
      value: '输入框已禁用'

    },
    selectIndex: 0,
    typeSelect: ["类型A", "类型B", "类型C"],
    stepper: {
      // 当前 stepper 数字
      stepper: 1,
      // 最小可到的数字
      min: 1,
      // 最大可到的数字
      max: 100,
      // 小尺寸, 默认大尺寸
      size: 'small'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  handleZanStepperChange({
    // stepper 代表操作后，应该要展示的数字，需要设置到数据对象里，才会更新页面展示
    detail: stepper
  }) {
    this.setData({
      'stepper.stepper': stepper
    });
  },
  bindSelectChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      selectIndex: e.detail.value
    })
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
  
  }
})