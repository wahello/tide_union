import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import Device from '../jssdk/device';
import BarTitle from '../component/barTitle';
import { showDialog } from '../action';
import { Lang } from '../public/resource';
import SystemApi from '../jssdk/system';
import ScrollView from '../component/scrollView';
import './default/style.css';
import './default/searchStyle.css';
import SearchComponent from './component/SearchComponent';
import BLEService from '../jssdk/BLEService';
import config from '../config';
import { saveDeviceItem, setEditingName, shouldUpdateDeviceList } from '../action/device';
class SearchBLEDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      searching: false,
      error: false,
      newDeviceList: []
      
    };
    this.handleClickBack = this.handleClickBack.bind(this);
    this.device = new Device();
    this.cookies = new Cookies();
    this.handleClickToSet = this.handleClickToSet.bind(this);
    this.startSearchDevices = this.startSearchDevices.bind(this);
    this.handleClickToTest = this.handleClickToTest.bind(this);
    this.tryAgain = this.tryAgain.bind(this);
    this.BLEService = BLEService;

    this.address = 1;
    this.isSetMesh = 0;
    this.blackItemAddress = '';
    this.scanCount = 0;
    this.timer = '';
    this.setMeshAddress = '';
    this.nextRemoteGroupId = '0';
  }

  componentDidMount() {
    this.startSearchDevices();

    
  }

  handleClickToTest(){
      const { currentId, familyItems } = this.props;

      this.device.stopScan();
      this.device.startConnect({
        meshName: familyItems[currentId].currentMeshName,
        meshPassword: familyItems[currentId].currentMeshPassword
      });

      setTimeout(() => {
        this.device.turnOff({devId:'ffff'});//全关
      }, 500);

      setTimeout(() => {
        this.device.turnOn({devId:'ffff'});//全开
      }, 3500);

  }

  getDeviceIcon(devType) {
    const { searchType, } = this.props;
    let key = searchType.toLowerCase();

    if (devType) {
      key = devType.toLowerCase();
    }

    const iconObj = {
      lighting: 'lighting',
      light_colortemperature: 'lighting',
      light_colourtemperature: 'lighting',
      light_dimmable: 'lighting',
      light_rgbw: 'lighting',

      sensor: 'door_lock',
      sensor_doorlock: 'door_lock',

      sensor_pir: 'motion',
      sensor_motion: 'motion',
      motion: 'motion',

      siren: 'siren',
      alarm_siren: 'siren',

      gateway: 'gateway',
      multi_gateway: 'gateway',
      smartplug_meter: 'plug4',
      remote: 'remote',
    };

    if (iconObj[key] === undefined) {
      return 'default';
    }

    return iconObj[key];
  }

  getDeviceAttrWithType(typeValue){
    let devAttr = {
      typeStr:'Light_Dimmable',
      defaultName:'light-',
      searchType:'BLELighting'
    };

    if(typeValue == 1 || 
      typeValue == 4 || 
      typeValue == 5 || 
      typeValue == 17 || 
      typeValue == 33 || 
      typeValue == 49 ||
      typeValue == 65 ||
      typeValue == 81 ||
      typeValue == 97 ||
      typeValue == 129 ||
      typeValue == 145 ||
      typeValue == 151
    ){

      devAttr.typeStr = 'Light_Dimmable';
      devAttr.searchType = "BLELighting";
    }
    
    if(typeValue == 2 || 
      typeValue == 18 || 
      typeValue == 50 || 
      typeValue == 178 || 
      typeValue == 66 ||
      typeValue == 82 ||
      typeValue == 98 ||
      typeValue == 100 ||
      typeValue == 210){
      devAttr.typeStr = 'Light_ColorTemperature';
      devAttr.searchType = "BLELighting";
    }
      if(
      typeValue == 241 ||
      typeValue == 243 ||
      typeValue == 242){
      devAttr.typeStr = 'remote';
      devAttr.searchType = "BLERemote";
    }
    if(typeValue == 3 || 
      typeValue == 19 || 
      typeValue == 67 || 
      typeValue == 99 || 
      typeValue == 150 ||
      typeValue == 195 ||
      typeValue == 152||
    	typeValue == 194){
      devAttr.typeStr = 'Light_RGBW';
      devAttr.searchType = "BLELighting";
    }
    if(typeValue == 160 || 
      typeValue == 161){
      devAttr.typeStr = 'Smartplug_Meter';
      devAttr.searchType = "BLEPlug";
    }
    
    if(typeValue == 1){
      devAttr.defaultName = 'A60-DIM-';
    }else if(typeValue == 2){
      devAttr.defaultName = 'A60-CCT-';
    }else if(typeValue == 3){
      devAttr.defaultName = 'A60-RGBW-';
    }else if(typeValue == 4){
      devAttr.defaultName = 'A60-Sunset-';
    }else if(typeValue == 5){
      devAttr.defaultName = 'A60-CirRhy-';
    }else if(typeValue == 17){
      devAttr.defaultName = 'BR30-DIM-';
    }else if(typeValue == 18){
      devAttr.defaultName = 'BR30-CCT-';
    }else if(typeValue == 19){
      devAttr.defaultName = 'BR30-RGBW-';
    }else if(typeValue == 33){
      devAttr.defaultName = 'PAR30-DIM-';
    }else if(typeValue == 49){
      devAttr.defaultName = 'Gu10-DIM-';
    }else if(typeValue == 50){
      devAttr.defaultName = 'Gu10-CCT-';
    }else if(typeValue == 178){
      devAttr.defaultName = 'Gu10-CCT-';
    }else if(typeValue == 51){
      devAttr.defaultName = 'Gu10-Sunset-';
    }else if(typeValue == 65){
      devAttr.defaultName = 'DL-DIM-';
    }else if(typeValue == 66){
      devAttr.defaultName = 'DL-CCT-';
    }else if(typeValue == 67){
      devAttr.defaultName = 'DL-RGBW-';
    }else if(typeValue == 81){
      devAttr.defaultName = 'Panel-DIM-';
    }else if(typeValue == 82){
      devAttr.defaultName = 'Panel-CCT-';
    }else if(typeValue == 97){
      devAttr.defaultName = 'Ceiling-DIM-';
    }else if(typeValue == 98){
      devAttr.defaultName = 'Ceiling-CCT-';
    }else if(typeValue == 99){
      devAttr.defaultName = 'Ceiling-RGBW-';
    }else if(typeValue == 100){
      devAttr.defaultName = 'Child-Ceil-CCT-';
    }else if(typeValue == 119){
      devAttr.defaultName = 'MagicBox-ONOFF-';
    }else if(typeValue == 120){
      devAttr.defaultName = 'MagicBox-1to10-';
    }else if(typeValue == 121){
      devAttr.defaultName = 'MagicBox-Triae-';
    }else if(typeValue == 129){
      devAttr.defaultName = 'Dimmer-DIM-';
    }else if(typeValue == 145){
      devAttr.defaultName = 'SpeakerBulb-DIM-';
    }else if(typeValue == 150){
      devAttr.defaultName = 'SpeakerBulb-RGB-';
    }else if(typeValue == 151){
      devAttr.defaultName = 'A60-Speaker-DIM-';
    }else if(typeValue == 152){
      devAttr.defaultName = 'BLE-MUSIC-RGBW-';
    }else if(typeValue == 160){
      devAttr.defaultName = 'Plug-';
    }else if(typeValue == 161){
      devAttr.defaultName = 'Plug-';
    }else if(typeValue == 241){
      devAttr.defaultName = 'Remote-CCT-';
    }else if(typeValue == 242){
      devAttr.defaultName = 'Remote-RGBW-';
    }else if(typeValue == 243){
      devAttr.defaultName = 'Remote-CCT-';
    }else if(typeValue == 192){
      devAttr.defaultName = 'LD-RGBW-BT-';
    }else if(typeValue == 193){
      devAttr.defaultName = 'HB-COLOR-';
    }else if(typeValue == 194){
      devAttr.defaultName = 'KEM-BLELIGHT-';
    }else if(typeValue == 195){
      devAttr.defaultName = 'XLJ-D-';
    }else if(typeValue == 196){
      devAttr.defaultName = 'MCL-';
    }else if(typeValue == 197){
      devAttr.defaultName = 'LA-HB-';
    }else if(typeValue == 210){
      devAttr.defaultName = 'Power-CCT-';
    }

    return devAttr;
  }
  
  /**
   * 获取添加的设备的新地址(已加入的所有设备地址取最大值 +1，如果已经大于255，就从头再取没有使用的过地址)
   * 待实现
   */
  getNewAddress(){
    //this.address += 1;
    return this.address;
  }

  tryAgain() {
    /*this.startSearchDevices();
    this.setState({
      searching: true,
      error: false,
    });*/
    if(this.props.searchType == "BLELighting"){
      this.props.history.replace('/device/BLEDeviceAdd');
    }else if(this.props.searchType == "BLEPlug"){
      this.props.history.replace('/device/plugAdd1/BLEplug');
    }else if(this.props.searchType == "BLERemote"){
      this.props.history.replace('/device/remoteAdd1');
    }else{
      this.props.history.replace('/device/addFlow');
    }
    
  }

  handleClickBack() {
    const { actions } = this.props;
    this.stopSearching();

    this.setState({
      refreshing: false,
      searching: false,
    });
    clearTimeout(this.timer);
    this.device.removeRepeatDevice();
    actions.shouldUpdateDeviceList();//刷新数据

    this.props.history.replace('/home');

  }

  delDevForUnselect(devIds) {
    if (!devIds.length) {
      return;
    }
    
  }

  refreshNextRemoteGroupID(){
    let that = this;
    this.device.getNextRemoteGroupID().then(res=>{
      that.nextRemoteGroupId = res;
    });
  }

  startSearchDevices() {
    if (this.state.searching) {
      return;
    }
    this.setState({
      init: false,
      refreshing: false,
      searching: true,
    });
    this.isSetMesh = 0;
    let that = this;

    this.refreshNextRemoteGroupID();
			console.log("wcb 如果log到这里进行不下去，开关蓝牙试一试 ");
    this.device.startScan().then(res => {
        console.log("搜索到一个设备", res);
        if (res === undefined) {
           return;
        }
    
        let response = null;
    
        if (res && typeof(res) === 'string') {
          response = JSON.parse(res)
        }else{
          response = res;
        }
    
        if (response === null ) {
          return;
        }
        console.log(response.deviceItem.name+"-"+response.deviceItem.u_DevAdress+" ，搜索到一个设备,flag:"+response.deviceChangeFlag+" ussetMesh"+that.isSetMesh);

        if(response.deviceChangeFlag == 'DevLogin' && that.isSetMesh == 0){
            const { currentId, familyItems, searchType } = that.props;

            if(that.blackItemAddress != ''){
                if(that.blackItemAddress == response.deviceItem.u_DevAdress){
                    that.scanCount++;
                }else{
                    that.blackItemAddress = response.deviceItem.u_DevAdress;
                    that.scanCount = 1;
                }
                console.log("扫描到设备："+ response.deviceItem.u_DevAdress+ ",设备类型:" +response.deviceItem.productUUID + ",次数："+that.scanCount);
                if(that.scanCount > 3){
                    console.log("跳过设备："+ response.deviceItem.u_DevAdress+",次数："+that.scanCount);
                    that.scanCount = 0;
                    that.blackItemAddress = '';
                    that.isSetMesh = 0;
                    that.device.scanAgain();
                    return;
                }
            }else{
                that.blackItemAddress = response.deviceItem.u_DevAdress;
                that.scanCount = 1;
                console.log("扫描到设备："+ response.deviceItem.u_DevAdress+",次数："+that.scanCount);
            }

            let deviceDefaultAttr = that.getDeviceAttrWithType(response.deviceItem.productUUID);
            if(deviceDefaultAttr.searchType != searchType){
              console.log("搜索到的设备类型不匹配，跳过");
              console.log("搜索到的设备：deviceDefaultAttr.searchType:",deviceDefaultAttr);
              console.log("要搜索设备：searchType:",searchType);
              that.isSetMesh = 0;
              that.device.scanAgain();
              return;
            }


            let oldMeshName = config.BLEServer.defaultMeshName;
            let oldMeshPassword = config.BLEServer.defaultMeshPassword;
            if(response.deviceItem.u_name == "BLE MESH"){
              oldMeshName = "BLE MESH";
              oldMeshPassword = "123"
            }

            that.isSetMesh = 1;// 标识正在设置网络，忽略再次搜索到的设备

            that.BLEService.onConnectionDevFirmWare(res=>{
                BLEService.offConnectionDevFirmWare();

                if(res && res.firmwareVersion && res.deviceItem.u_DevAdress){
                  that.device.editDeviceWithAddress({
                    keyVals:{
                      version:res.firmwareVersion
                    },
                    address:res.deviceItem.u_DevAdress
                  });
                }
            });

            that.BLEService.onConnectionDevFirmWareId(res=>{
                BLEService.offConnectionDevFirmWareId();
                that.isSetMesh = 0;
                that.device.scanAgain();
                
                if(res && res.firmwareId && res.deviceItem.u_DevAdress){
                  that.device.editDeviceWithAddress({
                    keyVals:{
                      firmware_product_id:res.firmwareId
                    },
                    address:res.deviceItem.u_DevAdress
                  });
                }
            });



            that.device.getNextAddress().then(res=>{
              if(res){
                let nextAddress = res;
                //若不是遥控器，则给设备分配一个没有用到的分组id
                /* let nextRemoteGroupID = -10086;
                //遥控器分配组id
                if(deviceDefaultAttr.typeStr == 'remote'){
                  console.log('搜索到遥控器');
                  that.device.getNextRemoteGroupID().then(res=>{

                     nextRemoteGroupID = res;
                    console.log('给遥控器分配组id：'+nextRemoteGroupID);
                    that.device.setRemoteGroupId({
                      nextRemoteGroupId:nextRemoteGroupID
                    });
								  });
                }*/
                    /*that.device.editDeviceWithAddress({
                      keyVals:{
                        remote_groud_id:nextRemoteGroupID
                      },
                      address:response.u_DevAdress
                    });*/

                  console.log("=========setNewAddress==========",{
                    oldAddress:  response.deviceItem.u_DevAdress,
                    newAddress: nextAddress,
                    oldMeshName: oldMeshName,
                    oldMeshPassword: oldMeshPassword,
                    newMeshName: familyItems[currentId].currentMeshName,
                    newMeshPassword: familyItems[currentId].currentMeshPassword
                });

	                that.device.setNewAddressAndMesh({
	                    oldAddress:  response.deviceItem.u_DevAdress,
	                    newAddress: nextAddress,
	                    oldMeshName: oldMeshName,
	                    oldMeshPassword: oldMeshPassword,
	                    newMeshName: familyItems[currentId].currentMeshName,
	                    newMeshPassword: familyItems[currentId].currentMeshPassword
	                }).then(res =>{
	
	                    
	
	                    //that.isSetMesh = 0;// 标识设置网络结束
	
	                    if (res === undefined) {
	                      return;
	                    }
	                
	                    let response = null;
	                
	                    if (res && typeof(res) === 'string') {
	                      response = JSON.parse(res)
	                    }else{
                        response = res;
                      }
	                
	                    if (response === null ) {
	                      return;
                      }
                      
                      
	
	                    console.log("判断是否重复"+that.setMeshAddress+"==="+response.u_DevAdress);
	                    if(that.setMeshAddress == response.u_DevAdress){
	                      console.log("重复进入配网回调："+response.u_DevAdress);
	                      return;
	                    }
	                    that.setMeshAddress = response.u_DevAdress;
	
	                    for(let devItem in that.state.newDeviceList){
	                        console.log("判断重复设备："+response.u_DevAdress+"==="+devItem.devId);
	                        if(response.u_DevAdress == devItem.devId){
	                            console.log(response.u_DevAdress+"-"+response.name+" 设备已添加");
	                            return;
	                        }
	                    }
	
	
                      let deviceDefaultAttr = that.getDeviceAttrWithType(response.productUUID);
                      
                      if(deviceDefaultAttr.typeStr == 'remote'){
                        that.device.setRemoteGroupId({
                          nextRemoteGroupId: that.nextRemoteGroupId
                        });
                      }

	                    console.log("获取设备默认名称及类型："+deviceDefaultAttr.typeStr);
	                    that.setState({newDeviceList: [...that.state.newDeviceList, {
	                        devId: response.u_DevAdress,
	                        name: deviceDefaultAttr.defaultName+response.u_DevAdress,
	                        devType: deviceDefaultAttr.typeStr,
	                        deviceSelect: false
	                    }]});
	
	                    that.device.addDevice({
	                      address: response.u_DevAdress,
	                      name: deviceDefaultAttr.defaultName+response.u_DevAdress,
	                      icon: that.getDeviceIcon(deviceDefaultAttr.typeStr),
	                      type: deviceDefaultAttr.typeStr,
	                      communicationMode: 'BLE',
	                      remote_groud_id: deviceDefaultAttr.typeStr == 'remote'?that.nextRemoteGroupId:'0'
	                    }).then(res=>{
	                    	console.log("addDevice22 querySQL : ",res);
	                      if(res.code != 200){
                          console.log('存库失败:'+deviceDefaultAttr.defaultName+response.u_DevAdress,);
                          
                          //二次发送
                          that.device.addDevice({
                            address: response.u_DevAdress,
                            name: deviceDefaultAttr.defaultName+response.u_DevAdress,
                            icon: that.getDeviceIcon(deviceDefaultAttr.typeStr),
                            type: deviceDefaultAttr.typeStr,
                            communicationMode: 'BLE',
                            remote_groud_id: deviceDefaultAttr.typeStr == 'remote'?that.nextRemoteGroupId:'0'
                          });
                          
	                      } else{
	                        console.log('存库成功：'+deviceDefaultAttr.defaultName+response.u_DevAdress,);
	
	                        console.log("判断类型："+deviceDefaultAttr.typeStr);
                          
                          that.nextRemoteGroupId = that.nextRemoteGroupId+1;
	
	                      }
	                    });
	
	                    //待处理 添加设备到数据库
	
	                    console.log(response.name+"-"+response.u_DevAdress+" ，设备添加成功");
	
	                    //that.isSetMesh = 0;
	                    //that.device.scanAgain();
	
	                }).catch(res => {
	                    that.isSetMesh = 0;
	                    that.device.scanAgain();
	                    console.log("添加蓝牙设备失败：" + res.ERR_MSG);
                  });
                  
              }
            });
        }

        if((response.deviceChangeFlag == 'DevDisConnected' || response.deviceChangeFlag == 'DevConnecteFail') && that.isSetMesh == 0){
            that.isSetMesh = 0;
            that.device.scanAgain();
        }

    });

    this.timer = setTimeout(() => {
        this.setState({
          searching: false,
        });
        this.device.stopScan();
    }, 20000);
   
  }

  stopSearching() {
    const { currentId, familyItems} = this.props;
    this.device.stopScan();
    this.device.startConnect({
        meshName: familyItems[currentId].currentMeshName,
        meshPassword: familyItems[currentId].currentMeshPassword
    });
  }



  handleClickToSet() {
//	let that = this;
//  let devlist = this.state.newDeviceList;
//   	console.log("wcb devlist ",devlist);
////		 遍历设备列表，筛选出所有的遥控器设备
//		for(let i = 0; i < devlist.length; i++) {
//			let devType = devlist[i].devType;
//			
//			// deviceType中包含遥控器
//			if(devType != undefined && devType.indexOf('remote') >= 0) {
//				console.log('搜索到遥控器');
//				 that.device.getNextRemoteGroupID().then(res=>{
//
//          let nextRemoteGroupID = res;
//          console.log('给遥控器分配组id：'+nextRemoteGroupID);
//          that.device.setRemoteGroupId({
//          	devId:devlist[i].devId,
//            nextRemoteGroupId:nextRemoteGroupID
//          });
//
//          that.device.editDeviceWithAddress({
//            keyVals:{
//              remote_groud_id:nextRemoteGroupID
//            },
//            address:devlist[i].devId
//          });
//
//        });
//			}
//		}
  	 const {actions} = this.props;
    this.stopSearching();
    clearTimeout(this.timer);

    this.device.removeRepeatDevice();//删除重复添加到数据库的设备
     	let that = this;
    	let devlist = this.state.newDeviceList;
	      
	      if(devlist.length<2&&devlist.length>0){
	      	console.log("wcb,devlist：",devlist);
					const data = {
		        name: devlist[0].name,
		        devId: devlist[0].devId,
		        devType: devlist[0].devType,
		        icon: this.getDeviceIcon(devlist[0].devType),
		        roomId:"",
		        homeId:"",
		        parentId:"",
		        agreement:"BLE"
		      };   	
		       const path = {
        		pathname: '/gateway/addSuccess',
       		 	query: data,
      		};
      		/*let devIcon = "";
      		devIcon:that.getDeviceIcon(devlist[0].devType);
      		console.log("wcb devIcon",devIcon);*/
      		actions.shouldUpdateDeviceList();
    			this.props.history.push(path);
	      }else if(devlist.length>1){
	      	actions.shouldUpdateDeviceList();//刷新数据
	      	this.props.history.push('/home');
	      }
   
//   	for(let i = 0; i < devlist.length; i++){
//   		
//   	}
//  const data = {
//      name: device.name,
//      devId: device.devId,
//      type: searchType,
//      icon: this.getDeviceIcon(device.devType),
//      devType: device.devType,
//    };
//  this.props.history.push('/device/addSuccess');
  }

  render() {
    const { searchType } = this.props;
    const notFoundEle = () => {
      if (this.state.init || this.state.searching || this.state.refreshing || this.state.newDeviceList.length) {
        return null;
      }
      return <div className='not_foud'>{Lang.device.deviceNotFound}</div>;
    }
    const btnEle = () => {
      if (this.state.newDeviceList.length) {
        return <button className="doneBtn" onClick={this.handleClickToSet}>{Lang.public.done}</button>;
      }
      if (this.state.init || this.state.searching || this.state.refreshing) {
        return null;
      }
      return <button className="doneBtn" onClick={this.tryAgain}>{Lang.public.tryAgain}</button>;
    }
    const testOnOff = () => {
      if (this.state.newDeviceList.length) {
        return <button className="doneBtn" onClick={this.handleClickToSet}>{Lang.public.done}</button>;
      }
      return null;
    }
    return (
      <div className="searchHub" >
        <BarTitle onBack={this.handleClickBack} title={`Search ${searchType}`} />
        <div className="searchHub_main">
          {notFoundEle()}
          {(this.state.searching && !this.state.error) ?
            <div className="search">
              <span>{Lang.pullToRefresh.searching}</span>
              <i className={this.state.searching ? 'animation_list' : ''} />
            </div> : null}
          <ScrollView>
            {this.state.newDeviceList.map((item) => {
              return (<SearchComponent
                data={item}
                key={item.devId}
                type={item.devType || searchType}
              />);
            })}
          </ScrollView>
          {testOnOff()}
          {btnEle()}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    searchType: ownProps.match.params.type,
    familyItems: state.family.items,
    currentId: state.family.currentId
  };
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
			shouldUpdateDeviceList,
			showDialog,
		},
		dispatch,
	),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchBLEDevice);
