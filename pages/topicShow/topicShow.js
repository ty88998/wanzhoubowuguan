// pages/topicShow/topicShow.js
import { toProjectDetail, getSceneInfos, getSceneCollect } from "../../api/smallProgram"
import { getMuseumsInfo } from '../../api/indexInfo'
import { loginIntercept } from '../../utils/loginUtils'

const appInst = getApp()
let innerAudioContext;
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: [],
    currentItem: 0,
    contentTitle: '',
    contentBody: '',
    //传过来的json对象
    params:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const params = JSON.parse(options.params);
    this.setData({params})
    this._getIndexData(params.recno)
    this.playAudio();
  },
  onUnload() {
    this._leaveAndStopMp3();
  },
  onShow(){
    this.playAudio();
  },
  onHide(){
    this._leaveAndStopMp3();
  },
  /**
   * 
   * @param {*} 11.19日新增--语音播放 
   */
  playAudio() {
    this._leaveAndStopMp3();
    const that = this;
    const {params} = this.data;
    innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = params.mp3Url;
    timer = setTimeout(() => {
      innerAudioContext.play();
    }, 500);
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
    }
  },
  // 获取展览信息
  async _getIndexData(recno) {
    let { collectionList, currentItem } = this.data
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
  },
  /**
 * @param 箭头切换图片
 */
  //上一张
  preCollection() {
    const { currentItem,collectionList } = this.data;
    if(currentItem===0){
      this._setCurrentData(collectionList.length-1)
      this.setData({currentItem:collectionList.length-1})
    }else{
      this._setCurrentData(currentItem-1)
      this.setData({currentItem:currentItem-1})
    }
  },
  //下一张
  nextCollection(){
    const { currentItem,collectionList } = this.data;
    if(currentItem===collectionList.length-1){
      this._setCurrentData(0)
      this.setData({currentItem:0})
    }else{
      this._setCurrentData(currentItem+1)
      this.setData({currentItem:currentItem+1})
    }
  }
})
