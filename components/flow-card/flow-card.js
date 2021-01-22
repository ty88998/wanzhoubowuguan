import { addCollectHistory, addLikeHistory } from '../../api/smallProgram'
import { loginIntercept } from '../../utils/loginUtils'
import { getItem, setItem } from '../../utils/store'

const appInst = getApp()

Component({

  properties: {
    itemData: Object,
    allData:Array
  },
  methods: {
    /** 页面跳转 */
    goToPage(e) {
      const { itemData,allData } = this.data;
      let newData = allData.filter(value=>value.recNo==itemData.recNo);
      const { recno, display } = e.currentTarget.dataset
      let details = {
        recNo: recno,
        isLike: newData[0].isLike,
        pointRatio: newData[0].pointRatio,
        isCollect: newData[0].isCollect,
        views: newData[0].views
      };
      setItem('details', JSON.stringify(details));
      setItem('choose', JSON.stringify({ display }));
      if (display == 0) {
        loginIntercept({ url: '/pages/virtualShow/virtualShow', recno, status: true })
        // loginIntercept({ url: '/pages/detail/detail', recno, status: true })
      } else {
        // loginIntercept({ url: '/pages/topic_back/topic_back', recno })
        loginIntercept({ url: '/pages/topic/topic', recno })
      }
    },
    /**
     * 
     * @param {*2020.11.12日变更，取消：点赞、收藏、数量模块！} e 
     */
    //用户点赞/取消 
    // addLike(e) {
    //   const { touristNo } = appInst.globalData
    //   if (touristNo) {
    //     const { itemData } = this.data
    //     const { recno } = e.currentTarget.dataset
    //     addLikeHistory({ recNo: recno, touristNo })
    //       .then(res => {
    //         itemData.pointRatio = res.pointRatio
    //         itemData.isLike = !itemData.isLike
    //         this.setData({ itemData })
    //       })
    //   } else {
    //     loginIntercept()
    //   }
    // },

    // 用户收藏/取消
    // addCollect(e) {
    //   const { touristNo } = appInst.globalData
    //   if (touristNo) {
    //     const { itemData } = this.data
    //     const { recno } = e.currentTarget.dataset
    //     addCollectHistory({ recNo: recno, touristNo })
    //       .then(() => {
    //         itemData.isCollect = !itemData.isCollect
    //         this.setData({
    //           itemData
    //         })
    //       })
    //   } else {
    //     loginIntercept()
    //   }
    // },
    imgLoadToPage() {
      const query = wx.createSelectorQuery().in(this)
      query.select('#card-item').boundingClientRect(rect => {
        this.triggerEvent('loadimg', Math.floor(rect.height))
      }).exec()
    }
  }
})
