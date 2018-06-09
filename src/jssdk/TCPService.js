import helper from '../public/helper';
import TCPBasic from './TCPBasic';
import Cookies from 'universal-cookie';
import Device from '../jssdk/device';
const cookies = new Cookies();
const device = new Device();
class TCPService extends TCPBasic {
  constructor() {
    super();
    this.hasSearchedGateway = false;
    this.gatewayId = '';
    this.password = '';
    this.reconnectNum = 0;
  }

  
  connectTCP(connectGatewayId,password) {
    this.gatewayId = connectGatewayId;
    this.password = password;
    this.startConnectDevice();
   
  }
  reconnectTCP(){
    if (this.gatewayId&&this.password) {
      this.reconnectNum++;
      if (this.reconnectNum < 2) {
        this.startConnectDevice();
      }
      
    }
  }
   
  startConnectDevice(){
    let searchTime = 0;

    if(this.isConnecting || this.isConnected) {
      return;
    }

    this.isConnecting = true;
    // const timer = setInterval(() => {
    //   searchTime++;
    //   if (searchTime > 3) {
    //     clearInterval(timer);
    //     this.isConnecting = false;
    //     return;
    //   }
      device.devDiscoveryReq({
        ip: "255.255.255.255",
        port: "6666",
        payload: {
          timestamp: helper.dateFormat(new Date, 'yyyy-dd-mm hh:MM:ss'),
        },
        retryTimes: 3
      }).then(res => {
        const { payload } = res;
        if ( typeof(res) !== 'object') {
          return;
        }
        const gateway = [{
          name: res.payload.mac,
          devId: res.payload.devId,
          model: res.payload.model,
          ip: res.payload.ip
        }];
      
        console.log('=========== gateway response', payload.devId, this.gatewayId);

        if(payload.devId === this.gatewayId) {
           this.hasSearchedGateway = true,
          // clearInterval(timer);
          console.log('=========== start connect tcp');
          this.connect(payload.ip, '10000');
          this.onStatusChange(status => {
            if(Number(status) === 1) {
                this.reconnectNum = 0;
                this.send({
                  "service":"device",
                  "method":"loginReq",
                  "seq": (new Date().getTime() + '').substr(4, 9),
                  "srcAddr": cookies.get('userId'),
                  "payload":{
                    "userId": cookies.get('userId'),
                    "password": this.password,
                    "timestamp": helper.dateFormat(new Date, 'yyyy-dd-mm hh:MM:ss')
                  } 
                }).then(res=>{
                  console.log('--=========loginReqRes', res);
                  this.isConnecting = false;
                  this.isLogined = true;
                });
            }
          });
        }
      });
    //  }, 1000 * 10);
    
  }
}

export default  TCPService;