import mongoose from 'mongoose';

const roomDetailsSchema = new mongoose.Schema({
	password: {
		type: String,
		required: false
	},
	ownerId: { 
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	users: {
		type: [mongoose.Schema.Types.ObjectId],
		required: true 
	},
	maxPlayers: {
		type: Number,
		required: true,
		default: 4
	}
});


export default mongoose.model('RoomDetails', roomDetailsSchema);