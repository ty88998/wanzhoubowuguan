// pages/virtualShow/virtualShow.js
import { getCollection, toProjectDetail, addLikeHistory, addCollectHistory, getSceneInfos } from '../../api/smallProgram';
import { getMuseumsInfo, getWXOpenId } from '../../api/indexInfo'
import { getItem, setItem } from '../../utils/store'
import { loginIntercept } from '../../utils/loginUtils'
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
    //当前轮播图索引
    current: 0,
    //当前点击图索引 + 1
    currentPre: 0,
    autoplay: true,
    details: {},
    choose: {},
    style: { 'height': appInst.globalData.screenHeight, 'width': appInst.globalData.screenWidth },
    //大图地址，解决原数据模糊问题
    list: [],
    //新图片数组
    temp: []
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
      this.makeImg(scenes)
      const details = JSON.parse(getItem('details'));
      let choose = JSON.parse(getItem('choose'));
      choose = { ...choose, recNoDetail: recNo }
      this.setData({
        autoplay: scenes.sourceImgList.length > 2 ? true : false
      })
      wx.setNavigationBarTitle({ title: scenes.name })
      this.setData({ indexInfo, scenes, details, choose, list: scenes.sourceImgList })
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
    const { temp } = this.data;
    const { index } = e.target.dataset;
    //背景颜色不可更改
    if (temp.length > 0) {
      wx.previewImage({
        current: temp[index],
        urls: temp
      })
    }
    //显示大图
    this.setData({
      //设置当前图片路径
      current: index
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
    // let { current, source } = e.detail
    let { current } = e.detail
    // if (source === 'autoplay') {
    //   this.setData({
    //     current
    //   })
    // } else {
    //   this.setData({
    //     currentPre: current, current
    //   })
    // }
    this.setData({
      current
    })
  },
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



  /**
   * 
   * @param {*} scenes 展览数据
   * 生成带背景色的图片
   */
  makeImg(scenes) {
    let { sourceImgList } = scenes;
    const _this = this;
    const { style } = this.data;
    let imgList = [];  //保存所有图片生成后的地址
    for (let i = 0; i < sourceImgList.length; i++) {
      wx.getImageInfo({
        src: sourceImgList[i],
        success: (res) => {
          let ctx = wx.createCanvasContext(`firstCanvas${i}`)
          ctx.drawImage('../../assets/name2.png', 0, 0, style.width, style.height) // 绘制图像到画布
          // 图片那拼接
          ctx.drawImage(res.path, style.width*0.075, (style.height - style.width*0.85/375*500) / 2, style.width*0.85, style.width*0.85/375*500) // 绘制图像到原有画布，也就是图片拼接
          // 图片加水印                   
          // ctx.fillText('你要添加的文字', 0, 50 * j) //在画布上绘制被填充的文本
          // ctx.setTextAlign('center') // 文字居中
          // ctx.setFillStyle('#a00b0f') // 文字颜色：黑色
          ctx.draw(true, setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: `firstCanvas${i}`,
              success: (res) => {
                imgList.push({ src: res.tempFilePath, index: i })
                imgList.sort((a, b) => a.index - b.index)
                if (imgList.length === sourceImgList.length) {
                  _this.setData({ temp: imgList.map((value) => value.src) });
                }
              },
              fail: (e) => {
                console.log(e)
              }
            })

          }, 500))
        }
      })
    }
  },
  // makeImg(scenes) {
  //   let { sourceImgList } = scenes;
  //   const _this = this;
  //   const { style } = this.data;
  //   let imgList = [];  //保存所有图片生成后的地址
  //   for (let i = 0; i < sourceImgList.length; i++) {
  //     wx.getImageInfo({
  //       src: sourceImgList[i],
  //       success: (res) => {
  //         // let ctx = wx.createCanvasContext(`firstCanvas${i}`)
  //         // ctx.drawImage('../../assets/name2.png', 0, 0, style.width, style.height) // 绘制图像到画布

  //         // // 图片那拼接
  //         // ctx.drawImage(res.path, 0, (style.height - 466) / 2, 350, 466) // 绘制图像到原有画布，也就是图片拼接
  //         wx.createSelectorQuery()
  //           .select(`#canvas${i}`)
  //           .fields({
  //             node: true,
  //             size: true,
  //           })
  //           .exec((res) => {
  //             let myCanvas = res[0].node;
  //             let myCtx = myCanvas.getContext('2d');
  //             const headerImg = myCanvas.createImage();
  //             // const tempImg = myCanvas.createImage();
  //             headerImg.src = "../../assets/name2.png";
  //             // tempImg.src = sourceImgList[i];
  //             headerImg.onload = () => {
  //               myCtx.drawImage(headerImg, 0, 0, style.width, style.height);
  //             };
  //             // tempImg.onload = () => {
  //             //   myCtx.drawImage(tempImg, 0, 0, 350, 466);
  //             // };
  //             wx.canvasToTempFilePath({
  //               canvas:myCanvas,
  //               // x:0,
  //               // y:0,
  //               // width:style.width,
  //               // height:style.height,
  //               // destWidth:style.width,
  //               // destHeight:style.height,
  //               success: (res) => {
                  
  //                 // imgList.push({ src: res.tempFilePath, index: i })
  //                 // imgList.sort((a, b) => a.index - b.index)
  //                 // if (imgList.length === sourceImgList.length) {
  //                 //   _this.setData({ temp: imgList.map((value) => value.src) });
  //                 // }
  //                 console.log(res.tempFilePath)
  //               },

  //               fail: (e) => {
  //                 console.log(e)

  //               }

  //             })
  //           })
  //       }
  //     })
  //   }
  // },
  //弹窗提醒
  message() {
    wx.showToast({
      title: '正在加载...',
      icon: 'none'
    })
  }
})

