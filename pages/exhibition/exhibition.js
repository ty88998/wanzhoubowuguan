import { getDicInfos, getMuseumsInfo, getWXOpenId } from '../../api/indexInfo'
import { getProjectInfo } from '../../api/smallProgram'
import { loginIntercept } from '../../utils/loginUtils'
import { setItem } from '../../utils/store'
const MAX_ROW = 6
// 加载到底部
let loadEnd = false

const appInst = getApp()

Page({
  data: {
    showTable: 0,
    showCategory: [],
    showData: [],
    allData: []
  },
  onLoad(options) {
    this._getOpenId();
    this._initMuseumNo();
    loadEnd = false;
    this._initData();
    if (options.url) {
      // let url = decodeURIComponent(options.url);
      let arr = JSON.parse(options.url);
      setItem('choose', JSON.stringify(arr[1]));
      setItem('details', JSON.stringify(arr[0]));
      const { display, recNoDetail } = arr[1];
      const { recNo } = arr[0];
      if (display == 0) {
        loginIntercept({ url: '/pages/virtualShow/virtualShow', recno: recNo, status: true })
      } else {
        // loginIntercept({ url: '/pages/topic/topic', recno,recNoDetail,share:true })
        loginIntercept({ url: '/pages/virtualShow/virtualShow', recno: recNoDetail })
      }
    }
  },
  onShow() {
    //实时获取登录之后的数据(点赞收藏字段登录后才会变化)，同时不用刷新之前页面，提高体验度。
    this.updateProjectInfo();
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
  async _initData() {
    const result = await getDicInfos({ loading: false })
    this.setData({ showCategory: result.data })
    this._getProjectInfo(result.data[0].recNo)
  },
  /** 获取展览类型 */
  _getProjectInfo(projectType) {
    if (!loadEnd) {
      const { showData } = this.data
      const touristNo = appInst.globalData.touristNo || ""
      const page = Math.ceil(showData.length / MAX_ROW) + 1
      getProjectInfo({ page, rows: MAX_ROW, projectType, touristNo })
        .then(res => {
          if (res.data.length !== MAX_ROW) {
            loadEnd = true
          }
          const { showData } = this.data
          this.setData({
            showData: [...showData, ...res.data]
          })
          wx.stopPullDownRefresh()
        }).catch(err => {
          loadEnd = true
          console.log(err)
        })
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 1500
      })
    }
  },
  //获取更新后的所有数据
  async updateProjectInfo() {
    const { showTable } = this.data
    const result = await getDicInfos({ loading: false });
    this.setData({ showCategory: result.data })
    const projectType = result.data[showTable].recNo;
    const touristNo = appInst.globalData.touristNo || "";
    const res = await getProjectInfo({ page: 1, rows: 30, projectType, touristNo }, { loading: false });
    this.setData({ allData: res.data });
  },
  /** 分类切换跳转方法 */
  switchToShow(e) {
    loadEnd = false
    const { index } = e.currentTarget.dataset
    const { showCategory } = this.data
    this.setData({
      showTable: index,
      showData: []
    })
    this._getProjectInfo(showCategory[index].recNo)
    this.updateProjectInfo();
  },

  onReachBottom() {
    const { showCategory, showTable } = this.data
    setTimeout(() => {
      this._getProjectInfo(showCategory[showTable].recNo)
    }, 0);
  },
  onPullDownRefresh() {
    loadEnd = false
    this.setData({ showData: [] })
    const { showCategory, showTable } = this.data
    this._getProjectInfo(showCategory[showTable].recNo)
  }
})