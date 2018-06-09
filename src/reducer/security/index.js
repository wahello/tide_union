import { combineReducers } from 'redux';

import siren from './siren';
import modes from './modes';
import delay from './delay';
import ledMode from './ledMode';

const Reducer = combineReducers({
 		siren,
 		modes,
 		delay,
    ledMode,
	}
 )

export default Reducer;