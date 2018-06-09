const stateInit = {
  isFetching: false,
  currentId: '',
  err: null,
  list: [],
  items: {},
  currentMeshName: '',
  currentMeshPassword: ''
};

function family(state = stateInit, action) {
  switch (action.type) {
    case 'INIT_FAMILY_DATA':
      return stateInit;
    // 请求中
    case 'FETCH_FAMILY_LIST_REQUEST':
      return { ...state,
        isFetching: true
      };
    // 请求成功
    case 'FETCH_FAMILY_LIST_SUCCESS':
      return { ...state,
        isFetching: false,
        currentId: action.family.list[0], // TODO: 设置当前家庭ID
        list: action.family.list,
        items: action.family.items
      };
    // 请求失败
    case 'FETCH_FAMILY_LIST_FAILURE':
      return { ...state,
        isFetching: false,
        err: action.err
      };
    default:
      return state;
  }
}

export default family;