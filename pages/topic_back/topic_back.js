// pages/topic/topic.js
import {
  toProjectDetail,
  getSceneInfos,
  getSceneCollect,
  getProjectInfo
} from "../../api/smallProgram";
import { getDicInfos } from '../../api/indexInfo'
import { loginIntercept } from '../../utils/loginUtils'
import { get_HTML_str } from '../../utils/util';
import { getItem, setItem } from "../../utils/store";
const appInst = getApp();
let innerAudioContext;
let timer;
let timerA;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    indexInfo: {},//三峡移民纪念馆-唐俑珍赏详细资料
    knowledge:[],//知识链接，多段文本
    playStatus: false,
    scenes: [],
    mp3Index: 0,
    mp3Arr:[],
    nextPage:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    await this._getIndexData(options.recno);
    await this.playAudio();
  },
  onUnload() {
    this._leaveAndStopMp3();
  },
  onShow(){
    this.playAudio();
    this.updateProjectInfo();
  },
  onHide(){
    this._leaveAndStopMp3();
    // this.setData({mp3Index:0});
  },
  async _getIndexData(recNo) {
    // 获取专题展信息(唐俑珍赏)-纪念馆馆藏
    let touristNo = appInst.globalData.touristNo;
    const indexInfo = await toProjectDetail({ recNo, touristNo });
    const knowledge = get_HTML_str(indexInfo.knowledge);
    this.setData({ indexInfo,knowledge });
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
  /**
   * @params 全屏预览大图
   */
  previewImage(e){
    const {src} = e.target.dataset;
    wx.previewImage({
      urls:[src],
      current:src
    })
  },
  goToVirtual(e) {
    const { recno } = e.currentTarget.dataset
    console.log(recno)
    // 判断当前轮播图是否为文物，如果是就进行跳转
    loginIntercept({ url: '/pages/detail/detail', recno })
    // if (!this.data.indexInfo.display === '2' || !this.data.collectionList[index].isScene) {
    // }
  },
  //获取更新后的所有数据 - 主要更新收藏点赞状态
  async updateProjectInfo(){
    const result = await getDicInfos({loading:false});
    const projectType = result.data[1].recNo;
    const touristNo = appInst.globalData.touristNo || "";
    const res = await getProjectInfo({page:1,rows:6,projectType,touristNo},{loading:false});
    let details = JSON.parse(getItem('details'));
    const { isCollect,isLike,views,pointRatio } = res.data[0];
    details = {...details,isCollect,isLike,views,pointRatio};
    setItem('details',JSON.stringify(details));
  },
  //节流
  scroll(e){
    if(timerA)clearTimeout(timerA);
    timerA = setTimeout(() => {
      this.asyncActive(e)
    }, 500);
  },
  asyncActive(elem){
    console.log(elem)
  },
  /** 
   * 2020.11.13新增，合并四条语音
   * 2020.11.17变更，单条语音
   */
  // totalMp3Url(){
  //   const { scenes,indexInfo } = this.data;
  //   let mp3Arr = [];
  //   mp3Arr.push(indexInfo.prefaceMp3);
  //   scenes.forEach(value=>{
  //     mp3Arr.push(value.mp3Url);
  //   })
  //   this.setData({mp3Arr});
  // },
  //按顺序播放共 4条语音
  // playAudio() {
  //   this._leaveAndStopMp3();
  //   const that = this;
  //   let { mp3Index,mp3Arr } = this.data;
  //   innerAudioContext = wx.createInnerAudioContext();
  //   if(mp3Arr.length>0) {
  //     if (mp3Index < 4) {
  //       innerAudioContext.src = mp3Arr[mp3Index];
  //       setTimeout(() => {
  //         innerAudioContext.play();
  //       }, 1000);
  //       this.setData({ mp3Index: mp3Index + 1 });
  //       innerAudioContext.onEnded(() => {
  //         that.playAudio();
  //       });
  //     } else {
  //       innerAudioContext.onEnded(() => {
  //         that.setData({ mp3Index: 0 });
  //         that._leaveAndStopMp3();
  //       });
  //     }
  //   }
  // },
  playAudio() {
    this._leaveAndStopMp3();
    const that = this;
    const { indexInfo } = this.data;
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = indexInfo.prefaceMp3;
    timer = setTimeout(() => {
      innerAudioContext.play();
    }, 1000);
    innerAudioContext.onEnded(() => {
      that._leaveAndStopMp3();
    });
  },
  //离开或关闭页面，停止播放
  _leaveAndStopMp3() {
    if(innerAudioContext){
      clearTimeout(timer);
      innerAudioContext.stop();
      innerAudioContext.destroy();
      // wx.getLocation({
      //   type: 'wgs84',
      //   success: function(res) {
      //     var latitude = res.latitude
      //     var longitude = res.longitude
      //   },
      // })
    }
  },
  // 跳转到场景文物页面
  toSceneCollect(e) {
    const { recno,index } = e.currentTarget.dataset;
    const { scenes } = this.data;
    const { collections } = scenes[index];
    let params = {};
    params = {
      list:collections.map(value=>value.name),
      mp3Url:scenes[index].mp3Url,
      name:scenes[index].name,
      synopsis:scenes[index].synopsis,
      recno
    }
    wx.navigateTo({
      // url: `/pages/topicShow/topicShow?params=${JSON.stringify(params)}`,
      url: '/pages/topicShow/topicShow',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        // 被打开页面进行回调
        // funcA: function(data) {
        //   console.log(data)
        // },
        // funcB: function(data) {
        //   console.log(data)
        // }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('sendData', { data: params })
      }
    });
  },
  _get_wxml(className, callback) {
    wx.createSelectorQuery()
      .selectAll(className)
      .boundingClientRect(callback)
      .exec();
  },
});