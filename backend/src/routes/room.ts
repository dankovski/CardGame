import express from 'express';
import Room from '../models/room.js';
import roomDetails from '../models/roomDetails.js';

const router = new express.Router();

router.put('/room', async (req, res) => {
	if (!req.body.name) {
		return res.status(400).json({
			message: 'Missing name' 
		});
	}

	const room = new Room({
		name: req.body.name,
		description: req.body.description,
		isPrivate: req.body.password ? true : false
	});

	try {
		await room.save();
		const thisRoomDetails = await roomDetails.findById(room.get('roomDetails'));
		thisRoomDetails.set('password', req.body.password);
		res.status(201).json(room);
	} catch (err) {
		res.status(400).json({
			message: err.message 
		});
	}
});

export default router;