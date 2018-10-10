// components/workComment/index.js
const App = getApp();
const api = App.api;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPopup:{
      type: Boolean,
      value: false
    },
    commentVal:{
      type:String,
      value:''
    },
    files:{
      type:Array,
      value:[]
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    files:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    togglePopup_false: function () {
      this.setData({
        showPopup: !this.data.showPopup,
        commentVal: '',
      });
      this._popupTarigger();

    },


    lostFouse:function(){
      this.setData({
        commentVal: '',
      })
      this._popupTarigger();

    },

    // 9.17 做到这里  --组件数据未保存
    togglePopup: function (e) {
      let that = this;
      that.triggerEvent('subComment', e)
      this.setData({
        showPopup: !this.data.showPopup,
        commentVal: '',

      })
      this._popupTarigger();
    },
    previewImage: function (e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      })
    },
    _popupTarigger:function(e){
      
      this.triggerEvent('popStatusChange', this.data.showPopup)
    },
    textAreaChange: function (e) {
      this.triggerEvent('textAreaChange', e.detail)
    },
    chooseImage:function(e){
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        count: 3,
        success: function (res) {
          for (let tempImg of res.tempFilePaths) {
            wx.uploadFile({
              url: api.url + '/rest/comment/upload',
              filePath: tempImg,
              name: 'file',
              header: {
                "Content-Type": "multipart/form-data"
              },
              success: function (result) {
                var resultData = JSON.parse(result.data)
                // let pfs = that.data.photoFiles;
                // if (resultData.success) {
                //   pfs.push(resultData.url);
                //   that.setData({
                //     photoFiles: pfs
                //   })
                // }
                that.triggerEvent('pathTo', result.data)
              },
              fail: function (e) {
                console.log(e);
              }
            })
          }
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: that.data.files.concat(res.tempFilePaths)
          });
        }
      })
    },
    delImage:function(e){
      let fis = this.data.files;
      let index = fis.indexOf(e.target.dataset.currentimg)
      fis.splice(index, 1);
      this.setData({
        files: fis,
      })
      this.triggerEvent('delCommentImage', index)
    }
  }
})
