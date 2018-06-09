import http from '../../jssdk/Http'
import JSBridge from '../JSBridge'
import MQTTService, { TOPIC } from '../MQTTService'
import Cookies from 'universal-cookie'
import config from '../../config'
import * as db from '../db';
import helper from '../../public/helper';
import BleApi from '../device';

const TB_SCENE = 'scene';
const TB_SCENE_DETAIL = 'scene_detail';
const cookies = new Cookies()
const SCENE_SERVICE = 'scene';
const serviceURL = `${config.httpServer}/${SCENE_SERVICE}`

let addRuleQue = [];
export default class Scene {
  constructor () {
    this.jsBridge = JSBridge;
    this.mqttService = MQTTService;
    this.BleApi 	 = new BleApi;

  }

  list (data) {
    console.log('-----------------------list----------------------',data)
    return db.querySQL(`SELECT id, scene_name as name, icon FROM ${TB_SCENE}`).then((res) => {
      if(res.code === 200) {
        return {
          code: res.code,
          data: res.data.map((item) => {
            const newItem = { ...item };
            newItem.sceneId = item.id;
            return newItem;
          })
        }
      }

      return res;
      
    });
  }
	/**
	 * 删除场景
	 * @param {String} options.userId 用户ID
	 * @param {Object} options.seq 会话ID
	 * @param {Object} options.payload 消息体
	 * @return {Promise}
	 */
  delete (options) {
    console.log('-------------------- delect ------------ scene --------',options)
    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }

   let thenArr =[] 
   let that =this;
   this.getSceneRuleReq({
    payload: {
      sceneId: req.sceneId
    }
   }).then(res=>{
    console.log('-----------------------------------------getSceneRuleReq',res)
    // thenArr =res.payload.then;
    res.payload.then.map((item,index)=>{
      this.deleteRule({
       payload: {
         sceneId: req.sceneId,
         devId: item.id
       }
      }) 
    });
   });

  //  thenArr.map((item,index)=>{
  //    that.deleteRule({
  //     payload: {
  //       sceneId: req.sceneId,
  //       devId: item.id
  //     }
  //    }) 
  //  });

    return new Promise((resolve) => {
        db.deleteData(TB_SCENE, 'id=?', [Number(req.sceneId)]).then((res) => {
        if (res.code === 200) {
             db.deleteData(TB_SCENE_DETAIL, 'scene_id=?', [Number(req.sceneId)]);

             console.log('-------------------- delect ------success------ scene --------')
             resolve ({
               ack:{
                 code:200,
                 decs:'success',
               },
               payload:{
                 sceneId:req.sceneId
               }

             });
       }else{
        console.log('-------------------- delect ------fail------ scene --------')
            resolve ({ack:res}) }                    
     }); 

    })
   
  }

	/**
	 * 删除场景规则
	 */
  deleteRule (options) {
    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    console.log('--------------------------------------------delect rule ????????????????')

    this.BleApi.delScene({ 
      sceneId:this.parseIntToString(req.sceneId,2),
      devId:this.parseIntToString(req.devId,2)+'00'
    })
    return db.deleteData(TB_SCENE_DETAIL, 'scene_id=? and device_id=?', [Number(req.sceneId),Number(req.devId)]);
   

  }

	
	/**
	 * 执行场景
	 */
  execute (options) {

    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    return new Promise ((resolve) =>{
      
      this.BleApi.loadScene({ 
        sceneId:this.parseIntToString(req.sceneId,2)
      })
      resolve ({
        ack:{
          code:200,
          desc:'Success'
          },
          payload:{
            sceneId:req.sceneId,
           }
      });

    })
  }

	/**
	 * 6.2添加场景
	 * @param {String} cookieUserId 用户ID
	 * @param {String} cookieUserToken 用户Token
	 * @param {String} name 场景名
	 * @param{String} icon 场景图标名称
	 * @param{String} homeId 当前家的ID
	 */
  addScene (data) {

    const { name, icon, homeId } = data;

    let scene_id =1;

   return this.BleApi.getNextSceneId({field:'scene_id'}).then((sceneId)=>{

      console.log('-------------getNextSceneId ------------------------',sceneId);
      scene_id =sceneId;
      return db.querySQL(`SELECT * FROM ${TB_SCENE} WHERE scene_name='${name}' and space_id='${homeId}'`).then((res) => {
      	console.log("查询场景列表结果 = ",res)
	      if(res.code === 200) {
	      	if(res.data && res.data.length > 0){
	     			return {
				      code: -1000,
				      desc:"The name of the scene has already existed",
				    };
	     		}else {
	     			 return db.insert(TB_SCENE, {
			        scene_name: name,
			        icon: icon,
			        space_id: homeId,
			        id:scene_id,
			  
			      }).then(res => ({
			        code: res.code,
			        data: {
			          sceneId: res.data.id
			        }
			      }));
	     		}
	      }
	
	      return res;
      
    	});

     

    })

  
  }

	/**
	 * 6.3编辑场景
	 * @param {String} cookieUserId 用户ID
	 * @param {String} cookieUserToken 用户Token
	 * @param{String} sceneId 场景ID
	 * @param {String} name 场景名
	 * @param {String} icon 场景图标名称
	 * @param {String} homeId 当前家的ID
	 */
  editScene (data) {
    console.log('editScene data = ', data)
    const { name, icon, homeId, sceneId } = data;
    
    return db.querySQL(`SELECT * FROM ${TB_SCENE} WHERE scene_name='${name}' and space_id='${homeId}' and id!='${sceneId}'`).then((res) => {
      	console.log("查询场景列表结果 = ",res)
	      if(res.code === 200) {
	      	if(res.data && res.data.length > 0){
	     			return {
				      code: -1000,
				      desc:"The name of the scene has already existed",
				    };
	     		}else {
	     			 return db.update(TB_SCENE, {
					      scene_name: name,
					      icon: icon,
					      space_id: homeId
					    },
					    'id=?',
					    [sceneId],
					  ).then(res => ({
					      code: res.code,
					      data
					    }));;
	     		}
	      }
	
	      return res;
      
    	});
    
  }

	/**
	 * 6.6获取场景中的设备规则
	 * @param sceneId{String} sceneId 场景ID
	 */
  
  getSceneRuleReq (options) {
    const req = options.payload || {}
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    const resData = {
      payload: {
        sceneId: req.sceneId,
        then: [],
      },
      ack: {
        code: 200,
        desc: 'success',
      },
    };

    return db.querySQL(`SELECT scene_id, idx, thenType, device_id, attr FROM ${TB_SCENE_DETAIL} WHERE scene_id=${req.sceneId}`).then((res) => {
      const { code, data } = res;
      const arr = [];
      res.data.forEach((element) => {
        const param = {
          idx: element.idx,
          thenType: element.thentype,
          id: element.device_id,
          attr: JSON.parse(element.attr),
        };
        arr.push(param);
      });
      resData.payload.then = arr;

      return resData;
    });

  }

	/**
	 * 6.8 添加场景规则
	 * @param sceneId{String} 场景ID
	 * @param idx{Int32Array} 规则ID！！！！这个ID应该由云端产生
	 * @param type{String}设备类型 dev
	 * @param devId{String} 设备ID
	 * @param attr{obj} 设备规则属性
	 */
  addSceneRuleReq (options) {
    const req = options.payload || {}
   
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    if (!req.id) {
      throw new Error('payload.devId is required.')
    }

  console.log('--------------------------------------- scene --addSceneRuleReq -----------',options)

  // addRuleQue.push(options);
  // if (addRuleQue.length>0) { 
  // }

  let comData =this.setComData(req);
  this.BleApi.addScene(comData)
  
  const device_id =req.id;
  const attr = JSON.stringify(req.attr)
  const scene_id = req.sceneId
  const {
     idx,thenType
  } = req;
  return db.insert(TB_SCENE_DETAIL, {
      scene_id,
      idx,
      attr,
      thenType,
      device_id,   
    }).then(res=>({
      payload: {
        id: req.id,
        
      },
      ack: {
        code: 200,
        desc: 'success',
      },

    }));
  }

	/**
	 * 6.10 编辑场景规则
	 * @param sceneId{String} 场景ID
	 * @param idx{Int32Array} 规则ID！！！！这个ID应该由云端产生
	 * @param type{String}设备类型 dev
	 * @param devId{String} 设备ID
	 * @param attr{obj} 设备规则属性
	 */
  editSceneRuleReq (options) {
    const req = options.payload || {}
    console.log('editSceneRuleReq req = ', req)
    if (!req.sceneId) {
      throw new Error('payload.sceneId is required.')
    }
    if (!req.id) {
      throw new Error('payload.devId is required.')
    }

    let comData =this.setComData(req);
    this.BleApi.addScene(comData)


    const device_id =req.id;
    const scene_id = req.sceneId
    const requestQue = [];
    requestQue.push(
      db.deleteData(TB_SCENE_DETAIL, 'scene_id=? and device_id=?', [Number(scene_id),Number(device_id)]),
      this.addSceneRuleReq(options),
    );

    return Promise.all(requestQue).then(() => ({
      payload: {
        id: req.id,
       
      },
      ack: {
        code: 200,
        desc: 'success',
      },
    }));

  }

  //指令拼接
	setComData(item){    
    console.log('------------------setComData-------------',item)
   
  	let sceneId =this.parseIntToString(item.sceneId,2);
		let that = this
		let type =item.attr.RGBW ?'00' :'01'
		let dim ='00';
		if(item.attr.Dimming && item.attr.OnOff==1){
		   console.log('---------------Dimming-----------------')
		   if(item.devType.indexOf('plug')>-1){// plug 设置亮度100 为开
			   dim ='64'
		   }else
		   dim =that.parseIntToString(item.attr.Dimming,2);  
		  //  console.log(dim)		   
    }
   
		let cct ='00';
		if(item.attr.CCT && item.attr.OnOff==1){
			console.log('cctcctcctcctcctcctcctcctcctcct')
			cct =that.parseIntToString(item.attr.CCT,2);  
    }
   
		let r ='00';
		let g ='00';
		let b ='00';
		if(item.attr.RGBW && item.attr.OnOff==1){
		  console.log('---------------------------- rgbw ------------------------------')	
		  let col =  helper.int2Rgb(item.attr.RGBW);
		   r =col.substring(1,3);
		   g =col.substring(3,5);
		   b =col.substring(5,7);  
    }
    
		let ScencCom = {
			"devId":that.parseIntToString(item.id ,2)+'00',//0000
			"itemId":item.id,
			"sceneId":sceneId ,
			"param":`${dim}${cct}${r}${g}${b}${type}`,
			"type":'Scenc',
      "devType" :item.devType,// 存数据库用/
      "thenType" :item.thenType
    }

		 return ScencCom;
   }


   parseIntToString(options,length){
    let srtHex =parseInt(options).toString(16);
    console.log('-------parseInt --',srtHex);
    return (Array(length).join(0) + srtHex).slice(-length);
   }

  
  /**
* 8.8设置安防密码请求
*/
setSecurityPasswd (options) {
   /* const req = options.payload || {}
    console.log('setSecurityPasswd req = ', req)

    return this.mqttService.sendData({
      service: 'security',
      method: 'setSecurityPasswdReq',
      seq: options.seq || (new Date().getTime() + '').substr(4, 9),
      srcAddr: options.userId || cookies.get('userId'),
      topic: `${TOPIC.serverV1}/${cookies.get('userId')}/${'security'}/setSecurityPasswdReq`,
      payload: req
    })*/

    const fakePromise = {
      resolve: function () {},
      reject: function () {},
      then: function (cb) {
        this.resolve = cb
        return this
      },
      catch: function (cb) {
        this.reject = cb
        return this
      }
    }

    let timer = setTimeout(function () {
      clearTimeout(timer)
      fakePromise.resolve({ack:{code:200}}); 
   }, 1000);


    return fakePromise;
  }
  
}
