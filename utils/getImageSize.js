/**
 * 获取图片大小
 * 
 * @param {String} imgUrl 
 */
export const getImageByUrl = (imgUrl = '') => {
    return new Promise((reslove, reject) => {
        wx.getImageInfo({
            src: imgUrl,
            success: (result) => {
                reslove(result)
            },
            fail: (error) => {
                reject(error)
            }
        })
    })
}