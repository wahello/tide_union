
const stateInit = {
	display: "block",
	selectedTab: "device"
};

function other(state = stateInit, action) {
  switch (action.type) {
    case 'SELECT_TAB':
    	return Object.assign({}, state, {selectedTab: action.tabName});
    default:
      return state;
  }
}


export default other