// 存储行高
let colHeight = []
// 上一次flowIndex索引
let flowIndex = 0
// 最小行index
let minIndex = 0

Component({
  properties: {
    flowData: Array,
    column: {
      type: Number,
      value: 2
    }
  },

  data: {
    showData: []
  },
  observers: {
    flowData(value) {
      if (flowIndex !== 0 && flowIndex >= value.length) {
        colHeight = []
        flowIndex = 0
        minIndex = 0
      }
      this._flowChangeHanlder()
    }
  },
  methods: {
    _flowChangeHanlder() {
      const column = this.data.column
      const showData = this.data.showData
      if (showData.length !== column) {
        colHeight = []
        minIndex = 0
        flowIndex = 0
        for (let k = 0; k < column; k++) {
          showData.push([])
          colHeight.push(0)
        }
      }
      this._render()
    },
    _render() {
      if (flowIndex < this.data.flowData.length) {
        const showData = this.data.showData
        this._getMinColIndex()
        showData[minIndex].push(this.data.flowData[flowIndex])
        this.setData({
          showData
        })
        flowIndex++
      }
    },
    loadColInfo(event) {
      colHeight[minIndex] += event.detail
      this._render()
    },
    _getMinColIndex() {
      for (let i = 0; i < colHeight.length; i++) {
        if (colHeight[i] < colHeight[minIndex]) {
          minIndex = i
        }
      }
    }
  }
})
