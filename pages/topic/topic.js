// pages/topic/topic.js
import {
  toProjectDetail,
  getSceneInfos,
  getSceneCollect,
} from "../../api/smallProgram";
const appInst = getApp();
let innerAudioContext;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    indexInfo: {},
    playStatus: false,
    scenes: [],
    mp3Index: 0,
    nextPage:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this._getIndexData(options.recno);
    await this.choosePlay();
  },
  onUnload() {
    this._leaveAndStopMp3();
  },
  onShow(){
    this.choosePlay();
  },
  onHide(){
    this._leaveAndStopMp3();
    this.setData({mp3Index:0})
  },
  async _getIndexData(recNo) {
    // 获取专题展信息
    let touristNo = appInst.globalData.touristNo;
    const indexInfo = await toProjectDetail({ recNo, touristNo });
    this.setData({ indexInfo });
    this._getSceneData(indexInfo.recNo);
    this._setHeight(this.data.current);
  },

  async _getSceneData(projectNo) {
    // 获取专题展场景数据
    const sceneData = await getSceneInfos({ projectNo });
    let scenes = sceneData.data;
    scenes.map((scene) => {
      // 获取场景下文物数据
      getSceneCollect({ sceneNo: scene.recNo }).then((res) => {
        scene.collections = res.data;
        this.setData({ scenes });
      });
    });
  },
  //播放序言语音
  playAudio(audio) {
    this._leaveAndStopMp3();
    const that = this;
    let { mp3Index } = this.data;
    innerAudioContext = wx.createInnerAudioContext();
    if (typeof audio == "string") {
      innerAudioContext.src = audio;
      setTimeout(() => {
        innerAudioContext.play();
      }, 1000);
      innerAudioContext.onEnded(() => {
        that._leaveAndStopMp3();
      });
    } else {
      if (mp3Index < 3) {
        innerAudioContext.src = audio[mp3Index].mp3Url;
        setTimeout(() => {
          innerAudioContext.play();
        }, 1000);
        this.setData({ mp3Index: mp3Index + 1 });
        innerAudioContext.onEnded(() => {
          that.playAudio(audio);
        });
      } else {
        innerAudioContext.onEnded(() => {
          that.setData({ mp3Index: 0 });
          that._leaveAndStopMp3();
        });
      }
    }
  },
  //判断传入字符串或者数组
  async choosePlay() {
    let { indexInfo, scenes, current } = this.data;
      if (current === 0 && 'prefaceMp3' in indexInfo)await this.playAudio(indexInfo.prefaceMp3);
      else if(current===1){
        await this.playAudio(scenes);
      }else{
        this._leaveAndStopMp3();
      }
  },
  //离开或关闭页面，停止播放
  _leaveAndStopMp3() {
    if(innerAudioContext){
      innerAudioContext.stop();
      innerAudioContext.destroy();
    }
  },
  // 跳转到场景文物页面
  toSceneCollect(e) {
    const { recno } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/topicShow/topicShow?recno=${recno}`,
    });
  },
  _get_wxml(className, callback) {
    wx.createSelectorQuery()
      .selectAll(className)
      .boundingClientRect(callback)
      .exec();
  },
  _setHeight(cur) {
    let swiper_h = 0;
    this._get_wxml(`.swiper-item${cur}>.scene`, (rects) => {
      for (let i = 0; i < rects.length; i++) {
        swiper_h += rects[i].height + 40;
      }
      const screenH = wx.getSystemInfoSync().windowHeight;
      if (swiper_h < screenH) {
        swiper_h = screenH;
      }
      this.setData({
        swiper_h,
      });
    });
  },
  changeItem(e) {
    const { current } = e.detail;
    this.setData({
      current,mp3Index:0
    });
    this._setHeight(current);
    this.choosePlay();
  },
  onPullDownRefresh: function () {},
  //触摸时隐藏提醒翻页箭头
  // touchStart(){
  //   this.setData({
  //     nextPage:false
  //   })
  // }
});

