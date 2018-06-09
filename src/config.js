const SERVER_CONFIG = {
    development: {
      httpServer: 'http://192.168.6.115:18080',
      mqttServer: {
        ip: 'wss://192.168.6.116',
        port: '443',
      },
      BLEServer: {
          defaultMeshName: 'leedarsonmesh',
          defaultMeshPassword: '123',
          defaultOurMeshName: 'BLE MESH'
      }
    },
  
    production: {
  //  httpServer: 'http://172.24.20.222:18080',
  //  mqttServer: {
  //    ip: 'wss://172.24.20.160',
  //    port: '443',
  //  },
      httpServer: 'http://192.168.6.115:18080',
      mqttServer: {
        ip: 'wss://192.168.6.116',
        port: '443',
      },
      BLEServer: {
          defaultMeshName: 'leedarsonmesh',
          defaultMeshPassword: '123',
          defaultOurMeshName: 'BLE MESH'
      }
    },
  };

export default {
  ...SERVER_CONFIG[process.env.NODE_ENV],
};
