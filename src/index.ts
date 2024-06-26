import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database/dataSource';
import { identifyContact } from './controller/contactController';

const app = express();
app.use(express.json());

const PORT=process.env.PORT || 3000;

AppDataSource.initialize().then(() => {
    app.post('/identify', identifyContact);

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch(error => console.log(error));
