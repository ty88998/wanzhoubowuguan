/**
 * 对象格式为路径
 * @param {*} nextInfo 
 */
export function urlParse(nextInfo = {}) {
    let url = ''
    for (let key in nextInfo) {
        if (nextInfo[key] != null) {
            url += key == 'url' ? `${nextInfo[key]}?` : `${key}=${nextInfo[key]}&`
        }
    }
    return url.slice(0, url.length - 1)
}

/**
 * 用户登录拦截,参数转换禁止使用路径通配符
 * @param {*} nextInfo 用户跳转页面信息参数
 */
export function loginIntercept(nextInfo) {
    wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.userInfo']) {
                if (nextInfo) {
                    wx.navigateTo({ url: '/pages/login/login?nextInfo=' + JSON.stringify(nextInfo) })
                } else {
                    wx.navigateTo({ url: '/pages/login/login' })
                }
            } else {
                if (nextInfo) {
                    wx.navigateTo({
                        url: urlParse(nextInfo)
                    })
                }
            }
        }
    })
}