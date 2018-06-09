import React, { Component } from 'react';
import './default/style.css';

class DropMenu extends Component{
	constructor(props){
		super(props);
		this.state = {
			show:false,
			menuName:''
		};
	}
	componentWillReceiveProps(nextProps){
		if(typeof(nextProps) != 'undefined'){
			const data = nextProps.data;
			let dataList = data || [];
			let defaultName = dataList.filter((item) => {
				return item.selected;
			});
			this.setState({
				menuName:defaultName[0].name
			});
		}
	}
	handleSelectItem(a, event){
		this.setState({menuName: event.target.innerHTML});
		this.props.onSubClick(event.target.innerHTML);
	}
	render(){
		const { style, data, disable } = this.props;
		let styleObj = style || {};
		let spanStyle = {
			height:styleObj.subItemHeight + styleObj.unit,
			color:styleObj.subItemColor,
			lineHeight:styleObj.subItemHeight + styleObj.unit,
			fontFamily:styleObj.fontFamily,
			fontSize:styleObj.fontSize + 'px'
		}
		let subMenu = !this.state.show ? 'sub-menu': 'sub-menu show'; 
		let disableState = typeof(disable) == 'undefined' ? false : true;
		let menuTxt = disableState ? 'drop-txt disable' : 'drop-txt';
		return(
			<a 
				className='drop-menu' 
				style={{
					width:styleObj.width + styleObj.unit,
					height:styleObj.height + styleObj.unit,
					borderRadius:styleObj.borderRadius + styleObj.unit,
					borderWidth:styleObj.borderWidth + styleObj.unit,
					borderStyle:'solid',
					borderColor:styleObj.borderColor,
					marginTop:styleObj.marginTop + styleObj.unit
				}}
				onClick={e => {
					if(disableState){
						return;
					}
					 e.stopPropagation();
					 this.setState({show: !this.state.show});
				}}
				>
				<span 
					className={menuTxt}
					style={{
						height:styleObj.height + styleObj.unit,
						lineHeight:styleObj.height + styleObj.unit,
						fontFamily:styleObj.fontFamily,
						fontSize:styleObj.fontSize + 'px',
						color:styleObj.color
					}}>{this.state.menuName}</span>
				<div 
					className={subMenu}
					style={{
						width:(styleObj.width + styleObj.borderWidth * 2) + styleObj.unit,
						left:(-styleObj.borderWidth) + styleObj.unit,
						top:(styleObj.height + 0.4) + styleObj.unit,
						borderRadius:styleObj.borderRadius + styleObj.unit,
						borderTop: '0.6rem solid ' + styleObj.subBackgroundColor,
						borderBottom: '0.6rem solid ' + styleObj.subBackgroundColor
					}}>
					{data.map((item,index) => 
						<span 
							key={index} 
							style={spanStyle} 
							className={item.name == this.state.menuName ? 'selected' : null} 
							onClick={this.handleSelectItem.bind(this,'')} 
						>
							{item.name}
						</span>
						)}
				</div>
			</a>
		);
	}
}

export default (DropMenu);
