// components/picBox/picbox.js
import { loginIntercept } from '../../utils/loginUtils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },

  observers: {
    // pics(value){
    //   console.log(value)
    // }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToPage(e) {
      const { recno, display } = e.currentTarget.dataset
      console.log('display: ', display);
      if (!display) {
        loginIntercept({ url: '/pages/virtualShow/virtualShow', recno, status: true })
      } else {
        loginIntercept({ url: '/pages/topicShow/topicShow', recno })
      }
    },
    imgLoadToPage() {
      const query = wx.createSelectorQuery().in(this)
      query.select('#pic-box-item').boundingClientRect(rect => {
        this.triggerEvent('loadimg', Math.floor(rect.height))
      }).exec()
    }
  }
})