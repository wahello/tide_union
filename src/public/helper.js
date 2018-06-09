import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import MD5 from 'md5.js';
import { Lang } from '../public';
import { showDialog } from '../action';
import { connect } from 'react-redux';


export default class {
	static data2String(data) {
		let str = '';
		if(data instanceof FormData){
		  data.forEach((value, key) => {
		  	str += (!str.length ? '?':'&') + key + '=' + value;
		  });
			return str;
		}
		if(data instanceof Object){
			for(let key in data){
				let value = data[key];
				str += (!str.length ? '?':'&') + key + '=' + value;
			}
			return str;
		}
	};
	
	static data2FormData(data) {
		if(data instanceof FormData){
			return data;
		}
		if(data instanceof Element){
			return new FormData(data);
		}
		if(data instanceof Object){
			let formData = new FormData();
		  data.forEach((value, key) => {
		  	formData.append(key, value);
		  });
		  return formData;
		}
	};
	
	static data2JSON(data) {
		if(data instanceof FormData){
			let jsonData = {};
		  data.forEach((value, key) => {
		  	jsonData[key] = value;
		  });
	  	return jsonData;
		}
		if(data instanceof Object){
			return data;
		}
	};

	static renderRoot(Component){
  		ReactDOM.render(Component, document.getElementById('root'));
	}
	
	static renderApp(Component){
  		ReactDOM.render(Component, document.getElementById('app'));
	}
	
	static refreshRoot(){
  		window.location.reload();
	}
	
	static md5(str){
		let md5 = new MD5();
		md5.end(str);
		return md5.read().toString('hex');
	}
	
	static pack(rgb) {
    var r = Math.round(rgb[0] * 255);
    var g = Math.round(rgb[1] * 255);
    var b = Math.round(rgb[2] * 255);
    
    return '#' + (r < 16 ? '0' : '') + r.toString(16) +
           (g < 16 ? '0' : '') + g.toString(16) +
           (b < 16 ? '0' : '') + b.toString(16);
	}

	static int2Rgb(val) {
		let color = '#ae00ff';
		let n = (val >>>8).toString(16);
		if (n.length == 6) {
			color = `#${n}`;
		}
		if (n.length == 4) {
			color = `#00${n}`;
		}
		return color;
	}
	

	static unpack(color) {
		if (color.length == 7) {
		  return [parseInt('0x' + color.substring(1, 3)) / 255,
		    parseInt('0x' + color.substring(3, 5)) / 255,
		    parseInt('0x' + color.substring(5, 7)) / 255];
		}
		else if (color.length == 4) {
		  return [parseInt('0x' + color.substring(1, 2)) / 15,
		    parseInt('0x' + color.substring(2, 3)) / 15,
		    parseInt('0x' + color.substring(3, 4)) / 15];
		}
	}
  
  static HSLToRGB(hsl) {
    var m1, m2, r, g, b;
    var h = hsl[0], s = hsl[1], l = hsl[2];
    m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
    m1 = l * 2 - m2;
    return [this.hueToRGB(m1, m2, h+0.33333),
        this.hueToRGB(m1, m2, h),
        this.hueToRGB(m1, m2, h-0.33333)];
  }

  static hueToRGB(m1, m2, h) {
    h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
    return m1;
  }

  static RGBToHSL(rgb) {
    var min, max, delta, h, s, l;
    var r = rgb[0], g = rgb[1], b = rgb[2];
    min = Math.min(r, Math.min(g, b));
    max = Math.max(r, Math.max(g, b));
    delta = max - min;
    l = (min + max) / 2;
    s = 0;
    if (l > 0 && l < 1) {
      s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
    }
    h = 0;
    if (delta > 0) {
      if (max == r && max != g) h += (g - b) / delta;
      if (max == g && max != b) h += (2 + (b - r) / delta);
      if (max == b && max != r) h += (4 + (r - g) / delta);
      h /= 6;
    }
    return [h, s, l];
  }
  
	static RemToPx(prem){
	    let html = document.getElementsByTagName("html")[0];
	    let fontSize = parseFloat(window.getComputedStyle(html).fontSize, 10);
	    let rem = parseFloat(prem, 10);
	    return (fontSize * rem);
	}

	static dateFormat(date, format){
		if(!date instanceof Date){
			throw 'invalid date';
		}

		if(typeof format !== 'string') {
			throw 'invalid date format'
		}

		const day = date.getDate();
		const hour = date.getHours();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const minute = date.getMinutes();
		const seconds = date.getSeconds();
		return format.replace('yyyy', year)
									 .replace('mm', month > 9 ? month : '0' + month)
									 .replace('dd', day > 9 ? day : '0' + day)
									 .replace('hh', hour > 9 ? hour : '0' + hour)
									 .replace('MM', minute > 9 ? minute : '0' + minute)
									 .replace('ss', seconds > 9 ? seconds : '0' + seconds);

	}
	
	/**
	 * 格式化日期方法
	 * @param {Date, String} date:需要格式化的日期对象，字符串
	 * @parm {String} format:格式化字符串
	 */
	static formatDate(date, format){
		if(!date || date =="0"){
			return "";
		}
		if (!format) {
			format = "yyyy-MM-dd hh:mm:ss";
		}
		if(typeof date == "string"){
			if(date.length == 8){
				var arr = [date.substr(0,4),date.substr(4,2),date.substr(6,2)];
			}else if(date.length == 14){
				var arr = [date.substr(0,4),date.substr(4,2),date.substr(6,2),date.substr(8,2),date.substr(10,2),date.substr(12,2)];
			}else{
				var arr = date.split(/[^0-9]+/);
			}
			
			format = format.replace(/([a-z])\1+/ig,function(all,$1){
				var result = {
					y : ~~arr[0],
					M : ~~arr[1],
					d : ~~arr[2],
					h : ~~arr[3],
					m : ~~arr[4],
					s : ~~arr[5]  			
				}[$1];
				if(result!=undefined&&result<10){
					result = "0"+result
				}
				return result || "";
			});
			return format;
		}
		format = format.replace(/([a-z])\1+/ig,function(all){
			var first = all.charAt(0);
			if("y M d h m s".indexOf(first)>=0){
				if(first=="y"){
					return all.length>2
						? date.getFullYear()
						: (date.getFullYear()+"").substr(2);
				}
				var result = {
					M : date.getMonth() + 1,
					d : date.getDate(),
					h : date.getHours(),
					m : date.getMinutes(),
					s : date.getSeconds()
				}[first];
				result!=undefined&&result<10
					&&(result = "0"+result);
				return result;
			}else{
				return all;
			}
		});
		return format;
	}
	
	/**
	 * 转换成12小时制方法
	 * @param {Date} date:需要格式化的日期对象
	 * @parm {String} format:格式化字符串
	 */
	static changeTimeto12(date,format){
		if(!date || typeof(date) != "object"){
			return "";
		}
		if (!format) {
			format = "hh:mm:ss pp";
		}
		function showTheHours(theHour) { 
			if (theHour > 0 && theHour < 13) {
				return theHour;
			}
			if (theHour == 0) {
				return 12;
			}
			return theHour-12;
		}
		function showAmPm(theDate) {
			if ((theDate.getHours() < 12)) {
				return " AM";
			}
			return " PM";
		}
		
		format = format.replace(/([a-z])\1+/ig,function(all){
			var first = all.charAt(0);
			if("y M d h m s p".indexOf(first)>=0){
				if(first=="y"){
					return all.length>2
						? date.getFullYear()
						: (date.getFullYear()+"").substr(2);
				}
				var result = {
					M : date.getMonth() + 1,
					d : date.getDate(),
					h : showTheHours(date.getHours()),
					m : date.getMinutes(),
					s : date.getSeconds(),
					p : showAmPm(date)
				}[first];
				result!=undefined&&result<10
					&&(result = "0"+result);
				return result;
			}else{
				return all;
			}
		});
		
		return format;
	}

}