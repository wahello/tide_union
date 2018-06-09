import { combineReducers } from 'redux';
import dialog from './dialog';
import other from './other';
import component from './component';
import device from './device';
import space from './space';
import family from './family';
import scene from './scene';
import room from './room';
import system from './system';
import security from './security';
import home from './home';
import automation from './automation';
import ipc from './ipc';
import ota from './ota';

const Reducer = combineReducers({
  device,
  component,
  space,
  dialog,
  other,
  family,
  scene,
  room,
  system,
  security,
  home,
  automation,
  ipc,
  ota,
});

export default Reducer;
