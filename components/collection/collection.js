// components/collection/collection.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		collection: {
			type: Object,
			value: {}
		},
		display: String
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		btnclick: function () {
			const { collection } = this.data;
			const params = {};
			params.recNo = collection.recNo;
			params.name = collection.name;
			wx.navigateTo({
				url: `/pages/relatedInfo/relatedInfo?collection=${JSON.stringify(params)}`,
			})
		},
		run(e) {
			this.triggerEvent('parentrun', e.detail);
		},
		toCollectionThree: function (e) {
			const recno = e.currentTarget.dataset.collectionno;
			wx.navigateTo({
				url: `/pages/three/three?collectionId=${recno}&name=${this.data.collection.name}`,
				success: function (res) {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
				}
			})
		}
	}
})
