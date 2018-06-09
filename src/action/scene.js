import Scene from '../jssdk/scene';
import { executeSQL, querySQL } from '../jssdk/db';

function fetchSceneListFailure(err) {
  return {
    type: 'FETCH_SCENE_LIST_FAILURE',
    err,
  };
}

function fetchSceneListSucces(scene) {
  return {
    type: 'FETCH_SCENE_LIST_SUCCESS',
    scene,
  };
}

export function initSceneData() {
  return (dispatch, getState) => {
    dispatch({
      type: 'INIT_SCENE_DATA'
    });
  }
}

export function fetchSceneList(request){
	const isRefreshList = true;
	return (dispatch, getState) => {
    const handleData = function handleFetchedData(res) {
      let sceneItems = [];
      const list = res.data;
      for(let i = 0; i < res.data.length; i++){
        sceneItems[res.data[i].sceneId] = res.data[i];
      }
            
      return {
        list,
        sceneItems
      }
    }

    dispatch({
      type: 'SET_REFRESH_SCENE_LIST',
      isRefreshList
    });

    const { mqttStatus } = getState().system;
    if(!mqttStatus) {
      return querySQL(`SELECT value FROM tb_lds_cache WHERE name='scene_cache_${request.homeId}'`).then(res => {
        if(res.code === 200 && res.data.length) {
          dispatch(fetchSceneListSucces(handleData(JSON.parse(res.data[0].value))));
        }
      });
    }
    
    const sceneApi = new Scene();
    
    return sceneApi.list(request)
    .then((res) => {
    	console.log("Scene List Request  = " ,res);
      // 请求失败
      if (res.code != 200) {
        dispatch(fetchSceneListFailure(res));
        return;
      }

      querySQL(`SELECT value FROM tb_lds_cache WHERE name='scene_cache_${request.homeId}'`).then(r => {
        if(r.code === 200 && r.data.length) {
          executeSQL(`UPDATE tb_lds_cache SET value='${JSON.stringify(res)}' WHERE name='scene_cache_${request.homeId}'`);
          return;
        }

        executeSQL(`INSERT INTO tb_lds_cache(name, value) VALUES('scene_cache_${request.homeId}', '${JSON.stringify(res)}')`);
      });

      let sceneItems = [];
      const list = res.data;
      for(let i = 0; i < res.data.length; i++){
      	sceneItems[res.data[i].sceneId] = res.data[i];
      }
      
      console.log("Scene List Request  list = " ,list);
      console.log("Scene List Request  sceneItem = " ,sceneItems);
      
      dispatch(fetchSceneListSucces(handleData(res)));
      
    })
    .catch((err) => {
      dispatch(fetchSceneListFailure(err));
    });
  }
}

