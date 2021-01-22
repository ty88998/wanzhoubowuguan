//app.js
import { baseApi, getItem, setItem } from './utils/store'

App.baseApi = baseApi;
App({
  onLaunch(options) {
    const { scene } = options;
    this.globalData.isSinglePage = scene;
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
    // //开启后台定位--前后台均可接受信息
    // wx.startLocationUpdateBackground({
    //   success(res){
    //     console.log('开启后台定位',res)
    //   },
    //   fail: function(err) {
    //     console.log('开启失败',err)
    //   }
    // })
    // //开启后台定位--前台接受信息
    // wx.startLocationUpdate({
    //   success(res){
    //     console.log('成功',res)
    //   },
    //   fail: function(err) {
    //     console.log('成功',err)
    //   }
    // })
    // // 监听实时地理位置变化事件
    // wx.onLocationChange(function(res) {
    //   wx.openLocation({
    //     scale:18,
    //     latitude:res.latitude, 
    //     longitude:res.longitude,
    //     success(msg){
    //       console.log(msg)
    //     },
    //     fail(err){
    //       console.log(err)
    //     }
    //   })
    //   console.log('location change', res)
    // })

    // 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。
    // wx.getLocation({
    //   success(res){
    //     console.log(res)
    //   },
    //   fail: function(err) {
    //     console.log(err)
    //   }
    // })
    //打开地图选择位置
    // wx.chooseLocation({
    //   success(res){
    //     console.log(res)
    //   },
    //   fail: function(err) {
    //     console.log(err)
    //   }
    // })
  },
  globalData: {
    userInfo: getItem("userInfo"),
    touristNo: getItem("touristNo"),
    museumNo: getItem("museumNo"),
    openId: getItem("openid")
  }
})