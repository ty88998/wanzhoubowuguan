import { getItem } from './store'

/**
 * api请求工具包装
 * @param {*} url
 * @param {*} data
 * @param {*} option
 */
export function apiUtil(url, data = {}, option = {}) {
    // 获取默认信息
    let { loading = true, toast = true, method = "POST" } = option

    // 返回promise设置
    return new Promise((resolve, reject) => {
        // 设置加载动画
        if (loading) {
            wx.showLoading({
                title: '加载中...',
                mask: true
            })
        }
        // 修改开发环境 Dev:本地, Prod:线上
        // const env = App.baseApi.Dev
        const env = App.baseApi.Prod
        const museumNo = getItem('museumNo')
        if (museumNo && !data.museumsInfoNo) {
            data.museumsInfoNo = museumNo
        }
        // 发起微信请求
        wx.request({
            url: env + url,
            data,
            method,
            // 微信返回执行操作
            success: result => {
                if (loading) wx.hideLoading()
                const res = result.data
                if (res.code === "0000") {
                    resolve(res)
                } else {
                    toast ? wx.showToast({
                        title: res.codeMsg,
                        icon: 'none',
                    }) : wx.hideLoading()
                    reject(res)
                }
            },
            // 请求失败执行操作
            fail: error => {
                // 展示toast
                if (loading) wx.hideLoading()
                wx.showToast({
                    title: '请求失败',
                    icon: 'none',
                })
                // 返回错误信息
                reject(error)
            }
        })
    })
}