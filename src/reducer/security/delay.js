const stateInit = {
    duration: undefined,
    modelChecked: [],
};
function delay(state = stateInit, action) {
  switch (action.type) {
    case 'SET_DELAY':
      return {
        ...state,
        duration: action.duration,
        modified: state.duration && action.duration !== state.duration
      };

   case 'CURRENT_MODES':
      return {
        ...state, 
        modelChecked: action.modes,
      };

    default:
      return state;
  }
}

export default delay;