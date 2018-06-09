function siren(state = {}, action) {
  switch (action.type) {
    case 'SET_SIREN_VOLUME':
      return {
        ...state, 
        volume: action.volume,
        modified: state.volume && action.volume !== state.volume
      };

    case 'SET_SIREN_TIME':
    return {
      ...state, 
      time: action.time,
      modified: state.time && action.time !== state.time      
    };

    default:
      return state;
  }
}

export default siren;  