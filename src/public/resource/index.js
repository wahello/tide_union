import Cookies from 'universal-cookie';

/** 国际化语言 **/
const cookies = new Cookies();
let langType = cookies.get("langType") || navigator.language;
let Lang = null;
switch(langType){
	case "zh-CN": 
		Lang = require('./i18n/zh_cn').default;
		break;
	default:
		Lang = require('./i18n/en_us').default;
}

/** 定制化样式 **/
let _ua = navigator.userAgent;
let Style = null;
if(_ua.indexOf('com.a023.smarthome') !== -1){
	Style = require('./style/a023.css');
}else{
	Style = require('./style/default.css');
}

export {Lang, Style};