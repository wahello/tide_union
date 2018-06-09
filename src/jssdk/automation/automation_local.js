import * as db from '../db';
import BleApi from '../device';
import { Toast,DatePicker,LocaleProvider } from 'antd-mobile';
import helper from '../../public/helper';


const TB_RULE = 'ifttt_rule';
const TB_THEN = 'ifttt_actuator';
const TB_IF = 'ifttt_sensor';
const RULE_TYPE = {
  timer: 'timer',
  dev: 'dev'
};
let instance = null;

export default class Automation {
  constructor() {  
    if (instance) {
      return instance;
    }

    instance = this;
    this.BleApi 	 = new BleApi;
  }

  /**
   * 7.1  获取Automation列表
   * 
   */

  getAutoList(req) {
    return db.querySQL(`SELECT rowid, name, icon, status, type FROM ${TB_RULE} WHERE space_id='${req.homeId}'`).then((res) => {
      const { code, data } = res;
      return {
        code,
        data: {
          result: data.map((item) => {
            const newItem = { ...item };
            newItem.autoId = item.rowid;
            newItem.enable = item.status ==0?false:true;
            return newItem;
          }),
        },
      };
    });
  }
  /**
   * 7.2  添加Auto
   * 
   */

  addAuto(data) {
    const {
      name, icon, type, homeId, enable,
    } = data;

    return db.insert(TB_RULE, {
      name,
      icon,
      type,
      space_id: homeId,
      status: enable ? 1 : 0,
    }).then(res => ({
      code: res.code,
      data: {
        autoId: res.data.id
      }
    }));
  }
  /**
   * 7.3  编辑Auto
   * 
   */

  editAuto(data) {
    const {
      name, icon, type, enable, autoId, homeId
    } = data;

    return db.update(
      TB_RULE,
      {
        name,
        icon,
        type,
        space_id: homeId,
        status: enable ? 1 : 0,
      },
      'id=?',
      [autoId],
    );
  }

  /**
   * 7.4 删除Automation
   * @param {String} options.autoId  AutomationID
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */
  delAutomation(options) {
    const req = options.payload || {};

    return new Promise((resolve) => {
     this.getAutoRuleThen({payload:{autoId:req.autoId}}).then((res)=>{
      if (res.code === 200) {
      const arr = [];
      const { data } = res;

      data.forEach((element) => {
        const param = {
          devId: this.parseIntToString(element.device_id,2)+'00',
          timerId: this.parseIntToString(element.timer_id,2),
          sceneId: this.parseIntToString(element.scene_id,2),  
        };
        arr.push(param);   
      })
    
      if(arr.length>0){
          let count =0
          let downTimer=	setInterval(() => {	
          let item =arr[count];
          if(count<arr.length){
           
            this.BleApi.delTimerByIdReq(item)
            setTimeout(() => {
            
              this.BleApi.delScene(item)          
            }, 500)
             
          }			 
             count ++;
          if(count>=arr.length){
           
            clearInterval(downTimer);
            return db.deleteData(TB_RULE, 'id=?', [Number(req.autoId)]).then((res) => {
              if (res.code === 200) {
                db.deleteData(TB_IF, 'rule_id=?', [Number(req.autoId)]);
                db.deleteData(TB_THEN, 'rule_id=?', [Number(req.autoId)]);
                resolve ({ack:res});
              }else{
                resolve ({ack:res})
              }            
            }); 
           }   
          }, 1000);		
        }else{
          return db.deleteData(TB_RULE, 'id=?', [Number(req.autoId)]).then((res) => {
            if (res.code === 200) {
              db.deleteData(TB_IF, 'rule_id=?', [Number(req.autoId)]);
              resolve ({ack:res});
            }else{
              resolve ({ack:res})
            }            
          }); 
        }
       } 
       else {
        resolve ({ack:res})
       }

     })

    })
  }

  /**
   * 7.6  获取Automation规则
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */
  getAutoRule(request) {
    const { autoId } = request.payload;
    const payload = {
      autoId: autoId,
      if: {
        valid: {},
        trigger: [],
      },
      then: [],
      ack: {
        code: 200,
        desc: 'success',
      },
    };

    return new Promise((resolve) => {
      this.getAutoRuleIf(request).then((res1) => {
        if (res1.code === 200) {
          res1.data.forEach((item) => {
            const properties = JSON.parse(item.properties);
            // if (item.type === RULE_TYPE.timer) {
            //   payload.if.valid = properties;
            // } else {
              payload.if.trigger.push(properties);
            // }
          });
          this.getAutoRuleThen(request).then((res) => {
            if (res.code === 200) {
              const arr = [];
              const { data } = res;
              data.forEach((element) => {
                const param = {
                  idx: element.idx,
                  thenType: element.type,
                  id: element.device_id,
                  attr: JSON.parse(element.properties),
                  timerId: element.timer_id,
                  sceneId: element.scene_id,
                };
                arr.push(param);
              });
              payload.then = arr;
            } else {
              payload.ack = {
                code: -1,
                desc: 'faile',
              };
            }

            resolve({
              payload,
              ack:payload.ack
            });
          });
        } else {
          payload.ack = {
            code: 0,
            desc: 'faile',
          };

          resolve({
            payload,
            ack:payload.ack
          });
        }
      });
    });
  }

  /**
   * 7.7  获取Auto规则 if
   * 
   */

  getAutoRuleIf(req) {
    return db.querySQL(`SELECT rule_id, properties, type FROM ${TB_IF} WHERE rule_id=${req.payload.autoId}`).then((res) => {
      const { code, data } = res;
      return {
        code,
        data,
      };
    });
  }
  /**
   * 7.8  获取Auto规则 then
   * 
   *
   */

  getAutoRuleThen(req) {
    return db.querySQL(`SELECT rule_id, properties, type, device_id, scene_id, timer_id FROM ${TB_THEN} WHERE rule_id=${req.payload.autoId}`).then((res) => {
      const { code, data } = res;
      return {
        code,
        data,
      };
    });
  }
/**
   * 7.9  添加Automation规则
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */

  // addAutoRule(options) {
  //   console.log('add auto rule --------------------', options);
  //   const { payload } = options;
  //   const { bledata } = seldev;
  //   const { autoId} = payload;
  //   const requestQue = [];
  //   payload.if.trigger.forEach((item) => {
  //     requestQue.push(this.addAutoRuleIf({
  //       rule_id: autoId,
  //       type: item.trigType,
  //       properties: JSON.stringify(item.attr),
  //       // enable: payload.enable,
  //       // delay: payload.delay,
  //     }));
  //   });
  //   payload.then.forEach((item) => {
  //     requestQue.push(this.addAutoRuleThen({
  //       rule_id: autoId,
  //       type: item.devType,
  //       properties: JSON.stringify(item.attr),
  //       device_id:payload.devId,
  //       timer_id:item.timerId,
  //       scene_id:item.sceneId
  //       // enable: payload.enable,
  //       // delay: payload.delay,
  //     }));
  //   });

  //   return Promise.all(requestQue).then(() => ({
  //     ack: {
  //       code: 200,
  //     },
  //   }));
  // }
 addAutoRule(options) {
  

  if(options.payload.if.trigger[0].trigType =="timer"){

  return  this.addTimerRule(options)

  }else if(options.payload.if.trigger[0].trigType =="sunrise"||options.payload.if.trigger[0].trigType =="sunset"){

   return  this.addSunRule(options) 
  }
  
}

addTimerRule(options){

  const { payload } = options;
  const { Expand } = options;
  const { autoId } = payload;
  const { bleData } = Expand; // 选中的设备
  let that = this
  let comArray =[];
  let comThenArray =[];
  let scencs =bleData.filter(item=>{
  if(item.communicationMode&&item.communicationMode=='BLE')
  return item;
  })
  return new Promise((resolve)=>{
   scencs.map((item,index) => {
   this.BleApi.getNextSceneId({field:'scene_id',devId:item.devId}).then((sceneId)=>{
   this.BleApi.getNextTimertId({field:'timer_id',devId:item.devId}).then((timerId)=>{
  //  console.log('--------------------sceneId------------------------------')
  //  console.log(sceneId)
  //  console.log('---------------------timerId-----------------------------')
  //  console.log(timerId)
  //  console.log('---------------------????????????-----------------------------')
   let arr =this.setComData(item,sceneId,timerId,payload.if.trigger[0])
   comArray = comArray.concat(arr);
   comThenArray.push(arr[0]);
   if(index ==scencs.length-1){
    //  console.log('--------------------console.log(comArray)----------------')
    //   console.log(comArray)
      if(comArray.length>0){
        let count =0
        let downTimer=	setInterval(() => {	
        let item =comArray[count];
        if(count<comArray.length){
          if(item.type ==='Scenc'){
            this.BleApi.addScene(item)
           }else if(item.type ==='timer'){
             this.BleApi.addTimer(item)
          }
         }			 
         count ++;
        if(count>=comArray.length){
          clearInterval(downTimer);
          this.saveToDB(comThenArray,payload).then((req)=>{
           resolve (req)
          });
         }
       }, 500);		
      }
     }
   })
  })
 })})
}

 //指令拼接
	setComData(item,sceneId,timerId,timerData){    
    // console.log('------------------setComData-------------')
    // console.log(item)
		sceneId =this.parseIntToString(sceneId,2);
		timerId =this.parseIntToString(timerId,2);
		// console.log(timerId)
		// console.log(sceneId)
		// console.log(item)
		let that = this
		let type =item.attr.RGBW ?'00' :'01'
		let dim ='00';
		if(item.attr.Dimming && item.attr.OnOff==true){
		  //  console.log('---------------Dimming-----------------')
		   if(item.devType.indexOf('plug')>-1){// plug 设置亮度100 为开
			   dim ='64'
		   }else
		   dim =this.parseIntToString(item.attr.Dimming,2);  
		  //  console.log(dim)		   
		}
		let cct ='00';
		if(item.attr.CCT && item.attr.OnOff==true){
			// console.log('cctcctcctcctcctcctcctcctcctcct')
			cct =this.parseIntToString(item.attr.CCT,2);  
		}
		let r ='00';
		let g ='00';
		let b ='00';
		if(item.attr.RGBW && item.attr.OnOff==true){
		  // console.log('----------------------------rgbw ------------------------------')	
		  let col =  helper.int2Rgb(item.attr.RGBW);
		   r =col.substring(1,3);
		   g =col.substring(3,5);
		   b =col.substring(5,7);
		  // console.log(col)
		  // console.log(r)
		  // console.log(g)
		  // console.log(b)
		}
		let ScencCom = {
			"devId":that.parseIntToString(item.devId ,2)+'00',//0000
			"itemId":item.devId,
			"sceneId":sceneId ,
			"param":`${dim}${cct}${r}${g}${b}${type}`,
			"type":'Scenc',
      "timerId" :timerId,// 存数据库用
      "devType" :item.devType// 存数据库用
    }
		// let timerData = this.state.data.if.trigger[0];
		let at =timerData.at;
		let Hm =at.split(':');
		let repeat =timerData.repeat;
		let week =[0,0,0,0,0,0,0,0] //0111 1011
		repeat.map((item ,index)=>{
			week.splice(7-item,1,1)
		})
		let weekStr =week.join();
		weekStr=weekStr.replace(/,/g,'')
		weekStr= parseInt(weekStr,2).toString(16)
		let h = that.parseIntToString(Hm[0] ,2)
		let m = that.parseIntToString(Hm[1] ,2)
		let TimerCom = {
			"devId":that.parseIntToString(item.devId ,2)+'00',//0000
			"itemId":item.devId,
			"param":`${timerId}9200${weekStr}${h}${m}00${sceneId}`,
			"type":'timer',
			"isTimerModify":item.timerId&&item.timerId.length ? 1:0
		 }
		 return [ScencCom ,TimerCom];
   }
  saveToDB(comThenArray,payload){
    // console.log('--------------------------add saveToDB -----------------------------------')
    // console.log(comThenArray,payload)
	  let curdata = payload
    const reqQue = [];
		const  paramIf={
		  properties: JSON.stringify(curdata.if.trigger[0]),
	  	rule_id :payload.autoId,
			type :curdata.if.trigger[0].trigType,
		}
    reqQue.push(this.addAutoRuleIf(paramIf))
    reqQue.push(curdata.then.map((item,index)=>{
		 let timerId =1;
     let sceneId =1;
     let devType ='dev';
		for (let index = 0; index < comThenArray.length; index++) {
			 const element = comThenArray[index];
		  if(item.id ==element.itemId){
				   timerId =parseInt(element.timerId,16)
           sceneId =parseInt(element.sceneId,16)
           devType =element.devType

          //  console.log('--------------------------add  send  break-----------------------------------')
				   break;
				  }		   
			 }
    const  paramThen={
			properties: JSON.stringify(item.attr),
			device_id :item.id,
			device_type :devType,
			rule_id :payload.autoId,
			timer_id:timerId,
			scene_id:sceneId
    }		
    // console.log('--------------------------add saveToDB send-----------------------------------')
    // console.log(paramThen)
   this.addAutoRuleThen(paramThen).then((res)=>{
		if(res.code !=200){
						Toast.info('thenDBfaile');
			 }
		 });
		}))					 
   return Promise.all(reqQue).then(() => ({
        ack: {
          code: 200,
        },
    }));	
  }
  addSunRule(options){
  const { payload } = options;
  const { Expand } = options;
  const { autoId } = payload;
  const { bleData } = Expand; // 选中的设备
  let that = this
  let comArray =[];
  let comThenArray =[];
  let scencs =bleData.filter(item=>{
  if(item.communicationMode&&item.communicationMode=='BLE')
  return item;
  })
  return new Promise((resolve)=>{
   scencs.map((item,index) => {

   let arr =this.setSunComData(item,payload.if.trigger[0])
   comArray = comArray.concat(arr);
   comThenArray.push(arr[0]);
   if(index ==scencs.length-1){
    //  console.log('--------------------console.log(comArray)----------------')
    //   console.log(comArray)
      if(comArray.length>0){
        let count =0
        let downTimer=	setInterval(() => {	
        let item =comArray[count];
        if(count<comArray.length){
          if(item.type ==='localtion'){
            this.BleApi.setLocation(item)
           
          }else if(item.type ==='onOff'){

             if(item.trigType==='sunrise'){

              this.BleApi.setSunriseOnOff(item)
             }else

              this.BleApi.setSunsetOnOff(item)
             }
         }			 
         count ++;
        if(count>=comArray.length){
          clearInterval(downTimer);
          this.saveToDB(comThenArray,payload).then((req)=>{
           resolve (req)
          });
         }
       }, 500);		
      }
     }
   
 })})
}

setSunComData(item,triger){
  // console.log('--------------------------------setSunComData ---------------__________________--&&&')
  // console.log(item,triger)
// 东经+ 西经 -   南纬- 北纬 +  00 0000 00 0000 00 00 东经 
// [11]: 0x03 表示设置经度、纬度、时区
// [12]:区分东西经，0x00代表东经， 0x01代表 西经
// [13]: 度， 0x0a 表示10度
// [14]: 分， 0x1b 表示 27 分
// [15]:区分南北纬 ，0x00代表南纬， 0x0 1代表 北纬 [16]: 度数 0x30 表示48度
// [17]: 分， 0x2c 表示 44 分
// [18]:区分东西时区，0x00代表东时区 +， 0x01代表 西时区 -
// [19]: 0x02 表示 二区
  let  EW =triger.longitude >0 ?'00' :'01' //
  let  EWDegrees = this.parseIntToString(parseInt(triger.longitude.split('.')[0]),2);
  let  EWMin = this.parseIntToString(parseInt(parseFloat('0.'+triger.longitude.split('.')[1]) * 60) ,2);
  
  let  NS =triger.latitude >0 ?'00' :'01' // 
  let  NSDegrees = this.parseIntToString(parseInt(triger.latitude.split('.')[0]),2);
  let  NSMin = this.parseIntToString(parseInt(parseFloat('0.'+triger.latitude.split('.')[1]) * 60),2);
  
  let GMT =triger.timeZone.substring(3).indexOf('+')>-1 ? '00' :'01'
  let GMTV = this.parseIntToString(parseInt(triger.timeZone.substring(4)),2);
  

  let localtionCom = {
    "devId":item.devId,
    "itemId":item.devId,
    "param":`${EW}${EWDegrees}${EWMin}${NS}${NSDegrees}${NSMin}${GMT}${GMTV}`,
    "type":'localtion',
    "devType" :item.devType,// 存数据库用
    "timerId" : '00',
    "sceneId" : '00'
  }
  // [12]: 使能位，0x00 disable; 0x01 enable 
  // [13]: on/off位 0x00 代表off 0x01 代表ON
  // [14]: 0x00 表示 before； 0x01 表示 after
  // [15]: 时 ， 0x02 表示 2时
  // [16]: 分 ， 0x0c 表示 1
  let onOffStatus = this.parseIntToString(item.attr.OnOff ,2);
  let delayType = '00';
  let delayHour = '00';
  let delayMinute = '00';
  if(triger.intervalType == 0){
    delayHour = '00';
    delayMinute = '00';
  }else{
    delayType = this.parseIntToString(triger.intervalType-1,2);
    delayHour = this.parseIntToString(parseInt(triger.intervalTime/3600),2);
    delayMinute = this.parseIntToString(parseInt((triger.intervalTime%3600)/60),2);
  }

  let onOffCom = {
    "devId":item.devId,//0000
    "itemId":item.devId,
    "param":`01` + onOffStatus + delayType + delayHour + delayMinute,
    "type":'onOff',
    "trigType" :triger.trigType,
    "devType" :item.devType// 存数据库用
  }
  return [localtionCom ,onOffCom];

}


  /**
   * 7.10  添加Automation规则if
   * @param {String} options.autoId Automation ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */
  addAutoRuleIf(data) {
    const {
      properties, rule_id, type,
    } = data;
    return db.insert(TB_IF, {
      properties,
      rule_id,
      type,
    });
  }

  /**
   * 7.11  添加Automation规则Then
   * @param {String} options.autoId Automation ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */
  addAutoRuleThen(data) {
    const { properties, device_id, rule_id, device_type, timer_id, scene_id } = data;
    return db.insert(TB_THEN, {
      properties,
      device_id,
      rule_id,
      device_type,
      timer_id,
      scene_id
    });

  }
  /**
   * 7.12  编辑if
   * @param {String} options.autoId Automation ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */

  editAutoRuleIf(options){
    const { rule_id } = options;
    const requestQue = [];
    requestQue.push(
      db.deleteData(TB_IF, 'rule_id=?', [Number(rule_id)]),
      this.addAutoRuleIf(options),
    );

    return Promise.all(requestQue).then(() => ({
      ack: {
        code: 200,
      },
    }));

  }

  /**
   * 7.13  编辑then
   * @param {String} options.autoId Automation ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */
  editAutoRuleThen(options){
    const { rule_id,device_id } = options;
    
    const requestQue = [];
    requestQue.push(
      db.deleteData(TB_THEN, 'rule_id=? and device_id=?', [Number(rule_id),Number(device_id)]),
      this.addAutoRuleThen(options),
    );

    return Promise.all(requestQue).then(() => ({
      ack: {
        code: 200,
      },
    }));

  }
  /**
   * 7.14  删除then
   * @param {String} options.autoId Automation ID
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */
  delAutoRuleThen(options){
    const { rule_id,device_id } = options;
    
    const requestQue = [];
    requestQue.push(
      db.deleteData(TB_THEN, 'rule_id=? and device_id=?', [Number(rule_id),Number(device_id)]),
    );

    return Promise.all(requestQue).then(() => ({
      ack: {
        code: 200,
      },
    }));

  }

  /**
   * 7.15 编辑Automation规则
   * @param {String} options.autoId Automation ID
   * @param {Object} options.payload 消息体
   * 
   * @return {Promise}
   */
  // editAutoRule(options){
  //   const payload = options.payload || {};
  //   const { autoId } = payload;
  //   const requestQue = [];
  //   requestQue.push(
  //     db.deleteData(TB_IF, 'rule_id=?', [Number(autoId)]),
  //     db.deleteData(TB_THEN, 'rule=?', [Number(autoId)]),
  //     this.addAutoRule(options),
  //   );

  //   return Promise.all(requestQue).then(() => ({
  //     ack: {
  //       code: 200,
  //     },
  //   }));
  // }	
   editAutoRule(options){

     const payload = options.payload || {};
     const { autoId } = payload;
     const { Expand } = options;
     const { bleData } = Expand; // 选中的设备
    //  console.log('-------------------------editAutoRule-------------------------------')
    //  console.log(bleData)
     let that = this
     let comArray =[];
     let comThenArray =[];
     let scencs = bleData.filter(item=>{
     if(item.communicationMode&&item.communicationMode=='BLE')
      return item;
     }) 
    
    return new Promise((resolve)=>{ 
     this.getAutoRuleThen({
       payload:{autoId:autoId}
     }).then((res)=>{
     if (res.code === 200) {
     const arr = [];
     const { data } = res;
  //删除设备
     data.forEach((item) => {
      let flag =true
      for (let index = 0; index < scencs.length; index++) {
        const element = scencs[index];
      if(element.devId==item.device_id){
       flag =false
       break		
      }	
     }
     if(flag==true){
        // console.log('-------------------------------删除多余设备--------------------------')
        const param = {
        devId: this.parseIntToString(item.device_id,2)+'00',
        timerId: this.parseIntToString(item.timer_id,2),
        sceneId: this.parseIntToString(item.scene_id,2),
        rule_id: item.rule_id,
        device_id: item.device_id,
        };
        // console.log(param)
        this.BleApi.delTimerByIdReq(param)	
        this.BleApi.delScene(param)
        this.delAutoRuleThen(param)   		  
       }
     });  
    }
   })
    scencs.map((item,index) => {
    // console.log('rtrtrtrttrtrtrt')
    // console.log(item)
    let that=this
    let sceneId =''
    let timerId =''
    if(item.sceneId&&item.sceneId.length>0){
      sceneId =item.sceneId
      timerId =item.timerId

      let arr =that.setComData(item,sceneId,timerId,payload.if.trigger[0])
      comArray = comArray.concat(arr);
      comThenArray.push(arr[0]);
      if(index == scencs.length-1){
      if(comArray.length>0){
      // console.log('------------------comArray-------------')
      // console.log(comArray)
      that.sendComData(comArray,comThenArray,payload).then((res)=>{
        // console.log('-------------------------------编辑完成--------------------------')
        // console.log(res)
        resolve ( {ack: {code: 200}}) 

     });    
      }    
      } 
     }
    else{
      this.BleApi.getNextSceneId({field:'scene_id',devId:item.devId}).then((sceneId)=>{
        this.BleApi.getNextTimertId({field:'timer_id',devId:item.devId}).then((timerId)=>{
         let arr =that.setComData(item,sceneId,timerId,payload.if.trigger[0])
          comArray = comArray.concat(arr);
           comThenArray.push(arr[0]);
           if(index == scencs.length-1){
            if(comArray.length>0){
              that.sendComData(comArray,comThenArray,payload).then((res)=>{
              // console.log('-------------------------------编辑完成--------------------------')
              resolve ( {ack: {code: 200}}) 
            })		
           }
          }
        })
      })
     }	
   })
 
 })



 }
 sendComData(comArray,comThenArray,payload){
  
  let that =this;
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


  let count =0
  let downTimer=	setInterval(() => {	
  let item =comArray[count];
    if(count<comArray.length){
     if(item.type ==='Scenc'){	
      that.BleApi.addScene(item)
      }else if(item.type ==='timer'){
       if(item.isTimerModify ==1){	
        that.BleApi.chgTimerByIdReq(item)	
       }else	
       that.BleApi.addTimer(item)
     }
    }			 
     count ++;
   if(count>=comArray.length){
    clearInterval(downTimer);
    that.saveEditToDB(comThenArray,payload).then((res)=>{
      //cb =res;   
      // console.log(res)  
      // console.log('---------------------------------------fakePromise -----------------------------------')  
      fakePromise.resolve(res);
    });
   }
  }, 500);	
  
  return fakePromise
 }

 saveEditToDB(comThenArray,payload){
  const reqQue = [];
  // console.log('-----------------DB---comThenArray-------------------------')
  // console.log(comThenArray,payload);
  reqQue.push(this.editAutoRuleIf({
    properties: JSON.stringify(payload.if.trigger[0]),
    rule_id :payload.autoId,
    type :payload.if.trigger[0].trigType,

  }));
  reqQue.push(payload.then.forEach((item,index) => {
    let timerId =1;
    let sceneId =1;
    let devType ='dev';
    // console.log('---------------------000000--------------')
    // console.log(comThenArray)
    for (let index = 0; index < comThenArray.length; index++) {
    const element = comThenArray[index];
    if(item.id ==element.itemId){
      timerId =parseInt(element.timerId,16)
      sceneId =parseInt(element.sceneId,16)
     devType =element.devType
     break;
     }		   
    }
    const  paramThen={
    properties: JSON.stringify(item.attr),
    device_id :item.id,
    device_type :devType,  
    timer_id:timerId,
    scene_id:sceneId,
    rule_id :payload.autoId,
    }
    //  console.log('-----------------DB---editAutoRuleThen-------------------------')
    //  console.log(paramThen);
    this.editAutoRuleThen(paramThen)
  }));

    return  Promise.all(reqQue).then(()=>{
    // console.log('-----------------end---edit AutoRule DB-------------------------')
    ack: {code: 200}

    })
}



























  /**
   * 7.16 设置Automation使能（开关）
   * @param {String} options.autoId Automation ID
   * @param {String} options.enable 开关
   * @param {Object} options.payload 消息体
   * @return {Promise}
   */
  setAutoEnable(options) {
    const req = options.payload || {};
    const { autoId, enable } = req;
    return  this.getAutoRuleThen({payload:{autoId:req.autoId}}).then((res)=>{
      if (res.code === 200) {
      const arr = [];
      const { data } = res;

      data.forEach((element) => {
        const param = {
          devId: this.parseIntToString(element.device_id,2)+'00',
          timerId: this.parseIntToString(element.timer_id,2), 
        };
      if(req.enable){
        this.BleApi.enTimerByIdReq(param);
        }else{
         this.BleApi.disTimerByIdReq(param);
        }
      });
      return  db.update(
        TB_RULE,
        {
          status: enable ? 1 : 0,
        },
        'id=?',
        [autoId],
       );
    
       } else {

        return res
        console.log('timer ---null')
       }

     })
  }

  parseIntToString(options,length){
    let srtHex =parseInt(options).toString(16);
    return (Array(length).join(0) + srtHex).slice(-length);
   }
}




