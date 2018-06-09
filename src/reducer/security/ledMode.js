function ledMode(state= {}, action) {
  switch (action.type) {
    case 'SET_LED_MODE':
      return {
        ...state,
        value: action.value,
        modified: state.value && action.value !== state.value
      };

    default:
      return state;
  }
}

export default ledMode;