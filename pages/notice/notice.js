// pages/notice/notice.js
import { toNoticeInfo } from "../../api/indexInfo"
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
    const recNo = options.recNo;
    this.getNoticeInfo(recNo);
  },

  getNoticeInfo:function(recNo){
    toNoticeInfo({recNo}).then(res => {
      this.setData({
        noticeinfo: res
      })
		})
  }

})