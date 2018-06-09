import { Lang } from '../public/resource';

const stateInit = {};

function component(state = stateInit, action) {
	for(var key in action){
		let value = action[key];
		if(typeof value === 'undefined'){
			delete action[key];
		}
　  }
  switch (action.type) {
	  case 'SET':
	    return {...stateInit, ...action};
	  default:
	     return state;
  	}
}

export default component