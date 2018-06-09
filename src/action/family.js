import userApi from '../jssdk/family';
import { executeSQL, querySQL } from '../jssdk/db';

export function initFamilyData() {
  return (dispatch) => {
    dispatch({
      type: 'INIT_FAMILY_DATA'
    });
  }
}

function fetchFamilyListSucces(family) {
  console.log('请求家列表family：', family);
  return {
    type: 'FETCH_FAMILY_LIST_SUCCESS',
    family,
  };
}

export function fetchFamilyListFailure(err) {
  return {
    type: 'FETCH_FAMILY_LIST_FAILURE',
    err,
  };
}

export function fetchFamilyList(request) {
  return (dispatch, getState) => {
    const handleData = function handleFetchedData(familyList) {
    // 数据再处理
        const list = [];
        const items = {};
        familyList.map((item) => {
          items[item.homeId] = item;
          list.push(item.homeId);
        });

        dispatch(fetchFamilyListSucces({
          items,
          list
        }));
    };
    dispatch({
      type: 'FETCH_FAMILY_LIST_REQUEST',
    });
    const { mqttStatus } = getState().system;
    querySQL('SELECT value FROM tb_lds_cache WHERE name="family_cache"').then(res => {
      if(res.code === 200 && res.data.length) {
        handleData(JSON.parse(res.data[0].value).data.homes || []);
      }
    });
    
    return userApi.familyList(request)
      .then((res) => {
        // 请求失败
        if (res.code != 200) {
          dispatch(fetchFamilyListFailure(res));
          return;
        }

        querySQL('SELECT value FROM tb_lds_cache WHERE name="family_cache"').then(r => {
          if(r.code === 200 && r.data.length) {
            executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(res)}' WHERE name='family_cache'`);
            return;
          }

          executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('family_cache','${JSON.stringify(res)}')`);
        });

        //executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(res)}' WHERE name='family_cache'`);
        //executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('family_cache','${JSON.stringify(items)}')`);

        // 数据再处理
        const list = res.data.homes || [];
        handleData(list);
        return res;
      })
      .catch((err) => {
        console.log('请求家列表失败', '222');
        return;
        dispatch(fetchFamilyListFailure(err));
      });
  }
}
