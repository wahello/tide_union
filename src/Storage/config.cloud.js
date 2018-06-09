export const DBNAME = 'db_lds_smarthome';
export const TABLES = {
  tb_lds_cache: `(
    name varchar(50) UNIQUE,
    value text
    )`,
};
