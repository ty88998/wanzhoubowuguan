import { addTouristInfo } from '../../api/indexInfo'
import { setItem, getItem } from "../../utils/store"
import { urlParse } from "../../utils/loginUtils"

let nextInfo = ''
const appInst = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /** 获取页面跳转信息 */
  onLoad(options) {
    if (options.nextInfo) {
      nextInfo = JSON.parse(options.nextInfo)
    }
  },

  /** 获取用户信息 */
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: res => {
          setItem("userInfo", res.userInfo)
          this._getTouristNo(res.userInfo)
        }
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权'
      })
    }
  },

  /** 获取用户编号,并跳转到新页面 */
  _getTouristNo(userInfo) {
    const { nickName, city, avatarUrl, gender } = userInfo
    const openId = getItem('openid')
    addTouristInfo({
      wxName: nickName,
      city,
      headImg: avatarUrl,
      openId,
      sex: gender
    }).then(res => {
      setItem("touristNo", res.recNo)
      appInst.globalData.touristNo = res.recNo
      if (nextInfo) {
        wx.redirectTo({ url: urlParse(nextInfo) })
      } else {
        wx.navigateBack({ delta: 1 })
      }
    })
  }
})