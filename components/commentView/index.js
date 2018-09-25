// components/commentView/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    comments:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage: function (e) {
      wx.previewImage({
        current: e.currentTarget.id,// 当前显示图片的http链接
        urls: [e.currentTarget.id] // 需要预览的图片http链接列表
      })
    },
  }
})
