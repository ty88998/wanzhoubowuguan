// pages/showDetails/showDetails.js
import { toEntityDisplay } from '../../api/indexInfo';
Page({
  data: {
    entityDisplay: {}
  },

  onLoad: function (options) {
    const { recNo } = options
    this.getEntityDisplay(recNo)
    // 
  },
  getEntityDisplay: function (recNo) {
    toEntityDisplay({ recNo}).then(res => {
      wx.setNavigationBarTitle({ title: res.title })
        this.setData({
          entityDisplay: res
        })
      })
  },
})