import * as db from '../db';
import uuidv4 from 'uuid/v4';

const TB_SPACE = 'space';
export default {
  createFamily(data) {
    const { name, icon, currentMeshName, currentMeshPassword } = data;
    return db.insert(TB_SPACE, {
      id: uuidv4(),
      name,
      icon,
      mesh_name: currentMeshName,
      mesh_password: currentMeshPassword
    });
  },

  familyList() {
    return db.querySQL(`SELECT id, name, icon, mesh_name, mesh_password FROM ${TB_SPACE} WHERE parent_id ISNULL`).then((res) => {
      if (res.code == 200) {
        const { code, data } = res;
        console.log("familyt:========"+data);
        return {
          code,
          data: {
            homes: data.map((item) => {
              const newItem = { ...item };
              newItem.homeId = item.id;
              newItem.currentMeshName = item.mesh_name;
              newItem.currentMeshPassword = item.mesh_password;
              return newItem;
            }),
          },
        };
      }

      return res;
    });
  },

  editHome(data) {
    const { name, icon, homeId } = data;
    return db.update(
      TB_SPACE,
      {
        name,
        icon,
      },
      'id=?',
      [homeId],
    );
  },
};

