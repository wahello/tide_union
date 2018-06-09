import http from '../../jssdk/Http';
import config from '../../config';

const familyURL = `${config.httpServer}/home` // 'http://172.16.55.119:8090/space';

export default {
  createFamily (data) {
    return http.post({url: `${familyURL}/addHome`, data})
  },

  familyList (data) {
    console.log(data)
    return http.post({url: `${familyURL}/getHomeList`, data});
  },
    
  editHome(data){
  	return http.post({url: `${familyURL}/editHome`, data});
  }
}
