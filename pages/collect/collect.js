// pages/collect/collect.js
import { getBrowsingHistory, getCollectHistory, getBrowseEmpty } from '../../api/personalCenter'

const appInst = getApp();

const MAX_LIMIT = 8

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showData: [],
    column: 2
  },

  onLoad(options) {
    this.setData({
      status: options.status
    })
    if (options.status == 1) {
      wx.setNavigationBarTitle({ title: '我的观看历史' })
      this.setData({ column: 3 })
    }
    this.getCollections()
  },

  // 我的收藏
  getCollections() {
    const { touristNo } = appInst.globalData
    const { showData, status } = this.data
    const page = Math.ceil(showData.length / MAX_LIMIT) + 1
    if (status == 0) {
      getCollectHistory({ page, rows: MAX_LIMIT, touristNo })
        .then(res => {
          this.setData({ showData: [...showData, ...res.data] })
          wx.stopPullDownRefresh()
        }).catch(err => console.log(err))
    } else {
      getBrowsingHistory({ page, rows: MAX_LIMIT, touristNo })
        .then(res => {
          this.setData({ showData: [...showData, ...res.data] })
          wx.stopPullDownRefresh()
        }).catch(err => console.log(err))
    }
  },
  clearHistory() {
    const { touristNo } = appInst.globalData
    getBrowseEmpty({ touristNo }).then(() => {
      this.setData({
        showData: []
      })
    }).catch(err => console.log(err))
  },
  onPullDownRefresh() {
    this.setData({ showData: [] })
    this.getCollections()
  },
  onReachBottom() {
    this.getCollections()
  }
})