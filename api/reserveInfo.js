import { apiUtil } from '../utils/apiUtil'

/** 获取博物馆信息 */
export function getMuseums() {
    return apiUtil(
        'reserveInfo/getMuseums.do'
    )
}

/** 获取博物馆预约设置信息 */
export function getReserveSetting() {
    return apiUtil(
        'reserveInfo/getReserveSetting.do'
    )
}

/** 添加博物馆预约信息 */
export function getReserve() {
    return apiUtil(
        'reserveInfo/addSgReserveInfo'
    )
}

/** 添加预约信息 */
export function addSgReserveInfo(params) {
    return apiUtil(
        'reserveInfo/addSgReserveInfo.do',
        params
    )
}

/** 获取用户预约信息 */
export function getUserReserveInfo(params) {
    return apiUtil(
        'reserveInfo/selectSgReserveInfoOne.do',
        params
    )
}

/** 获取单条预约信息 */
export function getReserveInfo(params) {
    return apiUtil(
        'reserveInfo/selectSgReserveInfo.do',
        params
    )
}

/** 获取预约票数 */
export function getSysInfoCfg() {
    return apiUtil(
        "reserveInfo/getSysInfoCfg.do"
    )
}


/** 删除用户预约信息 */
export function delteSgReserveInfo(params) {
    return apiUtil(
        "reserveInfo/delteSgReserveInfo.do",
        params
    )
} 