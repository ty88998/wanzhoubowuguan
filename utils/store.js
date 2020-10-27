// URL 配置
export const baseApi = {
  Dev: 'http://192.168.10.103:8100/',
  Prod: 'https://zrkj.cqzrkj.cn/'
}

/**
 * 添加储存元素
 * @param {*} key
 * @param {*} value
 * @param {*} module_name
 */
export const setItem = (key, value, module_name) => {
  if (module_name) {
      let module_name_info = this.getItem(module_name);
      module_name_info[key] = value;
      wx.setStorageSync(module_name, module_name_info);
  }
  else {
      wx.setStorageSync(key, value);
  }
}

/**
* 获取储存元素
* @param {*} key
* @param {*} module_name
*/
export const getItem = (key, module_name) => {
  if (module_name) {
      let val = this.getItem(module_name);
      if (val)
          return val[key];
      return '';
  }
  else {
      return wx.getStorageSync(key);
  }
}

/**
* 清除本地存储
* @param {*} key
*/
export const clear = (key) => {
  key ? wx.removeStorageSync(key) : wx.clearStorageSync();
}

/**
* 获取系统信息
*/
export const getSystemInfo = () => {
  return wx.getSystemInfoSync();
}