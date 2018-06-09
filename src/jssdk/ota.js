import Cookies from 'universal-cookie'
import JSBridge from './JSBridge'
import MQTTService, { TOPIC } from './MQTTService'
import UDPService from './UDPService'
import http from '../jssdk/Http'
import config from '../config'
import BLEService from './BLEService'
import Device from './device';

// 'http://172.16.55.119:8090/space'
const homeURL = `${config.httpServer}`

const cookies = new Cookies()
const DEVICE_SERVICE = 'device'
const IPC_SERVICE = 'IPC'
const OTA_SERVICE = 'ota'

let instance = null
export default class OTA {
  constructor () {
    if (instance) {
      return instance
    }

    this.jsBridge = JSBridge
    this.mqttService = MQTTService
    this.udpService = UDPService
    this.BLEService = BLEService;
    this.deviceApi = new Device();
    instance = this
  }

	/**
	 * 9.5	获取版本列表请求
	 * @param {Array} options.payload.devId 设备ID列表
	 * @param {String} options.payload.productId 产品ID
	 * @param {String} options.payload.devType 设备类型
	 * @param {String} options.payload.homeId 家ID
	 * @param {String} options.payload.homeId 家ID
	 * @return {Promise}
	 */
  fetchVersionList (options) {
  	console.log("fetchversion options=",options)
    //ble 设备调用不同的接口查询数据，在这里构造与多协议设备相同的返回数据
    if(options.device && options.device.communicationMode == "BLE"){
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

      let oldVersion = options.device.firmwareVersion;
      oldVersion = oldVersion.replace(/V/, "");
      oldVersion = oldVersion.replace(/v/, "");
      oldVersion = parseFloat(oldVersion);

      let that = this;
      let data = {
                   productId: options.device.firmwareProductId
                 };

      let timer = setTimeout(function () {
        clearTimeout(timer);
        fakePromise.resolve({
          payload:{
            verList: [{
              devId: options.device.devId,
              stage: 0,
              percent: 0,
              oldVersion: oldVersion,
              newVersion: oldVersion,
              fwType: 0
            }]
          }
        })
      }, 2000);

      http.get({
        url: `${homeURL}/device/getDevVersion`,
        data
      }).then(res=>{
        clearTimeout(timer);
        console.log("获取设备版本回调",res);
        if(res.code == 200){
          fakePromise.resolve({
                    payload:{
                      verList: [{
                        devId: options.device.devId,
                        stage: 0,
                        percent: 0,
                        oldVersion: oldVersion,
                        newVersion: parseFloat(res.data.version),
                        fwType: 0
                      }]
                    }
                  });
        }else{
          fakePromise.resolve({
                    payload:{
                      verList: [{
                        devId: options.device.devId,
                        stage: 0,
                        percent: 0,
                        oldVersion: oldVersion,
                        newVersion: oldVersion,
                        fwType: 0
                      }]
                    }
                  });
        }
      });

      return fakePromise;

    }else{
      return this.mqttService.sendData({
        service: OTA_SERVICE,
        method: 'getVerListReq',
        topic: `${TOPIC.serverV1}/${options.userId}/${OTA_SERVICE}/getVerListReq`,
        payload: options.payload || {}
      })
    }
  }

	/**
	 * 9.7	执行OTA请求
	 * @param {Array} options.payload.devId 设备ID列表
	 * @return {Promise}
	 */
  updateDevice (options) {
    if(options.device && options.device.communicationMode == "BLE"){

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

      let data = {
        productId: options.device.firmwareProductId.toString(),
        version: ""//options.newVersion.toString()
      }
      let that = this;
      http.post({
        url: `${homeURL}/device/getDevOtaUrl`,
        data
      }).then(res=>{

        if(res.code == 200 && res.data.url){
          that.BLEService.startOta({
            downloadURL:res.data.url,
            devAddress: options.device.devId
          });

          that.BLEService.onConnectionDevFirmWare(res=>{
              BLEService.offConnectionDevFirmWare();

              if(res && res.firmwareVersion && res.deviceItem.u_DevAdress){
                that.deviceApi.editDeviceWithAddress({
                  keyVals:{
                    version:res.firmwareVersion
                  },
                  address:res.deviceItem.u_DevAdress
                });
              }
          });


        }

        fakePromise.resolve(res);

      });

      return fakePromise;

    }else{
      return this.mqttService.sendData({
        service: OTA_SERVICE,
        method: 'excOtaReq',
        topic: `${TOPIC.serverV1}/${options.userId}/${OTA_SERVICE}/excOtaReq`,
        payload: options.payload || {}
      })
    }
  }
  
  
}