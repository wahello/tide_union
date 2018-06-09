const stateInit = {
  isFetching: false,
  currentId: '',
  err: null,
  list: [],
  items: {}
};

function product(state = stateInit, action) {
  switch (action.type) {
    // 请求中
    case 'FETCH_Product_Info_REQUEST':
      return { ...state,
        isFetching: true
      };
    // 请求成功
    case 'FETCH_Product_Info_SUCCESS':
    console.log("往reduce里面存信息设备表");


		console.log(action.product);
      return { ...state,
        isFetching: false,
//      currentId: action.product.list[0], // TODO: 设置当前家庭ID
//      list: action.product,
        items: action.product.items
      };
    // 请求失败
    case 'FETCH_Product_Info_FAILURE':
      return { ...state,
        isFetching: false,
        err: action.err
      };
    default:
      return state;
  }
}

export default product;