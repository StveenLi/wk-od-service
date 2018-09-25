'use strict';

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    type: {
      type: String,
      value: 'horizon'
    },

    hasDesc: {
      type: Boolean,
      value: false
    },

    steps: { // 必须
      type: Array,
      value: []
    },
    className: String
  },
  methods:{
    _flowBind: function(e){
      // console.log(e)
      this.triggerEvent("flowBind",e.currentTarget);
    }
  }
});