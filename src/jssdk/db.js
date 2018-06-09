import JSBridge from './JSBridge';

const DB_SERVICE = 'DataBase';

/**
 * 初始化数据库
 * @params {Object} dbName 数据库名称
 * @return {Promise}
 */
export function initDataBase (dbName) {
  if(!dbName) {
    throw('database name can not be empty');
  }

  return JSBridge.send({
    service: DB_SERVICE,
    action: 'initDataBaseName',
    data: {
      name: dbName,
      dbVersion: 1
    }
  })
}

export function initTables () {
  let tables = []
  tables.push('CREATE TABLE IF NOT EXISTS tb_lds_cache(name varchar(50), value text)')

  return JSBridge.send({
    service: DB_SERVICE,
    action: 'executeSQL',
    data: {
      sql: tables.join(';')
    }
  })
}

/**
 * 执行SQL语句
 * @params {String} sqlStr sql查询语句
 * @return {Promise}
 */
export function executeSQL (sqlStr) {
  if (!sqlStr) {
    throw new Error('sqlStr is required.');
  }
  return JSBridge.send({
    service: DB_SERVICE,
    action: 'executeSQL',
    data: {
      sql: sqlStr
    }
  })
}

/**
 * 数据查询
 * @params {String} sqlStr sql查询语句
 * @return {Promise}
 */
export function querySQL (sqlStr) {
  if (!sqlStr) {
    throw new Error('sqlStr is required.')
  }
  return JSBridge.send({
    service: DB_SERVICE,
    action: 'querySQL',
    data: {
      sql: sqlStr
    }
  })
}

/**
 * 插入数据到表
 * @params {String} table 表名
 * @params {Object} keyVals 需要插入的数据，key为表字段
 * @return {Promise}
 */
export function insert(table, keyVals) {
  const vals = [];
  for(let key in keyVals) {
    let val = keyVals[key];
    if(val) {
      vals.push(typeof val === 'string' ? `'${val}'` : val);
    }
  }
  const sql = `INSERT INTO ${table} (${Object.keys(keyVals).join(',')}) VALUES (${vals.join(',')})`;
  return new Promise((resolve, reject) => {
    executeSQL(sql).then(res => {
      console.log("==================insert");
      if(res.code === 200) {
        querySQL(`SELECT MAX(id) as lastid FROM ${table}`).then(res1 => {
          if(res1.code == 200) {
            let lastid = 0;
            if(res1.data.length > 0){
              lastid = res1.data[0].lastid;
            }
            resolve({
              code: 200,
              data: {
                id: lastid
              }
            })
          } else {
             console.log("==================res1.code !== 200");
             resolve({
              code: -1
            })
          }
        })
      } else {
        resolve(res);
      }
    });
  });
  
}

/**
 * 更新表数据
 * @params {String} table 表名
 * @params {Object} keyVals 需要更新的数据，key为表字段
 * @params {String} whereClause 条件子句
 * @params {Array} whereArgs 条件值（用来替换where语句中的'?'）
 * @return {Promise}
 */
export function update(table, keyVals, whereClause = '', whereArgs = []) {
  let sql = `UPDATE ${table} SET `;
  let whereSql = whereClause ? `WHERE ${whereClause}` : '';
  const setItems = [];
  
  for(let key in keyVals) {
    let val = typeof keyVals[key] === 'string' ? `'${keyVals[key]}'` : keyVals[key];
    setItems.push(`${key}=${val} `);
  }

  sql += setItems.join(',');
  whereArgs.forEach(val => {
    whereSql = whereSql.replace('?', typeof val === 'string' ? `'${val}'` : val);
  })
  return executeSQL(sql + whereSql);
}

/**
 * 删除新表数据
 * @params {String} table 表名
 * @params {String} whereClause 条件子句
 * @params {Array} whereArgs 条件值（用来替换where语句中的'?'）
 * @return {Promise}
 */
export function deleteData(table, whereClause = '', whereArgs = []) {
  let sql = `DELETE FROM ${table} `;
  let whereSql = whereClause ? `WHERE ${whereClause}` : '';
  whereArgs.forEach(val => {
    whereSql = whereSql.replace('?', typeof val === 'string' ? `'${val}'` : val);
  });

  return executeSQL(sql + whereSql);
}
