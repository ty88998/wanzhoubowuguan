import { getDicInfos } from '../../api/indexInfo'
import { getProjectInfo } from '../../api/smallProgram'

const MAX_ROW = 6
// 加载到底部
let loadEnd = false

const appInst = getApp()

Page({
  data: {
    showTable: 0,
    showCategory: [],
    showData: []
  },

  onLoad() {
    loadEnd = false
    this._initData()
  },

  async _initData() {
    const result = await getDicInfos()
    this.setData({ showCategory: result.data })
    this._getProjectInfo(result.data[0].recNo)
  },

  /** 获取展览类型 */
  _getProjectInfo(projectType) {
    if (!loadEnd) {
      const { showData } = this.data
      const touristNo = appInst.globalData.touristNo || ""
      const page = Math.ceil(showData.length / MAX_ROW) + 1
      getProjectInfo({ page, rows: MAX_ROW, projectType, touristNo })
        .then(res => {
          if (res.data.length !== MAX_ROW) {
            loadEnd = true
          }
          const { showData } = this.data
          this.setData({
            showData: [...showData, ...res.data]
          })
          wx.stopPullDownRefresh()
        }).catch(err => {
          loadEnd = true
          console.log(err)
        })
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /** 分类切换跳转方法 */
  switchToShow(e) {
    loadEnd = false
    const { index } = e.currentTarget.dataset
    const { showCategory } = this.data
    this.setData({
      showTable: index,
      showData: []
    })
    this._getProjectInfo(showCategory[index].recNo)
  },

  onReachBottom() {
    const { showCategory, showTable } = this.data
    this._getProjectInfo(showCategory[showTable].recNo)
  },
  onPullDownRefresh() {
    loadEnd = false
    this.setData({ showData: [] })
    const { showCategory, showTable } = this.data
    this._getProjectInfo(showCategory[showTable].recNo)
  }
})