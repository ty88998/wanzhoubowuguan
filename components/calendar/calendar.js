Component({
  //初始默认为当前日期
  properties: {
    reserveDate: {
      type: Array,
      value: [{
        year: 2020, month: 3, date: 28, ticketInfo: "余1500"
      }, {
        year: 2020, month: 3, date: 29, ticketInfo: "闭馆"
      }, {
        year: 2020, month: 3, date: 30, ticketInfo: "余13"
      }, {
        year: 2020, month: 3, date: 31, ticketInfo: "余14"
      }, {
        year: 2020, month: 3, date: 24, ticketInfo: "余14"
      }, {
        year: 2020, month: 4, date: 1, ticketInfo: "余14"
      }]
    },
    weekText: {
      type: Array,
      value: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    },
    lastMonth: {
      type: String,
      value: '◀'
    },
    nextMonth: {
      type: String,
      value: '▶'
    },

  },

  data: {
    // 当月格子
    thisMonthDays: [],
    //上月格子
    empytGridsBefore: [],
    //下月格子
    empytGridsAfter: [],
    //显示日期
    title: '',
    //格式化日期
    format: '',
    year: 0,
    month: 0,
    date: 0,
    scrollLeft: 0,
    //常量 用于匹配是否为当天
    YEAR: 0,
    MONTH: 0,
    DATE: 0
  },
  ready() {
    this.today();
  },

  methods: {

    /**
     * 当年当月当天 滚动到制定日期 否则滚动到当月1日
     * @param {*} year 
     * @param {*} month 
     * @param {*} date 
     */
    scrollCalendar(year, month, date) {
      // console.log(year, month, date)
      let that = this, scrollLeft = 0;
      wx.getSystemInfo({
        success(res) {
          //切换月份时 date为0
          // console.log(res)
          if (date == 0) {
            scrollLeft = 0;
            //切换到当年当月 滚动到当日
            if (year == that.data.YEAR && month == that.data.MONTH) {
              scrollLeft = that.data.DATE * 45 - res.windowWidth / 2 - 22.5;
            }
          } else {
            // 点选具体某一天 滚到到指定日期
            scrollLeft = date * 45 - res.windowWidth / 2 - 22.5;
          }

          that.setData({
            scrollLeft: scrollLeft
          })
        }
      })
    },

    /** 初始化 */
    display(year, month, date) {
      this.setData({
        year,
        month,
        date,
        title: year + '年' + this.zero(month) + '月'
      })
      this.createDays(year, month);
      this.createEmptyGrids(year, month);

      //滚动模糊 初始界面
      this.scrollCalendar(year, month, date);
    },

    /** 默认选中当天 并初始化组件 */
    today() {
      // 设置日期
      const { reserveDate } = this.data
      const DATE = new Date()
      const { year, month, date } = reserveDate[0]
      let select
      // reserveDate.forEach(element => {
      for (let i = 0; i < reserveDate.length; i++) {
        let element = reserveDate[i]
        if (element.ticketInfo !== "闭馆" && element.ticketInfo !== "余0") {
          select = element.year + '-' + this.zero(element.month) + '-' + this.zero(element.date)
          break
        }
      }
      // if (reserveDate[0].ticketInfo === "闭馆") {
      //   select = reserveDate[1].year + '-' + this.zero(reserveDate[1].month) + '-' + this.zero(reserveDate[1].date)
      // } else {
      //   select = year + '-' + this.zero(month) + '-' + this.zero(date)
      // }
      this.setData({
        format: select,
        select: select,
        year: year,
        month: month,
        date: date,
        YEAR: DATE.getFullYear(),
        MONTH: DATE.getMonth() + 1,
        DATE: DATE.getDate()
      })

      //初始化日历组件UI,传入参数为当前日期
      this.display(year, month, date);

      //发送事件监听
      // this.triggerEvent('select', select);
    },

    /**
     * 选择 并格式化数据
     * @param {*} e 
     */
    select(e) {
      const { year, month } = this.data
      const { date, info } = e.currentTarget.dataset
      // console.log(info)
      if (info) {
        if (info !== "闭馆" && info !== "余0") {
          const select = this.data.year + '-' + this.zero(this.data.month) + '-' + this.zero(date)
          this.setData({
            title: year + '年' + this.zero(month) + '月' + this.zero(date) + '日',
            select, year, month, date
          })
          //滚动日历到选中日期
          this.scrollCalendar(this.data.year, this.data.month, date)
        } else {
          if (info !== "闭馆") {
            wx.showToast({
              title: `${info}时间不可预约`,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '当天不可预约',
              icon: 'none'
            })
          }
        }
      } else {
        wx.showToast({
          title: '当天不可预约',
          icon: 'none'
        })
      }
    },

    /** 上个月 */
    lastMonth() {
      let month = this.data.month == 1 ? 12 : this.data.month - 1;
      let year = this.data.month == 1 ? this.data.year - 1 : this.data.year;
      //初始化日历组件UI
      this.display(year, month, 0);
    },

    /** 下个月 */
    nextMonth() {
      let month = this.data.month == 12 ? 1 : this.data.month + 1;
      let year = this.data.month == 12 ? this.data.year + 1 : this.data.year;
      //初始化日历组件UI
      this.display(year, month, 0);
    },

    /** 获取当月天数 */
    getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    },

    /** 绘制当月天数占的格子,添加剩余预约票数 */
    createDays(year, month) {
      const { reserveDate } = this.data
      const thisMonthDays = []
      const days = this.getThisMonthDays(year, month)
      for (let i = 1; i <= days; i++) {
        let isReserve = false
        // 判断当天是否有票
        for (let j = 0; j < reserveDate.length; j++) {
          let reserve = reserveDate[j]
          if (reserve.year === year && reserve.month === month && reserve.date === i) {
            if (reserve.ticketInfo === "余0") {
              thisMonthDays.push({
                date: i,
                ticketInfo: reserve.ticketInfo,
                isOdd: false,
                isOdd: true,
                dateFormat: `${year}-${this.zero(month)}-${this.zero(i)}`
              })
            } else {
              thisMonthDays.push({
                date: i,
                ticketInfo: reserve.ticketInfo,
                isOdd: false,
                dateFormat: `${year}-${this.zero(month)}-${this.zero(i)}`
              })
            }
            isReserve = true
          }
        }
        if (!isReserve) {
          thisMonthDays.push({
            date: i,
            isOdd: true,
            dateFormat: `${year}-${this.zero(month)}-${this.zero(i)}`
          })
        }
      }
      this.setData({
        thisMonthDays
      })
    },

    /**
     * 比较时间是否晚于当前时间
     * @param {*} year 
     * @param {*} month 
     * @param {*} date 
     */
    _compareTwoDate(year, month, date) {
      const { YEAR, MONTH, DATE } = this.data
      return new Date(`${YEAR}-${MONTH}-${DATE}`).getTime() > new Date(`${year}-${month}-${date}`)
    },

    /**
     * 获取当月空出的天数
     * @param {*} year 
     * @param {*} month 
     */
    createEmptyGrids(year, month) {
      let week = new Date(Date.UTC(year, month - 1, 1)).getDay(),
        empytGridsBefore = [],
        empytGridsAfter = [],
        emptyDays = (week == 0 ? 7 : week);
      //当月天数
      var thisMonthDays = this.getThisMonthDays(year, month);
      //上月天数
      var preMonthDays = month - 1 < 0
        ? this.getThisMonthDays(year - 1, 12)
        : this.getThisMonthDays(year, month - 1);

      //空出日期
      for (let i = 1; i <= emptyDays; i++) {
        empytGridsBefore.push(preMonthDays - (emptyDays - i));
      }

      var after = (42 - thisMonthDays - emptyDays) - 7 >= 0
        ? (42 - thisMonthDays - emptyDays) - 7
        : (42 - thisMonthDays - emptyDays);
      for (let i = 1; i <= after; i++) {
        empytGridsAfter.push(i);
      }
      this.setData({
        empytGridsAfter,
        empytGridsBefore
      })
    },

    /** 确认时间选择 */
    confirm() {
      const { select } = this.data
      this.triggerEvent('select', { select, index: this._getIndexBySelect() })
    },

    _getIndexBySelect() {
      const { reserveDate, select } = this.data
      for (let i = 0; i < reserveDate.length; i++) {
        let reserve = reserveDate[i].year + '-' + this.zero(reserveDate[i].month) + '-' + this.zero(reserveDate[i].date)
        if (select === reserve) {
          return i
        }
      }
    },
    /**
     * 补全0
     * @param {*} i 
     */
    zero(i) {
      return i >= 10 ? i : '0' + i;
    }
  }
})