// pages/fullex/fullex.js
import { toProjectDetail, getSceneInfos, getSceneCollect } from "../../api/smallProgram"
import { getMuseumsInfo, getMuseumPicture } from '../../api/indexInfo'
import { loginIntercept } from '../../utils/loginUtils'

const appInst = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const museumInfo = await getMuseumsInfo()
    this.setData({ museumInfo })
    this._getIndexData(options.recno)
  },

  async _getIndexData(recNo){
    let touristNo = appInst.globalData.touristNo
    // 获取专题展的信息
    const indexInfo = await toProjectDetail({ recNo, touristNo })
    wx.setNavigationBarTitle({ title: indexInfo.region+indexInfo.name })
    this.setData({ indexInfo })
    // 获取专题展的场景信息
    const sceneData = await getSceneInfos({ projectNo: indexInfo.recNo })
    const scenes = sceneData.data
    const { collectionList } = this.data
    if(scenes.length>0){
      scenes.forEach(scene => {
        getSceneCollect({ sceneNo: scene.recNo }).then(res => {
          collectionList.push({ ...scene, isScene: true, thumbnail: scene.imgURL })
          collectionList.push(...res.data)
          this.setData({
            collectionList
          })
        })
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})