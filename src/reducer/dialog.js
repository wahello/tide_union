import { Lang } from '../public/resource';
const stateInit = {
	display: "none",
	title: Lang.public.dialog.title[0],
	content: "",
	buttons: [{
		text: Lang.public.dialog.button[1],
		className: "btnSure",
		handleClick: function(){
			this.hide();
		}
	}]
};

function dialog(state = stateInit, action) {
	for(var key in action){
		let value = action[key];
		if(typeof value === 'undefined'){
			delete action[key];
		}
　  }
  	switch (action.type) {
	    case 'SHOW_DIALOG':
	      return {...stateInit, ...action};

	    case 'HIDE_DIALOG':
	      return {...stateInit, ...action};

	    default:
	      return state;
  	}
}

export default dialog