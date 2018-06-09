
const stateInit = {
	cacheUpdated: false,
	selectedSpace: null,
  selectedIcon: null,
  selectedRoomIcon: ''
};

function space(state = stateInit, action) {
  switch (action.type) {
    case 'UPDATE_OBJECTS_DONE':
    	return {...state, cacheUpdated: true};
    case 'SELECT_SPACE':
    	return {...state, selectedSpace: action.selectedSpace};
    case 'SELECT_SPACE_ICON':
    	return {...state, selectedIcon: action.icon};
    case 'SELECT_ROOM_ICON':
      return {...state, selectedRoomIcon: action.icon};
    case 'INIT_ROOM_DEFAULT_ICON':
      return {...state, selectedRoomIcon: ''};
    default:
      return state;
  }
}

export default space;