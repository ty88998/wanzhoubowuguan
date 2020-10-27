// pages/topicShow/topicShow.js
import { toProjectDetail, getSceneInfos, getSceneCollect } from "../../api/smallProgram"
import { getMuseumsInfo } from '../../api/indexInfo'
import { loginIntercept } from '../../utils/loginUtils'

const appInst = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: [],
    currentItem: 0,
    contentTitle: '',
    contentBody: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // const museumInfo = await getMuseumsInfo()
    // this.setData({ museumInfo })

    this._getIndexData(options.recno)
  },

  // 获取展览信息
  async _getIndexData(recno) {
    let {collectionList, currentItem} = this.data
    const touristNo = appInst.globalData.touristNo;
    // 加载场景下文物
    getSceneCollect({ sceneNo: recno }).then(res => {
      collectionList.push(...res.data)
      this.setData({
        collectionList
      })
      this._setCurrentData(currentItem)
    })
  },

  goToVirtual(event) {
    const { recno, index } = event.currentTarget.dataset
    // 判断当前轮播图是否为文物，如果是就进行跳转
    loginIntercept({ url: '/pages/virtualShow/virtualShow', recno })
    // if (!this.data.indexInfo.display === '2' || !this.data.collectionList[index].isScene) {
    // }
  },

  /**
   * 轮播图滑动响应事件
   * 
   * @param { Event } event 
   */
  swiperChange(event) {
    const { current } = event.detail
    this._setCurrentData(current)
    this.setData({
      currentItem: current
    })
  },

  /**
   * 设置当前选中信息
   * 
   * @param { Number } current 当前轮播图下标
   */
  _setCurrentData(current) {
    const { collectionList } = this.data
    const collectionItem = collectionList[current]
      // contentBody更新
    this.setData({ collectionItem })
  }
})