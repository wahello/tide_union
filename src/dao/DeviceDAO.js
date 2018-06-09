import * as db from '../jssdk/db';

const TB_DEVICE = 'device';
const TB_DEVICE_STATE = 'device_state';
const TB_DEVICE_STATUS = 'device_status';

export function addDevice() {
  return db.insert(TB_DEVICE, {
    name: "CCT灯",
    icon: ''
  });
}

export function delDevice() {

}

export function getDeviceList() {
  return db.querySQL(`SELECT * FROM ${TB_DEVICE}`).then(res => {
    return res.data[0];
  });
}
