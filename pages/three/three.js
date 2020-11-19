// pages/Three/Three.js
import { getCollection, toProjectDetail } from '../../api/smallProgram'
let innerAudioContext;
let timer;
Page({
  data: {
    playStatus: true,
    src:''
  },
  onLoad: async function (options) {
    const { recno, name } = options
    const that = this;
    innerAudioContext = wx.createInnerAudioContext()
    wx.setNavigationBarTitle({ title: name })
    const url = `${App.baseApi.Prod}SmallProgram/toCollection3D.do?recNo=${recno}`
    this.setData({ src: url });
    const collection = await getCollection({ recNo: recno })
    this.setData({collection})
    timer = setTimeout(function(){
      innerAudioContext.src = collection.mp3Url
      innerAudioContext.play()
    }, 2500)
    innerAudioContext.onEnded(function(){
      that._leaveAndStopMp3();
    })
  },
  onUnload() {
    this._leaveAndStopMp3()
  },
  /** 离开页面停止音乐播放 */
  _leaveAndStopMp3() {
    if(innerAudioContext){
      clearTimeout(timer);
      innerAudioContext.stop();
      innerAudioContext.destroy();
    }
  },

  back: function () {
    wx.navigateBack();
  }
})