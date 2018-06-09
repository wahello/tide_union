import React,{ Component } from 'react';
import './default/style.css';
import { Lang } from '../public';
import BarTitle from '../component/barTitle';
import { connect } from 'react-redux';

const dataList = [
    {name:'Leedarson_001',type:'lock',style:'wifi-lock',id:'leedarson_id'},
    {name:'Leedarson_test',type:'no',style:'wifi-lock',id:'leedarson_id_test'},
    {name:'Leedarson_aa03',type:'lock',style:'wifi-lock',id:'leedarson_id-aa03'},
    {name:'Leedarson_002',type:'no',style:'wifi-lock',id:'leedarson_id-xxbn001'},
    {name:'test000-001',type:'lock',style:'wifi-lock',id:'leedarson_id_test'},
    {name:'test_aa03',type:'lock',style:'wifi-lock',id:'leedarson_id-aa03'},
    {name:'test-try-0045',type:'no',style:'wifi-lock',id:'leedarson_id-xxbn001'},
    {name:'test_111111',type:'lock',style:'wifi-lock',id:'leedarson_id-aa0311111'},
    {name:'test-try-22222',type:'no',style:'wifi-lock',id:'leedarson_id-222222'}
];

class FoudWifi extends Component {
    constructor (props){
        super (props);
        this.state = {
            id:'',
            wifiname:''
        },
        this.handleClickBack = this.handleClickBack.bind(this);
    };
    handleClickBack(event){
        // this.props.history.goBack();
        this.props.history.push('/gateway/settings');
    };
    componentDidMount(){
        console.log(this.state);
    }
    goConnect(e){
        const target = e.target;
        let id = target.id;
        let name = target.innerHTML;
        this.setState({
            id:id,
            name:name
        })
        debugger;
        let data = {
            id:this.state.id,
            wifiname:this.state.name
        };
        let path = {
            pathname:'/gateway/connect',
            query:data
        };
        this.props.history.push(path);
    };

    render(){
        let wifiList = dataList.map((item, index)  =>
            <li className="get-wifi-lsit" data-id={item.id} key={index}>
                <span style={{color:"$text-color"}} className="wifi_name" onClick={(e)=>this.goConnect(e)} id={item.id} name = {item.name}>{item.name}</span>
                <span className={item.type === "lock" ? item.style : "" }></span><span className="wifi_Strength"></span>
            </li>
        )
        return(
            <div className='foudWifi'>
                <BarTitle onBack={this.handleClickBack} title={Lang.gateway.foudWifi.title}/>
                <p className='foud_step'>{Lang.gateway.foudWifi.step}</p>
                <div className='wifi_list'>
                    <ul style={{margin:"0px"}}>
                        {wifiList}
                    </ul>
                </div>
            </div>
        )
    }
}
export default connect()(FoudWifi)