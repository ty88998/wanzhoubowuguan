import { getTouristInfo, toUpdateTouristInfo } from "../../api/personalCenter";

const appInst = getApp();

Page({
  // properties: {
  //   type:Array
  //   selectOption: {
  //     value: [{ type: "选项一", value: 0 },{ type: "选项二", value: 1 },],
  //   },
  // },
  data: {
    userInfo: {},
    sexList: [
      {
        type: "保密",
        value: "-1",
      },
      {
        type: "男",
        value: "1",
      },
      {
        type: "女",
        value: "0",
      },
    ],
  },

  onLoad() {
    this._getTouristInfo();
  },
  updateUserInfo() {
    const { recNo, city, sex, IDCard, name } = this.data.userInfo;
    toUpdateTouristInfo({ touristNo: recNo, city, sex, IDCard, name })
      .then(() => {
        wx.navigateBack({ delta: 1 });
      })
      .catch((err) => {
        wx.showToast({ title: err.codeMsg, icon: "none" });
      });
  },
  inputHandler(event) {
    const { value } = event.detail;
    const { type } = event.target.dataset;
    const { userInfo } = this.data;
    switch (type) {
      case "name":
        userInfo[type] = this._checkName(value);
        break;
      case "IDCard":
        userInfo[type] = this._checkCardId(value);
        break;
      default:
        userInfo[type] = value;
    }
    this.setData({ userInfo });
  },

  _getTouristInfo() {
    const { touristNo } = appInst.globalData;
    getTouristInfo({ touristNo })
      .then((res) => {
        this.setData({ userInfo: res });
      })
      .catch((err) => console.log(err));
  },

  /** 预约姓名检测 */
  _checkName(value) {
    // console.log(event.detail.value)
    const reg = /^[\u4e00-\u9fa5_a-zA-Z]+\D$/;
    // console.log()
    if (value && !reg.test(value)) {
      wx.showToast({
        title: "输入姓名不能包含数字",
        icon: "none",
      });
      value = "";
    }
    return value;
  },

  /**
   * 验证身份信息
   * @param {*} code
   */
  _checkCardId(code) {
    const city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 ",
    };
    let pass = true;
    if (code.length != 18) {
      pass = false;
    }
    const reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
    if (!code && !reg.test(code)) {
      // tip = "身份证号格式错误"
      pass = false;
    } else if (!city[code.substr(0, 2)]) {
      // tip = "地址编码错误"
      pass = false;
    } else {
      if (code.length === 18) {
        const codeList = code.split("");
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const parity = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0,
          ai = 0,
          wi = 0;
        for (let i = 0; i < 17; i++) {
          ai = codeList[i];
          wi = factor[i];
          sum += ai * wi;
        }
        let last = parity[sum % 11];
        if (last != code[17]) {
          // tip = "校验位错误"
          pass = false;
        }
      }
    }
    if (!pass) {
      wx.showToast({
        title: "证件信息错误！",
        icon: "none",
        duration: 1000,
      });
      code = "";
    }
    return code;
  },
});
