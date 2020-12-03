// pages/virtualShow/virtualShow.js
import { getCollection, toProjectDetail,addLikeHistory,addCollectHistory, getSceneInfos } from '../../api/smallProgram'

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
    playStatus: false,
    current: 0,
    autoplay: true,
    details:{}
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
      let { indexInfo, scenes } = this.data
      if (status) {
        indexInfo = await toProjectDetail({ recNo, touristNo })
        scenes = await getCollection({ recNo: indexInfo.collectNo })
      } else {
        // 专题展进入
        scenes = await getCollection({ recNo })
      }
      const details = JSON.parse(wx.getStorageSync('details'))
      this.setData({
        autoplay: scenes.sourceImgList.length > 2 ? true : false
      })
      wx.setNavigationBarTitle({ title: scenes.name })
      this.setData({ indexInfo, scenes,details})
    } catch (error) {
      console.log('toProjectDetail error: ', error)
    }
  },
  payMp3(e) {
    const { mp3url } = e.currentTarget.dataset
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
  preImg(e) {
    const { scenes } = this.data;
    const { index } = e.target.dataset;
    wx.previewImage({
      current: scenes.sourceImgList[index],
      urls: scenes.sourceImgList
    })
    this.setData({
      current: index
    })
  },
  goTo3D(e) {
    if (this.data.playStatus) innerAudioContext.pause()
    const { recno, name } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/three/three?recno=${recno}&name=${name}`
    })
  },
  swiperChange(e) {
    // console.log(e.detail.source) //touch手动滑动    autoplay自动轮播
    // if (e.detail.source === 'touch'||e.detail.source === 'autoplay') {
      const { current } = e.detail
      this.setData({
        current
      })
    // }s
  },

  //用户点赞/取消 
    addLike(e) {
      const { touristNo } = appInst.globalData
      if (touristNo) {
        const { details } = this.data
        const { recno } = e.currentTarget.dataset
        addLikeHistory({ recNo: recno, touristNo })
          .then(res => {
            details.pointRatio = res.pointRatio
            details.isLike = !details.isLike
            this.setData({ details })
          })
      } 
    },

    // 用户收藏/取消
    addCollect(e) {
      const { touristNo } = appInst.globalData
      if (touristNo) {
        const { details } = this.data
        const { recno } = e.currentTarget.dataset
        addCollectHistory({ recNo: recno, touristNo })
          .then(() => {
            details.isCollect = !details.isCollect
            this.setData({
              details
            })
          })
      } 
    },
})