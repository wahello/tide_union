export const showDialog = (title, content, buttons) => ({
  type: 'SHOW_DIALOG',
  display: "block",
  title,
  content,
  buttons
})

export const hideDialog = (callback) => ({
  type: 'HIDE_DIALOG',
  display: "none",
  callback
})

export const showProgressDialog = (title,progress,buttons,callback) => ({
  type: 'SHOW_DIALOG',
  display: "block",
  title,
  progress,
  buttons,
  callback
})

export const setComponent = (args) => ({
	type: 'SET',
	...args
})

export const devicesUpdatingDone = () => ({
  type: 'UPDATE_DEVICES_DONE'
})

export const objectsUpdatingDone = () => ({
  type: 'UPDATE_OBJECTS_DONE'
})

export const setWifiName = (wifiName) => ({
	type: 'SET_WIFI_NAME',
	wifiName
})

export const setTimeoutState = (timeoutState) => ({
	type: 'TIMEOUT_STATE',
	timeoutState
})

export const selectSpace = (selectedSpace) => ({
  type: 'SELECT_SPACE',
  selectedSpace
})

export const selectSpaceIcon = (icon) => ({
  type: 'SELECT_SPACE_ICON',
  icon
})

export const selectTab = (tabName) => ({
  type: 'SELECT_TAB',
  tabName
})


export const selectRoomIcon = (icon) => ({
  type: 'SELECT_ROOM_ICON',
  icon
})

export const initRoomDefaultIcon = (icon) => ({
  type: 'INIT_ROOM_DEFAULT_ICON',
})

export const selectSceneIcon = (icon) => ({
  type: 'SELECT_SCENE_ICON',
  icon
})

export const editSceneName = (sceneName) => ({
  type: 'EDIT_SCENE_NAME',
  sceneName
})

export const changeSceneListEdit = (isEdit) => ({
  type: 'CHANGE_EDIT_STATE',
  isEdit
})

export const changeDeleteSceneIds = (deleteSceneIds) => ({
  type: 'DELETE_SCENE_IDS',
  deleteSceneIds
})

export const changeEditSceneId = (editSceneId) => ({
  type: 'CHANGE_EDIT_SCENE_ID',
  editSceneId
})

export const changeSelectStatus = (selectStatus) => ({
  type: 'CHANGE_SELECT_STATUS',
  selectStatus
})

export const setSceneRuleItem = (sceneRuleItems) => ({
  type: 'SET_SCENE_RULE_ITEM',
  sceneRuleItems
})

export const setControlDeviceId = (controlDeviceId) => ({
  type: 'SET_CONTROL_DEVICE_ID',
  controlDeviceId
})

export const setSceneList = (scenes) => ({
  type: 'SET_SCENE_LIST',
  scenes
})

export const setSceneItems = (sceneItems) => ({
  type: 'SET_SCENE_ITEMS',
  sceneItems
})

export const setRefreshSceneList = (isRefreshList) => ({
  type: 'SET_REFRESH_SCENE_LIST',
  isRefreshList
})

export const changeBackAction = (backDone) => ({
  type: 'CHANGE_BACK_ACTION',
  backDone
})

export const  changeFromPage = (fromPage) => ({
	type: 'CHANGE_FROM_PAGE',
	fromPage
})

export const changeIsAllChecked =  (isChecked) => ({
	type: 'CHANGE_IS_ALL_SELECTED',
	isChecked
})

export const changeIsAllOn =  (isAllOn) => ({
	type: 'CHANGE_IS_ALL_ON',
	isAllOn
})

export const setEditRuleItems =  (editRuleItems) => ({
	type: 'SET_EDIT_RULE_ITEMS',
	editRuleItems
})

export const setEditDeviceItems =  (editDeviceItems) => ({
	type: 'SET_EDIT_DEVICE_ITEMS',
	editDeviceItems
})

export const setAllBulbDeviceItems =  (allBulbDeviceItems) => ({
	type: 'SET_ALL_BLUB_DEVICE_ITEM',
	allBulbDeviceItems
})

export const setIsTouchList =  () => ({
	type: 'SET_IS_TOUCH_LIST'
})

export const clearIsTouchList =  () => ({
	type: 'CLEAR_IS_TOUCH_LIST'
})

export const setPlayType = (playType) => ({
	type: 'SET_PLAY_TYPE',
	playType
})

export const setDataState = (dataState) => ({
	type: 'SET_DATA_STATE',
	dataState
})

export const setPlayTime = (playTime) => ({
	type: 'SET_PLAY_TIME',
	playTime
})

export const setPauseTime = (pauseTime) => ({
	type: 'SET_PAUSE_TIME',
	pauseTime
})
