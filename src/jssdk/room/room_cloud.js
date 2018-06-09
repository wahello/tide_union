import http from '../../jssdk/Http'
import config from '../../config'
const roomURL = `${config.httpServer}/home`
// const roomURL = 'http://172.16.55.119:8090/space';

export default {
  addRoom (data) {
    return http.post({url: `${roomURL}/addRoom`, data})
  },
  deleteRoom (data) {
    return http.post({url: `${roomURL}/delRoom`, data})
  },
  getSpace (data) {
    return http.get({url: `${roomURL}/getSpace`, data})
  },
  update (data) {
    return http.post({url: `${roomURL}/editRoom`, data})
  },
  getRoomList (data) {
    return http.post({url: `${roomURL}/getRoomList`, data})
  }
}
