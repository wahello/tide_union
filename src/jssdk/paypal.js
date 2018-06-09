
import jsBridge from '../jssdk/JSBridge'
import Cookies from 'universal-cookie';

const cookie = new Cookies;
const TERMINAL = 'app';
let config = {
    header: {}
};
let langType = cookie.get("langType") || navigator.language;
let Lang = langType == 'zh-CN' ? 'zh_CN' : 'zh_US';
export default {
    paypal(options) {
        return jsBridge.send({
            service: 'HTTP',
            action: 'paypal',
            data: {
                url: options.url,
                message: options.data,
                header: {
                    terminal: TERMINAL,
                    token: cookie.get('accessToken'),
                    'active-language': Lang,
                    ...config.header,
                    ...options.header
                }
            }
        }, options.timeout);
    }
}