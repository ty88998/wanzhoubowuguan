import { getNoticeInfos } from "../../api/indexInfo"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageset: {
			page: 1,
			rows: 6
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNoticeList();
  },

  getNoticeList:function(){
    let {pageset} = this.data;
    getNoticeInfos(pageset).then(res => {
      this.setData({
        noticeList: res.data
      })      
		})
  },
  toNotice:function(e){
    const {recno} = e.currentTarget.dataset;
    wx.navigateTo({ url:  `/pages/notice/notice?recNo=${recno}`})
  }
})