// components/explain.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mp3Url: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlay: false,
    isPlayAudio: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // listenIt: function (e) {
    //   if (this.data.audios.length < 1) {
    //     const params = {}
    //     params.dataNo = this.properties.datano;
    //     params.type = this.properties.type;
    //     apiUtil(selectExplainList, params).then(res => {
    //       // console.log(res)
    //       const tmp = []
    //       tmp.push({ content: res.content, mp3Url: res.official, projectName: res.title })
    //       res.data.map(item => {
    //         tmp.push({ content: item.content, mp3Url: item.mp3Url, projectName: item.projectName, wxName: item.wxName, recNo: item.recNo })
    //       })
    //       // console.log(tmp)
    //       this.setData({
    //         audios: tmp
    //       })
    //     }).catch(err => console.log(err));
    //   }
    //   this.setData({
    //     isPlay: !this.data.isPlay,
    //     selectIndex: -1
    //   })
    //   this.triggerEvent('run', { 'isplay': -1 });
    // },
    /**
     * 0：初始化并播放
     * 1：暂停播放
     * 2：继续播放
     * @param {*} e 
     */
    listenIt(e) {
      const { url } = e.currentTarget.dataset
      let status = 0
      const { isPlayAudio } = this.data

      // 正在播放
      if (isPlayAudio) {
        status = 2
        this.setData({ isPlayAudio: false })
      } else {
        // 没有播放
        status = 1
        this.setData({ isPlayAudio: true })
      }

      this.triggerEvent('run', { 'mp3': url, 'isplay': status })
    }
  },
})