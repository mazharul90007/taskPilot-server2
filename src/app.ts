import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
// import router from './app/routes';
// import httpStatus from 'http-status';
// import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import status from "http-status";
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
// import router from './app/routes';

const app: Application = express();
app.use(cors());
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "taskPilot-server server is running .."
    })
});

app.use('/api/v1', router);

// global error handeling
app.use(globalErrorHandler);


//Not Found
app.use(notFound);

export default app;