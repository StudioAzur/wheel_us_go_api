import express, {Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { usersRouter, authRouter } from './routes/index';
import cookieParser from "cookie-parser";
import { roomsRouter } from './routes/rooms';


const app = express();

// loads .env file contents into process.env
dotenv.config();

const PORT = process.env.PORT
const MONGO_DB = process.env.MONGO_DB

const connect = async() => {
    try {
        await mongoose.connect(`${MONGO_DB}`)
        console.log('Connection to mongoDB successful');
    } catch (error) {
        throw(error)
    }
}

//middlewares
app.use(cors());
// allow to send json
app.use(cookieParser())
app.use(express.json());

app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)

app.use('/api/rooms', roomsRouter)
app.use('/api/groups', (req: Request, res: Response) => {
    res.send('groups endpoint')
})


// allow to send a customized object error when an error occurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'Something went wrong';
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        // stack give more details about the error
        stack: err.stack
    })
})

app.listen(PORT, () => {
    connect();
    console.log(`app is running on port ${PORT}`);
})