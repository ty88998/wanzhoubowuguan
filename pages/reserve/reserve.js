import { loginIntercept } from '../../utils/loginUtils'
import { getMuseums } from '../../api/reserveInfo'

Page({

  data: {
    museumInfo: {}
  },

  onLoad() {
    this._getMuseums()
  },
  async _getMuseums() {
    try {
      const res = await getMuseums()
      this.setData({ museumInfo: res.data })
    } catch (err) {
      console.log(err)
    }
  },
  goToAddReserve() {
    if (this.data.museumInfo.isOpen === "1") {
      loginIntercept({ url: "/pages/addReserve/addReserve" })
    } else {
      wx.showToast({ title: '暂未开放', icon: 'none' })
    }
  }
})