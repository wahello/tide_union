import jsBridge from '../jssdk/JSBridge'
import Cookies from 'universal-cookie';

const cookie = new Cookies;
const TERMINAL = 'app';
let config = {
    header: {}
};
export default {
  post (options) {
    return jsBridge.send({
      service: 'HTTP',
      action: 'post',
      data: {
        url: options.url,
        message: options.data,
        header: {
          terminal: TERMINAL,
          token: cookie.get('accessToken'),
          'active-language': (cookie.get("langType") || navigator.language) == 'zh-CN' ? 'zh_CN' :'zh_US',
          ...config.header,
          ...options.header
        }
      }
    }, options.timeout).then(res => {
      if (typeof config.complete === 'function') {
         config.complete(res);
      }
      return res;
    });
  },

  get (options) {
    return jsBridge.send({
      service: 'HTTP',
      action: 'get',
      data: {
        url: options.url,
        message: options.data,
        header: {
          terminal: TERMINAL,
          token: cookie.get('accessToken'),
          'active-language': (cookie.get("langType") || navigator.language) == 'zh-CN' ? 'zh_CN' : 'zh_US',
          ...config.header,
          ...options.header
        }
      }
    }, options.timeout).then(res => {
      if (typeof config.complete === 'function') {
         config.complete(res);
      }
      return res;
    });
  },

  setUp(options) {
    config = options;
  }
}
