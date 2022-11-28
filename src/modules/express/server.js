import fs from 'fs';
import {Logger} from '../../utils/logger.js';
import http from 'http';
import https from 'https';

const PORT = process.env.API_PORT || 4040;
/**
 * NodeJs ExpressJs entry point, this will bring the express server alive
 * */
export const bootstrap = async (App) => {
    let server;
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
        const options = {
            key: fs.readFileSync('/etc/letsencrypt/live/'+ process.env.DOMAIN +'/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/'+ process.env.DOMAIN +'/fullchain.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/'+ process.env.DOMAIN +'/chain.pem'),
        };

        server = https.createServer(options, App);
    } else {
        server = http.createServer(App);
    }
    return server;
};
export const init = async (expressServer) => {
    expressServer.listen(PORT, '0.0.0.0', (err) => {
        if (err) return Logger.error(err.message);
        const host = Logger.format(process.env.DOMAIN +':'+ PORT + process.env.API_PREFIX, 'underline');
        Logger.log(`Application API is now up and running on ${host}`);
    });
};
