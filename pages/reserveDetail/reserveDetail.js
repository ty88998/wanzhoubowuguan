import { loginIntercept } from '../../utils/loginUtils'
import { getReserveInfo, delteSgReserveInfo } from '../../api/reserveInfo'

Page({
  data: {
    recNo: '',
    userInfo: {
    }
  },
  onLoad(options) {
    this.setData({ recNo: options.recNo })
  },
  onShow() {
    this._getReserveDetail(this.data.recNo)
  },
  goToRewrite() {
    loginIntercept({ url: '/pages/addReserve/addReserve', recNo: this.data.recNo })
  },
  goToDelete() {
    wx.showModal({
      title: '确认删除预约?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: async result => {
        if (result.confirm) {
          try {
            const res = await delteSgReserveInfo({ recNo: this.data.recNo })
            if (res.code === '0000') {
              wx.navigateBack({
                delta: 1
              })
            }
          } catch (err) {
            console.log('err: ', err)
          }
        }
      }
    });
  },
  async _getReserveDetail(recNo) {
    try {
      const res = await getReserveInfo({ recNo })
      this.setData({
        userInfo: res.data
      })
    } catch (error) {
      console.log('error: ', error)
    }
  }
})