import { addCollectHistory, addLikeHistory } from '../../api/smallProgram'
import { loginIntercept } from '../../utils/loginUtils'

const appInst = getApp()

Component({

  properties: {
    itemData: Object
  },

  methods: {
    /** 页面跳转 */
    goToPage(e) {
      const { recno, display } = e.currentTarget.dataset
      if (display == 0) {
        loginIntercept({ url: '/pages/virtualShow/virtualShow', recno, status: true })
      } else {
        loginIntercept({ url: '/pages/topicShow/topicShow', recno })
      }
    },

    //用户点赞/取消 
    addLike(e) {
      const { touristNo } = appInst.globalData
      if (touristNo) {
        const { itemData } = this.data
        const { recno } = e.currentTarget.dataset
        addLikeHistory({ recNo: recno, touristNo })
          .then(res => {
            itemData.pointRatio = res.pointRatio
            itemData.isLike = !itemData.isLike
            this.setData({ itemData })
          })
      } else {
        loginIntercept()
      }
    },

    // 用户收藏/取消
    addCollect(e) {
      const { touristNo } = appInst.globalData
      if (touristNo) {
        const { itemData } = this.data
        const { recno } = e.currentTarget.dataset
        addCollectHistory({ recNo: recno, touristNo })
          .then(() => {
            itemData.isCollect = !itemData.isCollect
            this.setData({
              itemData
            })
          })
      } else {
        loginIntercept()
      }
    },
    imgLoadToPage() {
      const query = wx.createSelectorQuery().in(this)
      query.select('#card-item').boundingClientRect(rect => {
        this.triggerEvent('loadimg', Math.floor(rect.height))
      }).exec()
    }
  }
})
