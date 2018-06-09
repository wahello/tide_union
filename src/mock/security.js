export default {
  getStatusReq: {
    ack: {
      code: 200
      },
      payload: {
        status: 2,
        remaining: 0,
        deffer: 30
      }
  },

  setArmModeReq: {
    ack: {
      code: 200,
    },
    payload: {

    }
  },

  getSecurityRuleReq: {
    "service": "Security",
    "method": "getSecurityRuleResp",
    "seq": "123456",
    "srcAddr": " x.xxxxxxx",
    "payload": {
        "securityId": "xxxx",
        "securityType": "stay",
        "enabled": 0,
        "defer": 30,
        "if": {
          "trigger": [
            {
              "idx":  0,
              "trigType": "dev",
              "devId": "100005",
              "attr": "occupancy ",
              "compOp": "== ",
              "value":  "1",
            },
          ]
        },
        "then": [
         {
            "idx":  0,
            "thenType": "dev",
            "id": "103017",
            "attr": 
            {
              WarningMode: 1,
              Strobe: 1,
              WarningDuration:30,
              SirenLevel: 1
            }
          },
        ]
    },
    "ack": {
        "code": 200,
        "desc": "Success"
    }
  },

  setArmModeReq: {
    ack: {
      code: 200
    },
    payload: {
      status: 5,
      trigger: [
        {
          devId: '00001'
        },
        {
          devId: '00002'
        }
      ]
    }
  },

  setSecurityRuleReq: {
    ack: {
      code: 200
    }
  }
}