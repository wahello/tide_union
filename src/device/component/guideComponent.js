import React, { Component } from 'react';
import '../default/searchStyle.css';
import { Lang } from '../../public';
import ScrollView from '../../component/scrollView';
import BarTitle from '../../component/barTitle';
import '../default/style.css';

export default class guideComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentIndex:0,
			data:this.props.data,
			state: true,
			nextStep:this.props.nextStep,
			isShowHelp:false
		};
		
		console.log("constructor data",this.state.data);
		this.handleNext = this.handleNext.bind(this);
		this.handleToHelp = this.handleToHelp.bind(this);
		this.handleBack = this.handleBack.bind(this);
	}
	 
	handleBack(event){
		let currentIndex = 0;
		this.setState({
			isShowHelp:false,
			data:this.props.data,
			currentIndex: currentIndex
		});
  	}
	  
	handleNext(event){
		console.log("handleOnNext event",this.state);
		let currentIndex = this.state.currentIndex + 1;
		this.setState({currentIndex: currentIndex});
	}
	
	handleToHelp(event){
		console.log("handleToHelp event",this.state);
		let currentIndex = 0;
		this.setState({
			isShowHelp:true,
			data:this.props.helpData,
			currentIndex: currentIndex
		});
	}


	render() {
		
		return (
			<div>
				<BarTitle onBack={this.state.isShowHelp ? this.handleBack : this.props.onBack} title={this.state.data[this.state.currentIndex].barTitle} onApMode={this.props.onApMode} onSmartLinkMode={this.props.onSmartLinkMode} />
				<ScrollView>
			        <div className="addWrap">
			        	<div className="desc">{this.state.data[this.state.currentIndex].title}</div>
			        	<p dangerouslySetInnerHTML={{__html: this.state.data[this.state.currentIndex].desc}} className="addDesc"></p> 	
			        	<div className={'nextStep ' + this.state.data[this.state.currentIndex].background}></div>
			          	<button className ="nextBtn" onClick={this.state.data.length - 1 <= this.state.currentIndex ? this.props.onNext : this.handleNext}>{this.state.nextStep}</button>
			          	<div className='help' onClick={this.handleToHelp}>{this.state.data[this.state.currentIndex].help}</div>
			        </div>
			    </ScrollView>
			</div>
			
		);
	}
}
