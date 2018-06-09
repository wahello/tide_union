
const stateInit = {
	editName: '',
    selectedIcon: null,
    sceneListEdit:false,
    deleteSceneIds:[],
    editSceneId:'',
    selectStatus:[],
    sceneRuleItems:{},
    controlDeviceId:'',
    scenes:[],
    sceneItems:[],
    isRefreshList:true,
    isAllSelected:false,
    isAllOn:true,
    editRuleItems:{},
    editDeviceItems:{},
    allBulbDeviceItems:[],
    isTouchList:false,
};

function scene(state = stateInit, action) {
  switch (action.type) {
    case 'INIT_SCENE_DATA':
      return stateInit;
    case 'EDIT_SCENE_NAME':
    	return {...state, editName: action.sceneName};
    case 'SELECT_SCENE_ICON':
    	return {...state, selectedIcon: action.icon};
    case 'CHANGE_EDIT_STATE':
    	return 	{...state, sceneListEdit: action.isEdit};
   	case 'DELETE_SCENE_IDS':
   		return 	{...state, deleteSceneIds: action.deleteSceneIds};
   	case 'CHANGE_EDIT_SCENE_ID':
   		return 	{...state, editSceneId: action.editSceneId};
   	case 'CHANGE_SELECT_STATUS':
   		return 	{...state, selectStatus: action.selectStatus};
   	case 'SET_SCENE_RULE_ITEM':
   		return 	{...state, sceneRuleItems: action.sceneRuleItems};
   	case 'SET_CONTROL_DEVICE_ID':
   		return 	{...state, controlDeviceId: action.controlDeviceId};
   	case 'SET_SCENE_LIST':
   		return 	{...state, scenes: action.scenes};
   	case 'SET_SCENE_ITEMS':
   		return 	{...state, sceneItems: action.sceneItems};
   	case 'SET_REFRESH_SCENE_LIST':
   		return  {...state, isRefreshList: action.isRefreshList};
   	case 'FETCH_SCENE_LIST_FAILURE':
   		return  {...state, isRefreshList: false};
   	case 'FETCH_SCENE_LIST_SUCCESS':
      return { ...state,
        isRefreshList: false,
        scenes: action.scene.list,
        sceneItems: action.scene.sceneItems
      };
    case 'CHANGE_IS_ALL_SELECTED':
      return { ...state,
      	isAllSelected:action.isChecked
      };
    case 'CHANGE_IS_ALL_ON':
      return { ...state,
      	isAllOn:action.isAllOn
      };
     case 'SET_EDIT_RULE_ITEMS':
      return { ...state,
      	editRuleItems:action.editRuleItems
      };
     case 'SET_EDIT_DEVICE_ITEMS':
      return { ...state,
      	editDeviceItems:action.editDeviceItems
      };
     case 'SET_ALL_BLUB_DEVICE_ITEM':
       return { ...state,
      	allBulbDeviceItems:action.allBulbDeviceItems
      };
     case 'SET_IS_TOUCH_LIST':
       return { ...state,
      	isTouchList:true
      };
      case 'CLEAR_IS_TOUCH_LIST':
       return { ...state,
      	isTouchList:false
      };
    default:
      return state;
  }
}

export default scene;