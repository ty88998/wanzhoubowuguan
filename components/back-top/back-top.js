// components/back-top/back-top.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    right: {
      type: Number,
      value: 20
    },
    bottom: {
      type: Number,
      value: 20
    },
    zIndex: {
      type: Number,
      value: 100
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
    back2Top(){
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  }
})
