// pages/Three/Three.js
import { getCollection, toProjectDetail } from '../../api/smallProgram'
Page({
  data: {
    src:''
  },
  onLoad: async function (options) {
    const { recno, name } = options;
    wx.setNavigationBarTitle({ title: name });
    //3d图形路径
    const url = `${App.baseApi.Prod}SmallProgram/toCollection3D.do?recNo=${recno}`;
    const add = 'http://192.168.2.110:8080?url='+url;
    const collection = await getCollection({ recNo: recno });
    //地址拼接--传值到web-view页面
    this.setData({
      src:url + "&" + collection.mp3Url
      // src:add
    })
  },
  back: function () {
    wx.navigateBack();
  }
})