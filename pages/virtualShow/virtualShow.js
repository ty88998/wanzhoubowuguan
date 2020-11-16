// pages/virtualShow/virtualShow.js
import { getCollection, toProjectDetail, getSceneInfos } from '../../api/smallProgram'

const appInst = getApp()
const innerAudioContext = wx.createInnerAudioContext()
let status = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexInfo: {},
    scenes: {},
    orderNo: 0,
    playStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    status = options.status
    this._getIndexData(options.recno)
  },

  async _getIndexData(recNo) {
    let touristNo = appInst.globalData.touristNo
    try {
      let {indexInfo, scenes} = this.data
      if (status) {
        indexInfo = await toProjectDetail({ recNo, touristNo })
        scenes = await getCollection({ recNo: indexInfo.collectNo })
      } else {
        // 专题展进入
        scenes = await getCollection({ recNo })
      }
      wx.setNavigationBarTitle({ title: scenes.name })
      this.setData({indexInfo, scenes})
    } catch (error) {
      console.log('toProjectDetail error: ', error)
    } 
  },
  payMp3(e) {
    const {mp3url} = e.currentTarget.dataset
    innerAudioContext.src = mp3url
    this.data.playStatus ? innerAudioContext.pause() : innerAudioContext.play()
    this.setData({ playStatus: !this.data.playStatus })
  },
  onUnload() {
    this._leaveAndStopMp3()
  },
  /** 离开页面停止音乐播放 */
  _leaveAndStopMp3() {
    if (this.data.playStatus) {
      innerAudioContext.stop()
      innerAudioContext.destroy()
    }
  },
  preImg() {
    wx.previewImage({
      current: this.data.scenes.sourceImg,
      urls: [this.data.scenes.sourceImg]
    })
  },
  goTo3D(e) {
    if(this.data.playStatus) innerAudioContext.pause()
    const {recno, name} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/three/three?recno=${recno}&name=${name}`
    })
  }
})