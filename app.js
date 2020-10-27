//app.js
import { baseApi, getItem, setItem } from './utils/store'

App.baseApi = baseApi

App({
  onLaunch() {
    wx.getSetting({
      success: result => {
        if (result.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              setItem("userInfo", res.userInfo)
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: getItem("userInfo"),
    touristNo: getItem("touristNo"),
    museumNo: getItem("museumNo"),
    openId: getItem("openid")
  }
})