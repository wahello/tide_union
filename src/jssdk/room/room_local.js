import * as db from '../db';
import uuidv4 from 'uuid/v4';

const TB_SPACE = 'space';
export default {
  addRoom(req) {
    const { name, icon, homeId } = req;
    const uuid = uuidv4();
    return db.insert(TB_SPACE, {
      id: uuid,
      name,
      icon,
      parent_id: homeId,
    }).then(res => ({
      code: res.code,
      data: {
        roomId: uuid,
      },
    }));
  },

  deleteRoom(req) {
    return db.deleteData(TB_SPACE, `id=${req.roomId}`);
  },

  update(req) {
    const { name, icon, roomId } = req;
    return db.update(
      TB_SPACE,
      {
        name,
        icon,
      },
      'id=',
      [roomId],
    );
  },

  getRoomList(req) {
    return db.querySQL(`SELECT rowid, id, name, icon FROM ${TB_SPACE} WHERE parent_id='${req.homeId}'`).then((res) => {
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

