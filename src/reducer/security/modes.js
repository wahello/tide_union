const initState = {
  isFetching: false,
  list: {},
  progress: 0,
  status: null,
  triggerList: [],
  triggerDevList: []
};

function modes(state=initState, action){
  const {list} = state;
  switch (action.type) {
    case 'INIT_SECURITY_DATA':
      return initState;
      
  	  /*--- 获取mode列表 ---*/
    case 'FETCH_MODES_REQUEST':
      return {
        ...state,
        isFetching: true
      };

    case 'FETCH_MODES_SUCCESS':
      return {
        ...state,
        isFetching: false,
        list: action.modes,
        progress: action.progress
      };

    case 'FETCH_MODES_FAILURE':
      return {
        ...state,
        isFetching: false,
        err: action.err
      };
    /* --- eof 获取mod列表 --- */

    case 'DEPLOY_MODE':
      return {
        ...state,
        list: {
          ...list,
          [action.modeName]: {
            ...list[action.modeName], 
            enable: action.enable
          }
        }
      }

    case 'ADD_MODE':
      console.log(state);
      let modeslist = state.list || {};
        return {
          ...state,
          list: {
            ...modeslist,
            [action.mode.name]: action.mode
          }
        }

    case 'EDIT_MODE':
      const {rule} = action;
      return {
        ...state,
        list: {
          ...list,
          [rule.securityType]: rule
        }
      }

    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.progress
      }

    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
        progress: action.progress
      }
    
    case 'SET_MODE':
      return {
        ...state,
        list: {
          ...state.list,
          [action.securityType]: action.rule
        }
      }
		
		case 'FETCH_TRIGGER_LIST':
			return {
				...state,
				triggerList: [...action.triggerList],
			}
			
		case 'FETCH_TRIGGER_DEVID_LIST':
			return {
				...state,
				triggerDevList: action.triggerDevList
			}
		
    default:
      return state;
  }
}

export default modes;