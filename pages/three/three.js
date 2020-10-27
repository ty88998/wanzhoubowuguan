// pages/Three/Three.js
import { getCollection, toProjectDetail } from '../../api/smallProgram'
let innerAudioContext = {};
Page({
  data: {
    // innerAudioContext: {},
    playStatus: false,
    src:''
  },
  onLoad: async function (options) {
    const { recno, name } = options
    innerAudioContext = wx.createInnerAudioContext()
    wx.setNavigationBarTitle({ title: name })
    const url = `${App.baseApi.Prod}SmallProgram/toCollection3D.do?recNo=${recno}`
    this.setData({ src: url });
    const collection = await getCollection({ recNo: recno })
    this.setData({collection})
    let that = this
    setTimeout(function(){
      innerAudioContext.src = collection.mp3Url
      that.data.playStatus ? innerAudioContext.pause() : innerAudioContext.play()
      that.setData({ playStatus: !that.data.playStatus })
    }, 2500)
    innerAudioContext.onEnded(function(){
      this.setData({ playStatus: !this.data.playStatus })
      innerAudioContext.stop()
      innerAudioContext.destroy()
    })
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

  back: function () {
    wx.navigateBack();
  }
})