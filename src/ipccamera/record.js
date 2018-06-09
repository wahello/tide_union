import React, {
	Component
} from 'react';
import './default/style.css';
// import { connect } from 'react-redux';
// import { Lang } from '../public';
import BarTitle from '../component/barTitle';
// import { Route, Link } from 'react-router-dom';
import jsBridge from '../jssdk/JSBridge';
import { Tabs, WhiteSpace, Grid,Button } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
const tabs = [{
		title: '本地录影'
	},
	{
		title: '本地相册'
	}

];
var data = Array.from(new Array(9)).map((_val, i) => ({
	icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
	text: `name${i}`,
}));
var data1 = Array.from(new Array(9)).map(() => ({
	icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
}));




class IPCRecord extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data2:data,
			data3:data1,
			data:'JS初始数据'
		}
		this.handleClickBack = this.handleClickBack.bind(this);
		this.handleClickSave = this.handleClickSave.bind(this);

	}
	
	handleClickBack(event) {
		console.log('点击发送数据到原生');

		//this.props.history.goBack();
		
		jsBridge.send({
			service: 'BRIDGE',
			action: 'ToUpdate',
			doData:'我们背对背拥抱'
		}).then(res => {

		});
	}

	componentDidMount() {
	
		var that = this;
		jsBridge.on('IPCRecord.imgSrc', function(res){
	
		 	console.log(res);
			
		    setTimeout(() => { 
				that.setState({data:'原生让我改变的'});
		    },0);
		});

	}

	handleClickSave(event) {
		this.props.history.goBack();
		console.log('保存按钮被点击了');

		this.props.history.goBack();
				//获取设备id
		jsBridge.send({
			service: 'UDP',
			action: 'ToUpdate'
		}).then(res => {

		});
	}
	render() {
		return(
	<div >
		<Button style = {{marginTop: "30px"}} onClick = {this.handleClickBack}>测试</Button>
		<div style = {{marginTop: "30px"}} >{this.state.data}</div>
	</div>
		);
	}
}
export default(IPCRecord)
// <BarTitle onBack={this.handleClickBack} title='IPCRecord' onDone={this.handleClickSave} />
		// return(
		// 	<div className="ipc setting">
		// 	 <BarTitle onBack={this.handleClickBack} title='IPCRecord' onDone={this.handleClickSave} />
		// 	 <div>{this.state.abc}</div>
		// 	 <img src= {this.state.url} />
		// 	 <div className="content">
		// 			  <Tabs tabs={tabs}
  //       initalPage={'t2'} tabBarInactiveTextColor='#00ff00' tabBarActiveTextColor='#ff0000' tabBarBackgroundColor="#00000000"
  //     >
  //       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', backgroundColor: '#00000000' }}>
  //           <Grid data={this.state.data2} columnNum={3} itemStyle={{ height: '100px',width: '100px', background: 'rgba(0,0,0,.05)' }} />
  //       </div>
  //       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', backgroundColor: '#00000000' }}>
  //         <Grid data={this.state.data3} columnNum={3} itemStyle={{ height: '100px',width: '100px', background: 'rgba(0,0,0,.05)' }} />
  //       </div>
      
  //     </Tabs>
		// 		</div>
		// </div>
		// );

