import http from '../jssdk/Http';

const homeURL = 'http://172.24.2442:3000/home';

export default {
  getProductInfo(data) {
    return http.get({ url: `${homeURL}/home/getProductInfo`, data });
  },
};
