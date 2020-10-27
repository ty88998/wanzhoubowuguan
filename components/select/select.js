Component({
  /** 组件的属性列表 */
  properties: {
    selectOption: {
      type: Array,
      value: [{
        type: "选项一",
        value: 0
      }, {
        type: "选项二",
        value: 1
      }]
    },
    defaultValue: {
      type: String,
      value: "0"
    },
    defaultText: {
      type: String,
      value: ''
    },
    fontColor: String
  },

  /** 组件的初始数据 */
  data: {
    selectValue: {},
    isSelected: false
  },
  ready() {
    if (!this.data.defaultText) {
      const { defaultValue, selectOption } = this.data
      if (selectOption.length > 0) {
        const index = this._getOptionByValue(defaultValue)
        this.setData({
          selectValue: selectOption[index]
        })
        selectOption.splice(index, 1)
        this.setData({
          selectOption
        })
      }
    }
  },
  methods: {
    showSelect() {
      this.setData({
        isSelected: !this.data.isSelected
      })
    },
    selectCardType(event) {
      let { selectOption, selectValue } = this.data
      const { value } = event.currentTarget.dataset
      const index = this._getOptionByValue(value)
      // 判断selectValues是否有值，如果defaultText不为空生效
      selectValue = selectValue.type ? selectOption.splice(index, 1, selectValue)[0] : selectOption.splice(index, 1)[0]
      this.triggerEvent("selectype", selectValue)
      this.showSelect()
      this.setData({
        selectValue,
        selectOption
      })
    },
    _getOptionByValue(value) {
      const { selectOption } = this.data
      for (let i = 0; i < selectOption.length; i++) {
        if (selectOption[i].value == value) {
          return i
        }
      }
    }
  }
})