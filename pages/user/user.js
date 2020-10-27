import { loginIntercept } from '../../utils/loginUtils'

const appInst = getApp();

Page({
  data: {
    userItems: [{
      recno: 1,
      title: '我的资料',
      icon: '../../assets/user/message.png',
      url: "/pages/userInfo/userInfo"
    }, {
      recno: 2,
      title: '我的收藏',
      icon: '../../assets/user/collection.png',
      url: "/pages/collect/collect",
      status: 0
    }, {
      recno: 3,
      title: '我的观看历史',
      icon: '../../assets/user/history.png',
      url: "/pages/collect/collect",
      status: 1
    }
    // , {
    //   recno: 4,
    //   title: '我的预约',
    //   icon: '../../assets/user/stars.png',
    //   url: "/pages/reserveList/reserveList"
    // }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const userInfo = appInst.globalData.userInfo
    this.setData({ userInfo })
  },

  goToDetail(e) {
    const { index } = e.currentTarget.dataset
    const { userItems } = this.data
    const { url, status } = userItems[index]
    loginIntercept({ url, status })
  }
})