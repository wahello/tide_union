import homeApi from '../jssdk/home';
import { executeSQL, querySQL } from '../jssdk/db';


function fetchProductInfoCache() {
  return dispatch => {
    return querySQL('SELECT * FROM tb_lds_cache WHERE name="home_cache"').then(res => {
      console.log('fetch home cache');
      dispatch(fetchProductInfoSucces({
        
      }));

      return res;
    }).catch(e => {
      
    })
  }
}

function fetchProductInfoSucces(product) {

  return {
    type: 'FETCH_Product_Info_SUCCESS',
    product,
  };
}

function fetchProductInfoFailure(err) {
  return {
    type: 'FETCH_Product_Info_FAILURE',
    err,
  };
}

export function fetchProductInfo(request) {
  return(dispatch) => {
    dispatch({
      type: 'FETCH_Product_Info_REQUEST',
    });
    return homeApi.getProductInfo(request)
      .then((res) => {

        // 请求失败
        if(res.code != 200) {
          dispatch(fetchProductInfoFailure(res));
          return;
        }

        // 数据再处理
        const productList = res.data || [];
        const items = {};
        productList.map((item) => {
              items[item.productId] = item;
            });

        dispatch(fetchProductInfoSucces({
//          items,
        //  list
//        productList
        items
        }));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchProductInfoFailure(err));
      });
  }
}