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
  
export default mongoose.model('Room', roomSchema);