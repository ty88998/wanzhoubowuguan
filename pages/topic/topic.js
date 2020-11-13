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
    indexInfo: {},//三峡移民纪念馆-唐俑珍赏详细资料
    playStatus: false,
    scenes: [],
    mp3Index: 0,
    mp3Arr:[],
    nextPage:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this._getIndexData(options.recno);
    await this.totalMp3Url();
    await this.playAudio();
  },
  onUnload() {
    this._leaveAndStopMp3();
  },
  onShow(){
    this.playAudio();
  },
  onHide(){
    this._leaveAndStopMp3();
    this.setData({mp3Index:0});
  },
  async _getIndexData(recNo) {
    // 获取专题展信息(唐俑珍赏)
    let touristNo = appInst.globalData.touristNo;
    const indexInfo = await toProjectDetail({ recNo, touristNo });
    this.setData({ indexInfo });
    await this._getSceneData(indexInfo.recNo);
  },

  async _getSceneData(projectNo) {
    // 获取专题展场景数据(武吏 、武士俑  奴仆俑   骑马乐俑)
    const sceneData = await getSceneInfos({ projectNo });
    let scenes = sceneData.data;
    this.setData({ scenes });
    scenes.map((scene) => {
      // 获取场景下文物数据(具体到每个个体)
      getSceneCollect({ sceneNo: scene.recNo }).then((res) => {
        scene.collections = res.data;
        this.setData({ scenes });
      });
    });
  },
  //2020.11.13新增，合并四条语音
  totalMp3Url(){
    const { scenes,indexInfo } = this.data;
    let mp3Arr = [];
    mp3Arr.push(indexInfo.prefaceMp3);
    scenes.forEach(value=>{
      mp3Arr.push(value.mp3Url);
    })
    this.setData({mp3Arr});
  },
  //按顺序播放共 4条语音
  playAudio() {
    this._leaveAndStopMp3();
    const that = this;
    let { mp3Index,mp3Arr } = this.data;
    innerAudioContext = wx.createInnerAudioContext();
    if(mp3Arr.length>0) {
      if (mp3Index < 4) {
        innerAudioContext.src = mp3Arr[mp3Index];
        setTimeout(() => {
          innerAudioContext.play();
        }, 1000);
        this.setData({ mp3Index: mp3Index + 1 });
        innerAudioContext.onEnded(() => {
          that.playAudio();
        });
      } else {
        innerAudioContext.onEnded(() => {
          that.setData({ mp3Index: 0 });
          that._leaveAndStopMp3();
        });
      }
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
});