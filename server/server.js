

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';

const app = express();
/**middleware */
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '50mb' })); // Increase the limit
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port=8080;

app.get('/',(req,res)=>{
    res.status(201).json("Home Get Request");
});

/**api routes */
app.use('/api',router);

connect().then(()=>{
    try{
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        })
    }catch(error){
        console.log('cannot connect to the server');
    }
}).catch(error=>{
    console.log("Invalid database connection");
})  