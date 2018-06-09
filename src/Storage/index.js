import * as db from '../jssdk/db';
import { DBNAME, TABLES } from './config.%APP_TYPE%';

export default class Storage {
  static init() {

    db.initDataBase(DBNAME);
    Storage.initTables(TABLES);
    db.querySQL('select * from sqlite_master where type=\'table\'');
  }

  static initTables(tables) {
    const sqlStr = [];
    Object.keys(tables).forEach((tableName) => {
//      db.executeSQL(`DROP TABLE IF EXISTS ${tableName}`);//删除所有数据
      db.executeSQL(`CREATE TABLE IF NOT EXISTS ${tableName}${tables[tableName]}`);
    });
  }
}
