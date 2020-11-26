import { apiUtil } from '../utils/apiUtil'

// 文博智慧应用
const appID = 'wxaf6f7481a1dbaba7'
// 万州博物馆测试 
// const appID = 'wxdceb2def821cecc8'

/**
 * 获取微信OpenID
 * @param {*} params 
 */
export function getWXOpenId(params = { code: '' }) {
    return apiUtil(
        'indexInfo/getWXOpenId.do',
        { appID, ...params }
    )
}

/** 获取博物馆信息 */
export function getMuseumsInfo() {
    return apiUtil(
        'indexInfo/getMuseumsInfo.do',
        { appID }
    )
}
/**
 * 获取字典信息
 * @param {*} params 
 */
export function getDicInfos() {
    return apiUtil(
        'indexInfo/getDicInfos.do',
        { type: 'projectType ' }
    )
}

/**
 * 获取实体展列表
 * @param {*} params 
 */
export function getEntityDisplays(params) {
    return apiUtil(
        'indexInfo/getEntityDisplays.do',
        params
    )
}

/**
 * 实体展详情
 * @param {*} params 
 */
export function toEntityDisplay(params) {
    return apiUtil(
        'indexInfo/toEntityDisplay.do',
        params
    )
}

/**
 * 保存用户信息
 * @param {*} params 
 */
export function addTouristInfo(params) {
    return apiUtil(
        'indexInfo/addTouristInfo.do',
        params
    )
}

/**
 * 分页查询公告
 * @param {*} params 
 */
export function getNoticeInfos(params) {
    return apiUtil(
        'indexInfo/getNoticeInfos.do',
        params
    )
}

/**
 * 查询公告详情
 * @param {*} params 
 */
export function toNoticeInfo(params) {
    return apiUtil(
        'indexInfo/toNoticeInfo.do',
        params
    )
}

/** 获取馆内图片 */
export function getMuseumPicture(params) {
    return apiUtil(
        'indexInfo/getMuseumPicture.do',
        params
    )
}