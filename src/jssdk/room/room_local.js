import * as db from '../db';
import uuidv4 from 'uuid/v4';

const TB_SPACE = 'space';
export default {
  addRoom(req) {
    const { name, icon, homeId } = req;
    const uuid = uuidv4();
    return db.querySQL(`SELECT * FROM ${TB_SPACE} WHERE parent_id='${homeId}' and name='${name}' and type='room'`).then((res) => {
    	console.log("查询房间是否存在 = ",res);
	     if (res.code === 200) {
	     		if(res.data && res.data.length > 0){
	     			return {
				      code: -1000,
				      desc:"The name of the room has already existed",
				    };
	     		} else {
	     			return db.insert(TB_SPACE, {
				      id: uuid,
				      name,
				      icon,
				      parent_id: homeId,
				      type:"room"
				    }).then(res => ({
				      code: res.code,
				      desc:"Success",
				      data: {
				        roomId: uuid,
				      },
				    }));
	     		}
       }
    });
    
  },

  deleteRoom(req) {
    db.deleteData(TB_SPACE, 'id=?',[req.roomId]).then((res) => {
    	console.log("res Code = ",res);
    	return db.deleteData("space_device",'space_id=?',[req.roomId]);
    });
  },

  update(req) {
    const { name, icon, roomId } = req;
    console.log("update  roomId=",roomId);
    return db.querySQL(`SELECT * FROM ${TB_SPACE} WHERE name='${name}' and type='room' and id!='${roomId}'`).then((res) => {
    	console.log("查询房间是否存在 = ",res);
	     if (res.code === 200) {
	     		if(res.data && res.data.length > 0){
	     			return {
				      code: -1000,
				      desc:"The name of the room has already existed",
				    };
	     		} else {
	     			return db.update(
				      TB_SPACE,
				      {
				        name,
				        icon,
				      },
				      'id=?',
				      [roomId],
				    );
	     		}
       }
    });
    
    
  },

  getRoomList(req) {
    return db.querySQL(`SELECT rowid, id, name, icon FROM ${TB_SPACE} WHERE parent_id='${req.homeId}' and type='room'`).then((res) => {
      if (res.code === 200) {
        const { code, data } = res;
        return {
          code,
          data: {
            rooms: data.map((item) => {
              const newItem = { ...item };
              newItem.roomId = item.id;
              return newItem;
            }),
          },
        };
      }

      return res;
    });
  },
};

