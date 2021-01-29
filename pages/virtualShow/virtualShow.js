// pages/virtualShow/virtualShow.js
import { getCollection, toProjectDetail, addLikeHistory, addCollectHistory, getSceneInfos } from '../../api/smallProgram';
import { getMuseumsInfo, getWXOpenId } from '../../api/indexInfo'
import { getItem, setItem } from '../../utils/store'
import { loginIntercept } from '../../utils/loginUtils'
const appInst = getApp()
const innerAudioContext = wx.createInnerAudioContext()
let status = false;
// let touchs = { touchOX:0,touchOY:0,touchNX:0,touchNY:0 }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexInfo: {},
    scenes: {},
    orderNo: 0,
    playStatus: false,
    //当前轮播图索引
    current: 0,
    //当前点击图索引 + 1
    currentPre: 0,
    autoplay: true,
    details: {},
    choose: {},
    test: false,
    //大图显示逻辑
    preImgBox: false,
    //大图中动画延迟
    duration:0,
    style:"",
    //大图地址，解决原数据模糊问题
    list:[]
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
      this._getOpenId();
      this._initMuseumNo();
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
      const museumInfo = await getMuseumsInfo()
      setItem("museumNo", museumInfo.recNo)
      appInst.globalData.museumNo = museumInfo.recNo
    } catch (err) {
      console.log(err)
    }
  },
  async _getIndexData(recNo) {
    let touristNo = appInst.globalData.touristNo;
    try {
      let { indexInfo, scenes } = this.data
      if (status) {
        if (touristNo && touristNo.length > 0) {
          indexInfo = await toProjectDetail({ recNo, touristNo })
        } else {
          indexInfo = await toProjectDetail({ recNo })
        }
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
      this.setData({ indexInfo, scenes, details, choose,list:scenes.sourceImgList })
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
    //背景颜色不可更改
    // wx.previewImage({
    //   current: scenes.sourceImgList[index],
    //   urls: scenes.sourceImgList
    // })
    //显示大图
    this.setData({
      //显示大图
      preImgBox: true,
      //设置当前图片路径
      current: index,
      currentPre: index,
      duration:250
    })
  },
  /** 点击容器消失  */
  closeImg() {
    let { currentPre } = this.data;
    this.setData({
      preImgBox: false,
      current:currentPre,
      duration:0
    })
  },
  /** 查看3D图形 */
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
    let { current, source } = e.detail
    if (source === 'autoplay') {
      this.setData({
        current
      })
    }else{
      this.setData({
        currentPre:current,current
      })
    }
  },
  // touchStart(e){
  //   touchs.touchOY = e.touches[0].pageY;
  //   touchs.touchOX = e.touches[0].pageX;
    
  // },
  // touchMove(e){
  //   touchs.touchNY = e.touches[0].pageY;
  //   touchs.touchNX = e.touches[0].pageX;
  // },
  // touchEnd(e){
  //   let moveX = touchs.touchNX - touchs.touchOX;
  //   let moveY = touchs.touchNY - touchs.touchOY;
  //   this.setData({
  //     style:`margin-left:${moveX}px;margin-top:${moveY}px;`
  //   })
  //   console.log(moveX,moveY)
  // },

  //用户点赞/取消 
  addLike(e) {
    const { touristNo } = appInst.globalData
    if (touristNo && touristNo.length > 0) {
      let { details } = this.data
      const { recno } = e.currentTarget.dataset
      addLikeHistory({ recNo: recno, touristNo })
        .then(res => {
          details.pointRatio = res.pointRatio
          details.isLike = !details.isLike
          this.setData({ details })
        })
    } else {
      loginIntercept();
    }
  },

  // 用户收藏/取消
  addCollect(e) {
    const { touristNo } = appInst.globalData
    if (touristNo && touristNo.length > 0) {
      let { details } = this.data
      const { recno } = e.currentTarget.dataset
      addCollectHistory({ recNo: recno, touristNo })
        .then(() => {
          details.isCollect = !details.isCollect
          this.setData({ details })
        })
    } else {
      loginIntercept();
    }
  },
})