import { getSysInfoCfg, addSgReserveInfo, getReserveInfo } from '../../api/reserveInfo'

const selectOption = [{ type: "二代身份证", value: "1" }, { type: "港澳居民来往内地通行证", value: "2" }, { type: "台胞证", value: "3" }, { type: "护照", value: "4" }, { type: "军官证", value: "5" }]
const selectTimes = [{ name: "上午", value: 0, checked: false }, { name: "下午", value: 1, checked: false }]
const appInst = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recNo: '',
    selectTimes,
    selectOption,
    defaultCard: "1",
    ticketQuantity: [],
    showCalendar: false,
    reserveDate: [],
    visitorName: '',
    date: '',
    arriveTime: '',
    visitorPhone: '',
    visitorCardId: '',
    cardType: "二代身份证",
    address: '0',
    btnText: '',
    isShow: true
  },

  onLoad(options) {
    if (options.recNo) {
      this.setData({ isShow: false })
      this._getReserveDetail(options.recNo)
      this.setData({ recNo: options.recNo, btnText: '确定修改' })
      wx.setNavigationBarTitle({ title: '修改预约' })
    } else {
      // this.setData({ address: appInst.globalData.address })
      // 获取当前日期
      this.verifyDate(new Date())
      // 获取预约地址
      // this._getReserveAddr()
    }
  },

  /** 获取用户预约信息 */
  async _getReserveDetail(recNo) {
    const { selectTimes } = this.data
    try {
      const res = await getReserveInfo({ recNo })
      const { visitorName, appointmentDate, arriveTime, visitorCardId, visitorPhone, visitorType, arriveAddressNo } = res.data
      selectTimes[res.data.arriveTime].checked = true
      this.setData({
        isShow: true,
        cardType: visitorType,
        defaultCard: this._getCardTypeValue(visitorType),
        address: arriveAddressNo,
        visitorName, selectTimes,
        date: appointmentDate,
        arriveTime, visitorCardId, visitorPhone
      })
    } catch (error) {
      console.log('error: ', error)
    }
  },

  /** 获取数组下标 */
  _getCardTypeValue(data) {
    for (let i = 0; i < selectOption.length; i++) {
      let item = selectOption[i]
      if (item.type === data) {
        return item.value
      }
    }
  },

  /** 预约姓名检测 */
  checkUserName(event) {
    let { value } = event.detail
    // console.log(event.detail.value)
    const reg = /^[\u4e00-\u9fa5_a-zA-Z]+\D$/
    // console.log()
    if (value && !reg.test(value)) {
      wx.showToast({
        title: '输入姓名不能包含数字',
        icon: 'none'
      })
      value = ''
    }
    this.setData({
      visitorName: value
    })
  },

  /**
   * 选择日期
   */
  async selectDate() {
    try {
      const res = await getSysInfoCfg()
      this.setData({
        reserveDate: res.data,
        showCalendar: true
      })
    } catch (error) {
      console.log('error: ', error)
    }
  },

  /**
   * 设置证件类型
   * @param {*} event 
   */
  selectType(event) {
    this.setData({
      cardType: event.detail.type
    })
  },

  // 上午下午选择
  radioChange(el) {
    const { value } = el.detail
    this.setData({
      arriveTime: value
    })

  },

  changeCardKind() {
    this.setData({
      isShowSelect: !this.data.isShowSelect,
    })
  },

  // 整理日期
  formatTimeInfo(time) {
    return time > 10 ? `${time}` : `0${time}`
  },

  /**
   * 选择日期
   * @param {*} event 
   */
  bindDateChange(event) {
    const value = event.detail.select
    const index = event.detail.index
    const date = new Date()
    // console.log(event)
    // const date = new Date()
    const oldDate = this.data.date
    const today = this.formatTimes(date)
    let ticketQuantity
    // 检查选择日期是否为今天
    if (value === today) {
      const hours = parseInt(date.getHours())
      ticketQuantity = hours < 12 ? [this.data.reserveDate[index].AMcont, this.data.reserveDate[index].PMcont] : [this.data.reserveDate[index].PMcont]
      // 查看之前设置的日期
      if (oldDate) {
        // 验证当前日期，修改时间信息
        this.verifyDate(date)
      }
    } else {
      // 日期不是今天，设置为初始化时间
      ticketQuantity = [this.data.reserveDate[index].AMcont, this.data.reserveDate[index].PMcont]
      this.setData({ selectTimes: [{ name: "上午", value: 0, checked: false }, { name: "下午", value: 1, checked: false }] })
    }
    this.setData({
      date: value,
      showCalendar: false,
      ticketQuantity
    })
  },

  /**
   * 验证手机号
   * @param {*} e 
   */
  checkPhoneNum(e) {
    let phone = e.detail.value
    let str = /^1[3456789]\d{9}$/
    if (phone && !str.test(e.detail.value)) {
      wx.showToast({
        title: '手机号错误',
        image: '../../assets/cuowu.png'
      })
      phone = ''
    }
    this.setData({ visitorPhone: phone })
  },

  // 验证日期,处于不同的时间段进行不同的操作
  verifyDate(date) {
    // 获取当前时间
    const expiredHour = 16, expiredMinute = 30
    const hours = parseInt(date.getHours())
    const minute = parseInt(date.getMinutes())
    if (hours > 11 && hours < expiredHour) {
      this.setData({
        selectTimes: [{ name: "下午", value: 1, checked: false }]
      })
    } else if (hours === expiredHour) {
      if (minute < expiredMinute) {
        this.setData({
          selectTimes: [{ name: "下午", value: 1, checked: false }]
        })
      }
    }
  },

  // 格式化时间
  formatTimes(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(this.formatTimeInfo).join('-')
  },

  /** 提交信息 */
  formSubmit() {
    const { visitorName, visitorPhone, date, visitorCardId, cardType, arriveTime, address, recNo } = this.data
    const openid = appInst.globalData.openId
    if (this.checkPostData()) {
      wx.showLoading({ title: '提交中...', mask: true })
      addSgReserveInfo({
        recNo, appointmentDate: date, arriveTime: parseInt(arriveTime), ticketNum: 1,
        visitorName, visitorPhone, visitorCardId, cardType, arriveAddress: address, openid
      }).then(res => {
        wx.hideLoading()
        if (res.code === "0000") {
          if (this.data.recNo) {
            wx.navigateBack({ delta: 1 })
          } else {
            wx.reLaunch({ url: "/pages/success/success" })
          }
        } else {
          wx.showToast({ title: res.codeMsg, icon: 'none', duration: 1500 })
          setTimeout(() => { wx.navigateBack({ delta: 1 }) }, 2000)
        }
      }).catch(error => {
        console.log('error: ', error)
      })
    }
  },

  /** 验证提交数据 */
  checkPostData() {
    // debugger
    const { visitorName, visitorPhone, date, visitorCardId, arriveTime } = this.data
    if (date === '') {
      wx.showToast({
        title: "请填写日期",
        image: '../../assets/cuowu.png'
      })
      return false
    }
    if (arriveTime === '') {
      wx.showToast({
        title: "请选择到达时间",
        image: '../../assets/cuowu.png'
      })
      return false
    }
    if (visitorName === '') {
      wx.showToast({
        title: "请填写名称",
        image: '../../assets/cuowu.png'
      })
      return false
    }
    if (visitorPhone === '') {
      wx.showToast({
        title: "请填写电话",
        image: '../../assets/cuowu.png'
      })
      return false
    }
    if (visitorCardId === '') {
      wx.showToast({
        title: "请填写证件信息",
        image: '../../assets/cuowu.png'
      })
      return false
    }
    return true
  },

  /**
  * 验证身份信息
  * @param {*} e 
  */
  getCardId(e) {
    let code = e.detail.value
    if (this.data.cardType === "二代身份证" && code) {
      const city = {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽",
        35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州",
        53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 "
      }
      let pass = true
      if (code.length != 18) {
        pass = false
      }
      const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/
      if (!code && !reg.test(code)) {
        // tip = "身份证号格式错误"
        pass = false
      } else if (!city[code.substr(0, 2)]) {
        // tip = "地址编码错误"
        pass = false
      } else {
        if (code.length === 18) {
          const codeList = code.split('')
          const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
          const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
          let sum = 0, ai = 0, wi = 0
          for (let i = 0; i < 17; i++) {
            ai = codeList[i]
            wi = factor[i]
            sum += ai * wi
          }
          let last = parity[sum % 11]
          if (last != code[17]) {
            // tip = "校验位错误"
            pass = false
          }
        }
      }
      if (!pass) {
        wx.showToast({
          title: "证件信息错误！",
          image: '../../assets/cuowu.png',
          duration: 1000,
        })
        code = ''
      }
    }
    // debugger
    this.setData({
      visitorCardId: code
    })
  }

})