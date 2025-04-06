import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const server = http.createServer(app);


const PORT = process.env.PORT || 8080;


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})