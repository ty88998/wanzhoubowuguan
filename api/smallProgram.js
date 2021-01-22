import { apiUtil } from '../utils/apiUtil'

/**
 * 进入对应展览页面
 * @param {*} params 
 */
export function toProjectDetail(params) {
    return apiUtil(
        'SmallProgram/toProjectDetail.do',
        params
    )
}

/**
 * 查询场景下的文物信息
 * @param {*} params 
 */
export function getSceneCollect(params) {
    return apiUtil(
        'SmallProgram/getSceneCollect.do',
        params,
        { loading: false }
    )
}

/**
 * 查询文物资源信息
 * @param {*} params 
 */
export function getCollectResource(params) {
    return apiUtil(
        'SmallProgram/getCollectResource.do',
        params
    )
}

/**
 * 查询文物文创信息
 * @param {*} params 
 */
export function getCultuProdus(params) {
    return apiUtil(
        'SmallProgram/getCultuProdus.do',
        params
    )
}

/**
 * 查询资源详细信息
 * @param {*} params 
 */
export function getIDResource(params) {
    return apiUtil(
        'SmallProgram/getIDResource.do',
        params
    )
}

/**
 * 查询讲解预约配置信息
 * @param {*} params 
 */
export function getSceneInfos(params) {
    return apiUtil(
        'SmallProgram/getSceneInfos.do',
        params
    )
}

/**
 * 获取后台发布的虚拟展出项目信息
 * @param {*} params 
 */
export function getProjectInfo(params,options={loading:true}) {
    return apiUtil(
        'SmallProgram/getProjectInfo.do',
        params,
        options
    )
}

/**
 * 游客点赞接口
 * @param {*} params 
 */
export function addLikeHistory(params) {
    return apiUtil(
        'SmallProgram/addLikeHistory.do',
        params
    )
}

/**
 * 游客收藏接口
 * @param {*} params 
 */
export function addCollectHistory(params) {
    return apiUtil(
        'SmallProgram/addCollectHistory.do',
        params
    )
}

/**
 * 获取单个文物信息
 * @param {*} params 
 */
export function getCollection(params) {
    return apiUtil(
        'SmallProgram/getCollection.do',
        params
    )
}