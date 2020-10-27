// pages/showMore/showMore.js
import { getEntityDisplays } from '../../api/indexInfo'
import { getItem } from "../../utils/store"

const MAX_ROW = 6

Page({
  data: {
    page: 1,
    liveShow: []
  },

  goToPage: function (e) {
    const { recno } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/exhibitentity/exhibitentity?recNo=${recno}`
    })
  },

  getDisplays(page) {
    getEntityDisplays({ page, rows: MAX_ROW }).then(res => {
        const { liveShow } = this.data
        res.data.map(item => liveShow.push({ img: item.thumbnail, title: item.title, viewer: item.browseNum, recno: item.recNo }))
        this.setData({
          liveShow
        })
        wx.stopPullDownRefresh()
      })
  },

  onLoad: function (options) {
  },

  onReady: function () {
    this.getDisplays(1)
  },

  onPullDownRefresh: function () {
    this.setData({ liveShow: [], page: 1 })
    this.getDisplays(1)
  },

  onReachBottom: function () {
    const { page } = this.data
    this.getDisplays(page + 1)
    this.setData({ page: page + 1 })
  }
})