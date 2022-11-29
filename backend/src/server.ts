import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.BACKEND_PORT;
const MONGO_DB_URL = `mongodb://${process.env.MONGODB_ADMIN_USERNAME}:${process.env.MONGODB_ADMIN_PASSWORD}@mongo:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE_NAME}?authSource=admin`;

await mongoose.connect(MONGO_DB_URL, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: true,
	name: 'sesID'
}));
app.use(cors({
	origin: 'http://localhost:3000',
	methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
	exposedHeaders: ['sesID'],
	credentials: true
}));

app.use('/user', userRouter);

app.listen(PORT, '0.0.0.0');