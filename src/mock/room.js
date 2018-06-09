import uuidv4 from 'uuid/v4';
export default {
	addRoom: {
		code: 200,
		desc: "Success",
		data: {
			roomId: uuidv4()
		}
	},
	delRoom: {
		code: 200,
		desc: "Success",
		data: {}
	},
	editRoom: {
		code: 200,
		desc: "Success",
		data: {}
	},
	roomList: {
		code: 200,
		desc: "Success",
		data: {
			totalCount: 5,
			rooms: [ {
				roomId: 'bedroom-id_0001',
				name: 'Bedroom',
				icon: 'bedroom',
				devNum: 2,
			}, {
				roomId: 'livingRoom_id_0001',
				name: 'Livingroom',
				icon: 'living_room',
				devNum: 2,
			}, {
				roomId: 'Study_id_0001',
				name: 'Study',
				icon: 'study',
				devNum: 1,
			}, {
				roomId: 'bathroom_id_0001',
				name: 'Bathroom',
				icon: 'bathroom',
				devNum: 1,
			}, {
				roomId: 'diningRoom_id_0001',
				name: 'Diningroom',
				icon: 'dinning_room',
				devNum: 1,
			}, {
				roomId: 'outside_id_0001',
				name: 'Outside',
				icon: 'outside',
				devNum: 1,
			}, {
				roomId: 'basement_id_0001',
				name: 'Basement',
				icon: 'basement',
				devNum: 1,
			}
			// , {
			// 	roomId: 'custom_id_0001',
			// 	name: 'Custom',
			// 	icon: 'custom',
			// 	devNum: 1,
			// }
		]
		}
	}
}