import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './default/style.css';

class CircularProgress extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    this.setProgress(this.props.progress);
  }

  componentWillReceiveProps(nextProps) {
    this.setProgress(nextProps.progress);
  }

  setProgress(progress) {
    if(progress < 0 || !this.progressBar){
      return;
    }

    const pathLength = this.progressBar.getTotalLength();
    const strokeDasharray = `${pathLength - (1 - progress) * pathLength} ${pathLength}`;
    this.progressBar.style.strokeDasharray = strokeDasharray;
    
    const cood = this.progressBar.getPointAtLength(progress  * pathLength);
    this.point.style.cx = cood.x;
    this.point.style.cy = cood.y  === 0 ? -this.props.r : cood.y;
  }


	strokeDasharray(){
		const progress = this.props.progress;
    if(this.progressBar){
      const pathLength = this.progressBar.getTotalLength();
      const strokeDasharray = `${pathLength - (1 - progress) * pathLength} ${pathLength}`;
      return strokeDasharray;
    }

    return 0;
		
	}

	pointCoord(){

    if(this.progressBar){
      const pathLength = this.progressBar.getTotalLength();
      const cood = this.progressBar.getPointAtLength(this.props.progress  * pathLength);
      return {
        x: cood.x === 0 ? -this.props.r : cood.x,
        y: cood.y
      };
    }

    return {
      x: -this.props.r,
      y: 0
    };
		
	}
  
  render() {
  	const d = `M 0, 0 m 0, -${this.props.r} a ${this.props.r},${this.props.r} 0 1 1 0, ${2 * this.props.r} a ${this.props.r},${this.props.r} 0 1 1 0, -${2 * this.props.r}`;
    const r = this.props.r + this.props.strokeWidth;
    const dia = 2 * r;
    return (
        <svg style={this.props.style} className={this.props.className} viewBox={`-${r} -${r} ${dia} ${dia}`} width={dia} height={dia}>
            <filter id="blur-filter" x="-2" y="-2" width={dia} height={dia}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            </filter>
            <path
                stroke="#292D3E"
                strokeWidth={this.props.strokeWidth}
                fill="transparent"
                d={d}
            />
           <path 
              className="progress-bar"
              stroke="#00E49C"
              strokeLinecap={this.props.progress > 0 ? 'round': 'butt'}
              strokeWidth={this.props.progress > 0 ? this.props.strokeWidth : 0}
              fill="transparent"
              d={d}
              ref={ path => this.progressBar = path }
            />
            <circle
              className="progress-bar-head"
              ref={point => this.point = point} 
              filter="url(#blur-filter)" 
              r={this.props.progress > 0 ? this.props.pointR : 0} 
              fill="#00E49C" 
            />
        </svg>
    );
  }
}

export default CircularProgress;

CircularProgress.propTypes = {
	r: PropTypes.number,
  pointR: PropTypes.number,
	progress: PropTypes.number,
  className: PropTypes.string,
  strokeWidth: PropTypes.number
}

CircularProgress.defaultProps = {
  strokeWidth: 8,
  pointR: 0,
  r: 50,
  className: ''
}