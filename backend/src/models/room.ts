/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from 'mongoose';
import roomDetails from './roomDetails.js';
import generateInviteCode from '../helpers/inviteCodeGenerator.js';

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true
	},
	inviteCode: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	isPrivate: {
		type: Boolean,
		default: false
	},
	roomDetails: { 
		type: mongoose.Schema.Types.ObjectId,
		ref: 'RoomDetails'
	},
	isHidden: {
		type: Boolean,
		default: false
	}
}, {
	versionKey: false 
});


roomSchema.pre('save', async function () {

	if (this.isNew) {
		const thisRoomDetails = new roomDetails({
			ownerId: this.get('_id'),
			users: [this.get('_id')]
		});
		await thisRoomDetails.save();
		this.set('roomDetails', thisRoomDetails.id);
		this.set('inviteCode', generateInviteCode());
	}

});

roomSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj._id;
	delete obj['roomDetails'];
	delete obj['isHidden'];
	return obj;
};
  
roomSchema.query.listVisibleRooms = async function (page, pageSize) {
	return await this.find({
		'isHidden': false
	})	.populate('roomDetails')
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.then(async (rooms) => {
			return await new Promise(async (resolve) =>{
				const listVisibleRooms: Array<object> = [];
				for (let index = 0; index < rooms.length; index += 1) {
					const obj = rooms[index].toObject();
					obj['maxPlayers'] = rooms[index].roomDetails.maxPlayers;
					obj['numberOfPlayers'] = rooms[index].roomDetails.users?.length;
					delete obj._id;
					delete obj['roomDetails'];
					delete obj['isHidden'];
					listVisibleRooms.push(obj);
					if (index === rooms.length - 1) {
						resolve(listVisibleRooms);
					}
				}
			});
		});
};

export default mongoose.model('Room', roomSchema);