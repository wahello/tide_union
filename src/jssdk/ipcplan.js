import http from '../jssdk/Http';
import paypal from '../jssdk/paypal';
import config from '../config';
// const baseUrl = `${config.httpServer}/videoPlanController`;
// const baseUrl = 'http://172.24.20.220:8888/lds-access/videoPlanController';
// const roomURL = 'http://172.16.55.119:8090/space';
// const baseUrl = 'http://172.24.24.86:18080/videoController';
//const baseUrl = 'http://172.24.24.15:18080/videoController';//李帅电脑
//const deviceUrl = 'http://172.24.24.15:18080/deviceController';//李帅电脑
//const baseUrl = 'http://192.168.6.111:18080/videoController';//开发环境
//const deviceUrl = 'http://192.168.6.111:18080/deviceController';//开发环境
const baseUrl = `${config.httpServer}/videoController`;
const deviceUrl = `${config.httpServer}/deviceController`;
export default{


    /**
    * 14.1.1  查询设备计划类型
    * @param {String} data.devId 设备ID
    * @param {String} data.cookieUserId 用户id
    * @param {String} data.cookieUserToken 会话token
    * @return {Promise}   
    */
    getBindPlanType(data) {
        return http.post({ url: `${baseUrl}/getBindPlanType`, data });
    },
	/**
	 * 14.1.2  查询计划列表
     * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {int} data.search_currPage 起始页
	 * @param {int} data.search_pageSize 页数
	 * @return {Promise}
	 */
    getPlanList(data) {  
        return http.post({ url: `${baseUrl}/getPlanList`,  data });
    },

    /**
     * 14.1.3  修改录影状态 
     * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} planId 计划id
	 * @param {int} planExecState 计划执行状态
	 * @return {Promise}
	 */
    updatePlanExecStatus(planId,planExecState) {
        return http.post({ url: `${baseUrl}/updatePlanExecStatus?${planId + '&' + planExecState}`});
    },
    /**
      * 查询录影任务
      * @param {String} data.cookieUserId 用户id
      * @param {String} data.cookieUserToken 会话token
      * @param {String} planId 计划id
      * @return {Promise}
	 */
    getVideoTaskList(planId) {
        return http.post({ url: `${baseUrl}/getVideoTaskList?${planId}`});
    },
    
    /**
      * 修改录影计划任务
      * @param {String} data.cookieUserId 用户id
      * @param {String} data.cookieUserToken 会话token
      * @param {String} planId 计划id
      * @param {int} planExecState 计划执行状态 
      * @param {int} packageId 套餐id
      * @param {int} planCycle 计划周期
      * @param {int} executeStartTime	任务开始时间
      * @param {int} executeEndTime	任务结束时间
      * @param {int} planStatus	计划状态
      * @param {int} taskDate	计划时间
      * @return {Promise}
	  */
    updatePlanTask(data) {
      return http.post({ url: `${baseUrl}/updatePlanTask`, data });
    },
    /**
     * 14.1.4  修改计划排序
     * @param {String} data.cookieUserId 用户id
     * @param {String} data.cookieUserToken 会话token
     * @param {String} data.planId 计划id
     * @param {String} data.planOrder 计划执行状态
     * @return {Promise}
     */
    updatePlanOrder(data) {
        return http.post({ url: `${baseUrl}/updatePlanOrder`, data });
    },

    /**
     * 14.1.5  新增录影计划
     * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.planId 计划id
	 * @param {String} data.packageId 套餐标识
     * @param {String} data.paidPrice 付款金额
	 * @param {String} data.planStartTime 计划开始时间
	 * @param {String} data.planEndTime 计划结束时间
	 * @param {String} data.payType 付款方式
     * @param {String} data.currency 货币类型
	 * @param {String} data.tradeId 交易号
     * @param {String} data.packageName 套餐名
	 * @return {Promise}
	 */
    createPlan(data) {
        return http.post({ url: `${baseUrl}/createPlan`,  data });
    },

     /**
     * 14.1.6  查询录影任务列表
     * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.planId 计划id
	 * @return {Promise}
	 */
    getVedioTaskList(data) {
        return http.get({ url: `${baseUrl}/getVideoTaskList`,  data });
    },

     /**
     * 14.1.7  修改录影任务列表
     * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.taskPlanList 录影计划列表
	 * @return {Promise}
	 */
    updateVedioTaskList(data) {
        return http.get({ url: `${baseUrl}/updateVideoTaskList`, data });
    },
    
    /**
     * 14.1.8  设备绑定计划
     * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.planId 计划ID
     * @param {String} data.deviceId 设备ID
	 * @return {Promise}
	 */
    
    planBandingDevice(planId,deviceId) {
        return http.post({ url: `${baseUrl}/planBandingDevice?${planId + '&' + deviceId}` });
    },

    /**
     * 14.1.9  查询计划套餐
     * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.deviceType 设备类型
	 * @return {Promise}
	 */
    getVideoPackageList(data) {
        return http.post({ url: `${baseUrl}/getVideoPackageList`,  data });
    },

    /**
     * 14.1.10  更改计划名称
     * @param {String} data.cookieUserId 用户id
	   * @param {String} data.cookieUserToken 会话token
	   * @param {String} data.planId 计划ID
     * @param {String} data.planName 计划名称
	 * @return {Promise}
	 */
    updatePlanName( data ) {
        return http.post({
            url: `${baseUrl}/updatePlanName?`, data });
    },
 
     /**
	 * 	14.3.2	获取事件列表
	 * @param {String} data.planId 计划ID
	 * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.startTime 开始时间
	 * @param {String} data.endTime 结束时间
	 * @return {Promise}
	 */
     getVideoEventList(data) {
        return http.post({ url: `${baseUrl}/getVideoEventList`, data });
    },
     
     /**
	 * 	14.3.3  获取事件图片URL列表
	 * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.search_eventCode 事件代码
	 * @param {String} data.search_planId 计划ID
	 * @param {String} data.search_executeStartTime 执行开始时间
	 * @param {String} data.search_executeEndTime 执行结束时间
	 * @param {String} data.search_currPage 当前页
	 * @param {String} data.search_pageSize 每页条数
	 * @return {Promise}
	 */
    getEventPhotoList(data) {
        return http.post({ url: `${baseUrl}/getEventPhotoList`, data });
    },
    /**
	 * 	14.3.4	删除事件请求
	 * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.planId 计划ID
	 * @param {String} data.eventId 事件Id 
	 * @return {Promise}
	 */
     getEventList(data) {
        return http.post({ url: `${baseUrl}/getEventList`, data });
    },
     
     /**
	 * 	14.6.1	获取文件列表
	 * @param {String} data.cookieUserId 用户id
	 * @param {String} data.cookieUserToken 会话token
	 * @param {String} data.planId 计划ID
	 * @param {String} data.startTime 开始时间
	 * @param {String} data.endTime 结束时间
	 * @return {Promise}
	 */
    getVideoFileList(data) {
        return http.post({ url: `${baseUrl}/getVideoFileList`, data });
    },
	
    /**
	 * 	15.1    根据设备id 查询p2pId
	 * @param {String} data.deviceId 设备id
	 * @return {Promise}
	 */
    getP2pId(devId) {
        return http.post({ url: `${deviceUrl}/getP2pId?${devId}`});
    },
    /**
	 * 	15.1.11   依据设备id查询计划详情
	 * @param {String} data.deviceId 设备id
	 * @return {Promise}
	 */
    getPlanInfoByDevId(data) {
        return http.post({ url: `${baseUrl}/getPlanInfoByDevId`, data });
    },
    /**
	 * 15.2.1	根据设备id查询计划类型
	 * @param {String} data.deviceId 设备id
	 * @return {Promise}
	 */
	getPlanType(devId){
		return http.post({ url: `${baseUrl}/getPlanType?${devId}`});
    },
	/**
	 * 15.3.8	查询一段时间的事件数量
	 * @param {String} data.planId 计划ID
	 * @param {String} data.startTime 开始时间
	 * @param {String} data.endTime 结束时间
	 * @return {Promise}
	 */
	getVideoEventCount(data){
		return http.post({ url: `${baseUrl}/getVideoEventCount`, data });
    },
		
    /**
	 * 15.2.2	查询未绑定计划设备列表
	 * @param {String} data.deviceType 设备类型
     * @param {String} data.search_currPage 当前页
     * @param {String} data.search_pageSize 每页条数
	 * @return {Promise}
	 */
	getUnBindPlanDeviceList(data){
		return http.post({ url: `${deviceUrl}/getUnBindPlanDeviceList`,data});
    },
    
    /**
     * 15.5.7	购买视频计划
     * @param {String} data.cancelUrl 取消的返回地址
     * @param {String} data.successUrl 成功的返回地址
     * @param {String} data.errorUrl 错误的返回地址
	 * @param {String} data.counts 购买数量
	 * @param {String} data.currency  货币代码 USD
	 * @param {String} data.packageId 对应套餐包id,
     * @param {String} data.payPrice 总价格 
     * @param {String} data.planId 计划ID（传值为续费，不传则为购买新计划）
     */
    buyVideoPlan(data) {
        return paypal.paypal({ url: `${baseUrl}/buyVideoPlan`, data });
    },
	
 
}