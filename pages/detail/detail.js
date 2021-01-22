// pages/virtualShow/virtualShow.js
import { getCollection, toProjectDetail, addLikeHistory, addCollectHistory, getSceneInfos } from '../../api/smallProgram';
import { getMuseumsInfo, getWXOpenId } from '../../api/indexInfo'
import { getItem, setItem } from '../../utils/store'
const appInst = getApp()
const innerAudioContext = wx.createInnerAudioContext()
let status = false;

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
    details: {},
    choose: {},
    test: false,
    params: {}
  },
  //自定义分享给朋友
  onShareAppMessage: function (options) {
    const { details, choose } = this.data;
    let url = JSON.stringify([details, choose]);
    return {
      title: this.data.scenes.name,
      path: `/pages/exhibition/exhibition?url=${url}`,
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    }
  },
  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    const { details, choose } = this.data;
    let url = JSON.stringify([details, choose]);
    return {
      title: this.data.scenes.name,
      query: {
        url: url
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    try {
      const openid = getItem('openid');
      if (!openid) {
        this._getOpenId();
        this._initMuseumNo();
      }
    } catch (error) {

    }
    status = options.status;
    this._getIndexData(options.recno)
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['onShareAppMessage', 'shareTimeline']
    })
    //判断打开的页面是否属于单页应用(朋友圈打开)--值为1154-达到使用条件渲染定制单页应用
    // if(appInst.globalData['isSinglePage']==1154)this.setData({test:true,recno:options.recno})
  },
  /** 获取OpenId,通过分享朋友，默认进入展览模块，会略过首页，所以这里也添加获取 */
  _getOpenId() {
    wx.login({
      success: res => {
        if (res.code) {
          getWXOpenId({ code: res.code })
            .then(resp => {
              const openId = JSON.parse(resp.json).openid
              setItem('openid', openId)
              appInst.globalData.openId = openId
            }).catch(err => console.log(err))
        }
      }
    })
  },
  /** 通过异步操作，保证博物馆编号的存在 */
  async _initMuseumNo() {
    try {
      const 
      museumInfo = await getMuseumsInfo()
      setItem("museumNo", museumInfo.recNo)
      appInst.globalData.museumNo = museumInfo.recNo
    } catch (err) {
      console.log(err)
    }
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
      const details = JSON.parse(getItem('details'));
      let choose = JSON.parse(getItem('choose'));
      choose = { ...choose, recNoDetail: recNo }
      this.setData({
        autoplay: scenes.sourceImgList.length > 2 ? true : false
      })
      wx.setNavigationBarTitle({ title: scenes.name })
      //需要传给服务器JSP页面的参数
      const testUrl = 'https://zrkj.cqzrkj.cn/'
      const threeD = `${testUrl}SmallProgram/toCollection3D.do?recNo=${scenes.recNo}`;
      // const address = 'http://192.168.2.110:8080/';
      const address = 'http://127.0.0.1:8080/';
      // const address = 'http://192.168.137.1:5000/';
      // const address = "http://localhost/demo/";
      const thatScenes = {
        name:scenes.name,
        synopsis:scenes.synopsis,
        mp3Url:scenes.mp3Url,
      }
      let touristInfo = JSON.parse(getItem('touristInfo'))
      this.setData({ indexInfo, scenes, details, choose, params:address + '?params=' + encodeURI(JSON.stringify({ scenes:thatScenes, details,choose,threeD,touristInfo })) })
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
    if (this.data.playStatus) {
      innerAudioContext.pause();
      this.setData({ playStatus: false });
    }
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
    // }
  },

  //用户点赞/取消 
  addLike(e) {
    const { touristNo } = appInst.globalData
    if (touristNo) {
      let { details } = this.data
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
      let { details } = this.data
      const { recno } = e.currentTarget.dataset
      addCollectHistory({ recNo: recno, touristNo })
        .then(() => {
          details.isCollect = !details.isCollect
          this.setData({ details })
        })
    }
  },
})