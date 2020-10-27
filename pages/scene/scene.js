// pages/scene/scene.js
import { getSceneInfos, getSceneCollect } from "../../api/smallProgram"
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getData(options.recno)
  },

  /**
   *  初始化数据
   */
  async _getData(projectNo){
    // 获取专题展场景数据
    const sceneData = await getSceneInfos({ projectNo })
    let scenes = sceneData.data
    scenes.map(scene => {
      // 获取场景下文物数据
      getSceneCollect({ sceneNo: scene.recNo }).then( res => {
        scene.collections = res.data
        this.setData({scenes})
      })
    })
    // this.setData({scenes})
  },
  /**
   * 跳转到场景页面
   */
  toSceneCollect(e){
    const {recno} = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/topicShow/topicShow?recno=${recno}`
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})