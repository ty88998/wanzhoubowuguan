import { apiUtil } from '../utils/apiUtil'

/**
 * 获取游客收藏信息
 * @param {*} params 
 */
export function getCollectHistory(params) {
    return apiUtil(
        'personalCenter/getCollectHistory.do',
        params
    )
}

/**
 * 获取游客历史信息
 * @param {*} params 
 */
export function getBrowsingHistory(params) {
    return apiUtil(
        'personalCenter/getBrowsingHistory.do',
        params
    )
}

/**
 * 修改用户信息
 * @param {*} params 
 */
export function toUpdateTouristInfo(params) {
    return apiUtil(
        'personalCenter/toUpdateTouristInfo.do',
        params
    )
}

/**
 * 获取用户信息
 * @param {*} params 
 */
export function getTouristInfo(params) {
    return apiUtil(
        'personalCenter/getTouristInfo.do',
        params
    )
}

/**
 * 清空历史
 */
export function getBrowseEmpty(params) {
    return apiUtil(
        'personalCenter/getBrowseEmpty.do',
        params
    )
}
