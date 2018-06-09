import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';
import Toast from 'antd-mobile/lib/toast';
import Cookies from 'universal-cookie';
import { bindActionCreators } from 'redux';
import Device from '../jssdk/device';
import { showDialog, changeFromPage } from '../action';
import { saveDeviceItem, setEditingName, shouldUpdateDeviceList } from '../action/device';
const dialogLang = Lang.public.dialog;
const deviceLang = Lang.device;
class AddSuccess extends Component {
    constructor (props){
        super (props);
        this.device = new Device();
        let name = '';
        let roomId = '';
        let homeId = '';
        let parentId = '';
        let devId = '';
        let icon = '';
        if (this.props.location.query) {
            name = this.props.location.query.name;
            roomId = this.props.location.query.roomId;
            homeId = this.props.location.query.homeId;
            parentId = this.props.location.query.parentId;
            devId = this.props.location.query.devId;
            icon = this.props.location.query.icon;
        }
        this.state = {
        	editvalue: name,
        	focus: false,
        	imgIcon: '',
        	roomId:roomId,
        	homeId:homeId,
        	parentId:parentId,
        	devId:devId,
        	icon:icon,
        };
        this.handleClickBack = this.handleClickBack.bind(this);
        this.inputOnblur = this.inputOnblur.bind(this);
        this.inputOnFocus = this.inputOnFocus.bind(this);
    };
     stateChange(e) {
        const target = e.target;
        this.setState({
            [target.name]: target.value,
            click: true,
            clear: true
        })

        if (target.value.length === 20) {
            Toast.info(Lang.gateway.addsuccess.tips[3],2);
        }
    };
    inputOnblur() {  // input 失去焦点事件
        setTimeout(() => {
			this.setState({
                focus: false
            });
        }, 100);
    }

    inputOnFocus() { // input 获得焦点事件
        this.setState({
            focus: true
        })
    }
    handleClickBack(event){
    	const {
			device,
			actions
		} = this.props;
    	let temName = this.props.location.query.name;
    	const {
			editvalue,
			} = this.state;
    	if(temName==editvalue){
    		//刷新数据
    		actions.shouldUpdateDeviceList();
    		this.props.history.push('/home')
    		 return;
    	}
    	const that = this;
        actions.showDialog(deviceLang.saveChangeConfirm, null, [{
			text: dialogLang.button[0],
			handleClick: function onHandle() {
				this.hide();
				this.props.history.push('/home')
			},
		}, {
			text: dialogLang.button[1],
			className: 'btn-split',
			handleClick: function onHandle() {
				that.editName(); 
				this.hide();
			},
		}, ]);
    };
    done(next){
    	this.editName(next);
//      this.props.history.push('/home')
    };
    
    editName(next){
    	const {
			device,
			actions
		} = this.props;
		const {
			editvalue,
			roomId,
			homeId,
			parentId,
			imgIcon,
			devId,
			icon,
		} = this.state;
		if(!editvalue.trim()) {
			Toast.info(Lang.device.edit.validator[0]);
			return;
		}
		if(editvalue.trim().length > 20) {
			Toast.info(Lang.device.edit.validator[2]);
			return;
		}

		const cookies = new Cookies();
		Toast.loading(Lang.public.loading);
		this.device.setDevInfoReq({
			parentId: parentId,
			payload: {
				devId: devId,
				name: editvalue.trim(),
				icon: icon,
				homeId: homeId,
				roomId: roomId,
			},
		}).then((res) => {
			Toast.hide();
			if(res.ack.code == 200) {
//				console.log("wcb ----------res200 1:",res);
				actions.shouldUpdateDeviceList();//刷新数据
//				console.log("wcb ----------res200 2:",res);
//				actions.changeFromPage('list');
//				console.log("wcb ----------res200 3:",res);
//				this.resetData();
//				console.log("wcb ----------res200 4:",res);
				if(next === 'continue'){
					this.props.history.push('/device/addFlow')
				}else{
					this.props.history.push('/home')
				}
			} else {
				const msg = res.ack ? res.ack.desc : '';
				Toast.info(msg || Lang.device.dialog.tip[3]);
			}
		}).catch((res) => {
			Toast.info(res && res.desc ? res.desc : Lang.device.dialog.tip[3]);
		});
    }
    
    continue(e){
        this.props.history.push('/device/addFlow')
    };
    componentDidMount(){
    	    if (this.props.location.query) {
            const devType = this.props.location.query.devType;
            this.setState({imgIcon: devType,})
        }
    }
    render(){
        return(
            <div className='success_add'>
                <BarTitle onBack={this.handleClickBack} title={Lang.device.add1.name}/>
                <div className='success_tips'></div>
               		<p className='success_tips_text'>{Lang.device.add1.success}</p>
	                <div className='gateway_main'>
	                 	<p className='success_tips'>{Lang.gateway.addsuccess.tips[1]}</p>
		                 <div className="box-imgtext" >
		                        <span className={"img_icon" + " " + this.state.imgIcon}></span>
		                        <input ref="deviceName" className={`${this.state.focus ? 'edit_name' : 'gateway_name'}`} type='text' name="editvalue"  value={this.state.editvalue}
		                           onChange={(e) => this.stateChange(e)} maxLength='20' onFocus={this.inputOnFocus} onBlur={this.inputOnblur}/>
		                        {/* removeText 会受onBlur影响而无效 */}
		                  </div>
	                 </div>
                <button onClick={()=> this.done('done')} className="success_done">{Lang.device.add1.doneBtn}</button>
                <button onClick={()=> this.done('continue')} className="success_continue">{Lang.device.add1.continue}</button>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
	const currentDevId = ownProps.match.params.devId;
	return {
		devId: currentDevId,
		device: state.device.items[currentDevId],
		editingName: state.device.editingName,
	};
};
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({
			shouldUpdateDeviceList,
			changeFromPage,
			showDialog,
		},
		dispatch,
	),
});
export default connect(mapStateToProps,mapDispatchToProps)(AddSuccess)