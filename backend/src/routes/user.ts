import crypto from 'crypto';
import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

const router = new express.Router();

router.post('/register', async (req, res) => {
	if (!req.body.email || !req.body.username || !req.body.password) {
		return res.status(400).json({
			message: 'Missing fields' 
		});
	}

	const user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		activationCode: crypto.randomUUID()
	});

	try {
		await user.save();
		res.status(201).json({
			success: true 
		});
	} catch (err) {
		res.status(400).json({
			message: err.message 
		});
	}

});

router.get('/activate', async (req, res) => {
	if (!req.query.username || !req.query.activationCode) {
		return res.status(400).json({
			message: 'missing fields' 
		});
	}

	const user = await User.findOne({
		username: req.query.username 
	});
	if (user && user.status !== 'Pending') {
		return res.status(410).json({
			message: 'account already activated' 
		});
	}
	else if (user && user.activationCode === req.query.activationCode) {
		user.status = 'Active';
		await user.save();
		return res.status(200).json({
			message: 'account has been activated' 
		});
	}
	else {
		return res.status(400).json({
			message: 'incorrect data' 
		});
	}

});

router.post('/login', async function (req, res) {
	const loggedUser = await User.findOne({
		username: req.session.username 
	});
	if (loggedUser) {
		return res.status(200).json({
			username: loggedUser.username,
			email: loggedUser.email,
			avatarUrl: loggedUser.avatarUrl,
			dateCreated: loggedUser.dateCreated,
			dateUpdated: loggedUser.dateUpdated
		});
	} else if (!req.body.username || !req.body.password) {
		return res.status(400).json({
			message: 'Missing fields' 
		});
	} else {
		const user = await User.findOne({
			username: req.body.username 
		});
		if (user && await bcrypt.compare(req.body.password, user.password)) {
			req.session.username = user.username;
			return res.status(200).json({
				message: 'Logged in correctly' 
			});
		} else {
			return res.status(400).json({
				message: 'Unable to login' 
			});
		}
	}
});

router.get('/me', async function (req, res) {
	const user = await User.findOne({
		username: req.session.username 
	});
	if (user) {
		return res.status(200).json({
			username: user.username,
			email: user.email,
			avatarUrl: user.avatarUrl,
			dateCreated: user.dateCreated,
			dateUpdated: user.dateUpdated
		});
	}
	else {
		return res.status(401).json({
			message: 'Unable to authorize' 
		});
	}
});

router.get('/logout', async function (req, res) {
	req.session.destroy();
	return res.status(200).json({
		message: 'Logged out' 
	});
});

export default router;