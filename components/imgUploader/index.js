// components/imgUploader/index.js
const App = getApp();
const api = App.api;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wkType: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
      // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
      }
    },
    ptFiles: { // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: [], // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
        
      }
    },
    wkId: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer(newVal, oldVal, changedPath) {
      }
    },
    imgTitle:String,
    imgCode:String
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

    
    delImage: function (e) {
      let that = this;
      
      api.fetch({
        url: 'rest/comment/toDeteleImg',
        data: {
          fileId:e.currentTarget.dataset.currentimg.id
        },
        callback: (err, result) => {
          if (result.success) {
            let fis = that.data.ptFiles;
            let index = 0
            for (let i = 0; i < fis.length; i++) {
              if (e.target.dataset.currentimg.id == fis[i].id) {
                index = i
                break;
              }
            }
            fis.splice(index, 1);
            this.setData({
              // files: fis,
              ptFiles: fis
            })
            this.triggerEvent('csip', fis);
          }
        }
      })
      
    },
    previewImage: function (e) {
      let _n_files = []
      for(let img of this.data.ptFiles){
        _n_files.push(img.url)
      }
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: _n_files // 需要预览的图片http链接列表
      })
    },
    chooseImage: function (e) {
      var that = this;
      let pfs = that.data.ptFiles;
      wx.chooseImage({
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        count: 1,
        success: function (res) {
          for (let tempImg of res.tempFilePaths) {
            wx.uploadFile({
              url: api.url + '/rest/comment/upload',
              filePath: tempImg,
              name: 'file',
              header: {
                "Content-Type": "multipart/form-data",
                "chartset": "utf-8"
              },
              success: function (result) {
                var resultData = JSON.parse(result.data)                
                if (resultData.success) {
                  pfs.push({ "url": resultData.url, "filePro": that.data.imgCode,"fileName":that.data.imgTitle});
                  that.setData({
                    ptFiles: pfs
                  })
                  that.triggerEvent('csip', pfs);
                  api.cacheImg(that.data.wkId, that.data.wkType, resultData.url,that.data.imgCode,that.data.imgTitle);
                }
              },
              fail: function (e) {
                console.log(e);
              }
            })
          }
          
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // that.setData({
          //   ptFiles: that.data.ptFiles.concat(res.tempFilePaths)
          // });
        }
      })
    }
  }
})
