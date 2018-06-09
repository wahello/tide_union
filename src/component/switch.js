import React, { Component } from 'react';
import './default/style.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Switch extends Component {
  constructor(props){
  	super(props);
  	this.state = {
  		checked: false
  	}
	}
	
	componentDidMount(){

		console.log('----------------------------------------------------switch----------------------------')
		console.log(this.props.checked)

		this.setState(
		{
		checked :this.props.checked
		})
	}

  componentWillReceiveProps(nextProps) {
    this.setState(
    {
      checked :nextProps.checked
    })
  }

  render() {
    return (
  		<a 
  			className={'switch ' + (this.state.checked ? 'switch-on' : 'switch-off')} 
  			onClick={e=>{
          e.stopPropagation();

          if(this.props.disabled){
						this.props.onDisable && this.props.onDisable();
            return;
          }
  				this.setState({checked: !this.state.checked});
  				this.props.onClick && this.props.onClick(!this.props.checked);
  				
  			}}></a>
    );
  }
}

Switch.propTypes = {
	checked: PropTypes.bool,
	onClick: PropTypes.func
}

Switch.defaultProps = {
	checked: false
}


const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(Switch);