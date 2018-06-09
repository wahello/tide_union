export const DBNAME = 'db_lds_smarthome';
export const TABLES = {
  device: `(
    id INTEGER PRIMARY KEY,
    uuid varchar(32) UNIQUE NOT NULL,
    tenant_id INTEGER DEFAULT NULL,
    name varchar(200) DEFAULT NULL,
    icon varchar(128) DEFAULT NULL,
    ip varchar(20) DEFAULT NULL,
    mac varchar(100) DEFAULT NULL,
    sn varchar(80) DEFAULT NULL,
    is_direct_device tinyint(1) DEFAULT NULL,
    business_type_id varchar(50) DEFAULT NULL,
    reality_id varchar(100) DEFAULT NULL,
    type varchar(50) DEFAULT NULL,
    communication_mode tinyint(4) DEFAULT NULL,
    extra_name varchar(100) DEFAULT NULL,
    ssid varchar(128) DEFAULT NULL,
    reset_random varchar(20) DEFAULT NULL,
    version varchar(20) DEFAULT NULL,
    create_time datetime DEFAULT NULL,
    last_update_date datetime DEFAULT NULL,
    address bigint(20) DEFAULT NULL,
    remote_groud_id bigint(20) DEFAULT NULL,
    firmware_product_id varchar(50) DEFAULT NULL
  )`,
  device_state: `(
    id INTEGER PRIMARY KEY,
    device_id varchar(32) NOT NULL,
    product_id INTEGER DEFAULT NULL,
    property_name varchar(100) DEFAULT NULL,
    property_value varchar(50) DEFAULT NULL,
    log_date datetime DEFAULT NULL,
    group_id varchar(100) DEFAULT NULL,
    property_desc varchar(100) DEFAULT NULL
  )`,
  device_status: "(\
    id INTEGER PRIMARY KEY,\
    `device_id` varchar(32) NOT NULL,\
    `on_off` tinyint(1) DEFAULT NULL,\
    `active_status` tinyint(1) DEFAULT NULL,\
    `active_time` datetime DEFAULT NULL,\
    `online_status` varchar(20) DEFAULT 'disconnected',\
    `tenant_id` INTEGER DEFAULT NULL\
  )",


  // product: "(\
  //   `id` INTEGER NOT NULL,\
  //   `device_type_id` INTEGER DEFAULT NULL,\
  //   `product_name` varchar(255) DEFAULT NULL,\
  //   `communication_mode` tinyint(4) DEFAULT NULL,\
  //   `transmission_mode` tinyint(4) DEFAULT NULL,\
  //   `create_time` datetime DEFAULT NULL,\
  //   `update_time` datetime DEFAULT NULL,\
  //   `model` varchar(255) DEFAULT NULL,\
  //   `config_net_mode` varchar(255) DEFAULT NULL,\
  //   PRIMARY KEY (`id`)\
  // )"

  // device_type: "(\
  //   `id` INTEGER NOT NULL,\
  //   `name` varchar(255) DEFAULT NULL,\
  //   `device_catalog_id` INTEGER DEFAULT NULL,\
  //   `tenant_id` INTEGER DEFAULT NULL,\
  //   `create_time` datetime DEFAULT NULL,\
  //   `update_time` datetime DEFAULT NULL,\
  //   `create_by` INTEGER DEFAULT NULL,\
  //   `update_by` INTEGER DEFAULT NULL,\
  //   `is_deleted` tinyint(4) DEFAULT NULL,\
  //   `vender_flag` varchar(50) DEFAULT NULL,\
  //   `type` varchar(50) DEFAULT NULL,\
  //   `description` varchar(255) DEFAULT NULL,\
  //   PRIMARY KEY (`id`)\
  //   )"

  scene: `(
    id INTEGER PRIMARY KEY,
    scene_name varchar(50) DEFAULT NULL,
    space_id INTEGER DEFAULT NULL,
    tenant_id INTEGER DEFAULT NULL,
    icon varchar(20) DEFAULT NULL,
    set_type tinyint(1) DEFAULT NULL,
    sort tinyint(1) DEFAULT NULL
  )`,

  scene_detail: `(
    id INTEGER PRIMARY KEY,
    scene_id INTEGER DEFAULT NULL,
    device_id TEXT DEFAULT NULL,
    space_id INTEGER DEFAULT NULL,
    device_type_id INTEGER DEFAULT NULL,
    target_value TEXT DEFAULT NULL,
    tenant_id INTEGER DEFAULT NULL,
    sort int(10) DEFAULT NULL
  )`,

  ifttt_rule: "(\
    id INTEGER PRIMARY KEY,\
    `name` varchar(50) DEFAULT NULL,\
    `icon` varchar(64) DEFAULT NULL,\
    `type` varchar(30) DEFAULT NULL,\
    `status` tinyint(2) DEFAULT NULL,\
    `is_multi` tinyint(2) DEFAULT '0',\
    `location_id` INTEGER DEFAULT NULL,\
    `space_id` INTEGER DEFAULT NULL,\
    `tenant_id` INTEGER DEFAULT NULL,\
    `user_id` INTEGER DEFAULT NULL,\
    `direct_id` INTEGER DEFAULT NULL,\
    `create_time` datetime DEFAULT NULL\
  )",

  //联动then
  ifttt_actuator: "(\
    id INTEGER PRIMARY KEY,\
    `name` varchar(100) DEFAULT NULL,\
    `label` varchar(100) DEFAULT NULL,\
    `properties` varchar(1000) DEFAULT NULL,\
    `device_id` varchar(32) DEFAULT NULL,\
    `rule_id` INTEGER DEFAULT NULL,\
    `position` varchar(100) DEFAULT NULL,\
    `device_type` varchar(100) DEFAULT NULL,\
    `index` int(10) DEFAULT NULL,\
    `type` varchar(30) DEFAULT NULL,\
    `delay` int(10) DEFAULT '0',\
    `tenant_id` bigint(20) DEFAULT NULL,\
    `scene_id` bigint(20) DEFAULT NULL,\
    `timer_id` bigint(20) DEFAULT NULL\
  )",

  //联动关联
  ifttt_relation: "(\
    id INTEGER PRIMARY KEY,\
    `label` varchar(255) DEFAULT NULL,\
    `type` varchar(20) DEFAULT NULL,\
    `parent_labels` varchar(1000) DEFAULT NULL,\
    `combinations` varchar(1000) DEFAULT NULL,\
    `rule_id` INTEGER DEFAULT NULL,\
    `position` varchar(255) DEFAULT NULL,\
    `tenant_id` INTEGER DEFAULT NULL\
  )",

  //联动-if
  ifttt_sensor: "(\
    id INTEGER PRIMARY KEY,\
    `name` varchar(100) DEFAULT NULL,\
    `label` varchar(100) DEFAULT NULL,\
    `properties` varchar(512) DEFAULT NULL,\
    `device_id` varchar(32) DEFAULT NULL,\
    `rule_id` INTEGER DEFAULT NULL,\
    `position` varchar(255) DEFAULT NULL,\
    `device_type` varchar(64) DEFAULT NULL,\
    `timing` varchar(512) DEFAULT NULL,\
    `index` int(10) DEFAULT NULL,\
    `type` varchar(30) DEFAULT NULL,\
    `delay` int(10) DEFAULT NULL,\
    `tenant_id` bigint(20) DEFAULT NULL\
  )",
  
  space: "(\
    `id` varchar(36) UNIQUE NOT NULL,\
    `create_time` INTEGER DEFAULT NULL,\
    `last_update_date` INTEGER DEFAULT NULL,\
    `icon` varchar(100) DEFAULT NULL,\
    `position` varchar(20) DEFAULT NULL,\
    `name` varchar(50) DEFAULT NULL,\
    `parent_id` varchar(32) DEFAULT NULL,\
    `user_id` varchar(36) DEFAULT NULL,\
    `location_id` varchar(32) DEFAULT NULL,\
    `create_by` varchar(36) DEFAULT NULL,\
    `update_by` varchar(32) DEFAULT NULL,\
    `type` varchar(10),\
    `sort` int(2) DEFAULT NULL,\
    `style` text,\
    `mesh_name` varchar(50) DEFAULT NULL,\
    `mesh_password` varchar(50) DEFAULT NULL,\
    PRIMARY KEY (`id`)\
  )",

  space_device: "(\
    `id` varchar(32) UNIQUE NOT NULL,\
    `create_time` INTEGER DEFAULT NULL,\
    `last_update_date` INTEGER DEFAULT NULL,\
    `device_id` varchar(32) DEFAULT NULL,\
    `space_id` varchar(32) DEFAULT NULL,\
    `location_id` varchar(32) DEFAULT NULL,\
    `device_category_id` varchar(32) DEFAULT NULL\
  )",
  group1_device: "(\
  	`id` INTEGER PRIMARY KEY,\
    `device_id` varchar(32) DEFAULT NULL,\
    `group_id` INTEGER DEFAULT NULL\
  )"
}