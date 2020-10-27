// pages/article/article.js
import { apiUtil } from '../../utils/apiUtil'
import { getIDResource } from "../../api/smallProgram"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	back: function () {
		wx.navigateBack();
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let recno = options.recno;
		this.loadArticle(recno)

	},

	loadArticle: function (recno) {
		apiUtil(getIDResource, { recNo: recno }).then(res => {
			let article1 = {};
			article1.recNo = res.recNo;
			article1.content = res.content;
			article1.name = res.name;
			article1.resourcesURL = res.resourcesURL;
			this.setData({
				article: article1
			})
		})
	},

})
