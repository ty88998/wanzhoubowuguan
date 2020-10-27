import { loginIntercept } from '../../utils/loginUtils'
import { getUserReserveInfo } from '../../api/reserveInfo'

const count = 5
const appInst = getApp()
let isGetLast = false

Page({

  data: {
    noReserve: true,
    recordData: []
  },
  onLoad() {
    this._getMyReserve()
  },
  onShow() {
    isGetLast = false
    this.setData({ recordData: [] })
    this._getMyReserve()
  },
  goToDetail(e) {
    const { recno } = e.currentTarget.dataset
    loginIntercept({ url: '/pages/reserveDetail/reserveDetail', recNo: recno })
  },

  /** 获取我的预约记录 */
  async _getMyReserve() {
    const { recordData } = this.data
    const start = Math.ceil(recordData.length / count)
    const openid = appInst.globalData.openId
    if (!isGetLast) {
      wx.stopPullDownRefresh()
      try {
        const res = await getUserReserveInfo({ type: 1, start, count, openid })
        if (res.data.length < count) isGetLast = true
        res.data.map(item => {
          if (item.isWrite == null) { item.isWrite = "2" }
          item.year = item.appointmentDate.slice(0, 4)
          item.appointmentDate = item.appointmentDate.slice(5, item.appointmentDate.length)
        })
        this.setData({
          recordData: res.data,
          noReserve: false
        })
      } catch (error) {
        console.log('error: ', error)
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    isGetLast = false
    this.setData({ recordData: [] })
    this._getMyReserve()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this._getMyReserve()
  }
})