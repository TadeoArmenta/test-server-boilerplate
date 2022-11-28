import {Logger} from '../../utils/logger.js';
import {parse} from 'url';
import {createWsServer} from './index.js';
import {uuidV4} from '../../utils/common.js';


export const expressWSServer = async (httpServer, endpoints = [{path: '/ws', controller: (message)=>Logger.log(message, 'Express WS server')}]) => {
    const wsEndpoints = await Promise.all(endpoints.map(async (endpoint) => {
        endpoint.space = await createWsServer();
        endpoint.space.on('connection', function connection(connection) {
            connection.id = uuidV4();
            connection.send(JSON.stringify({event: 'Registered', payload: {id: connection.id}}));
            Logger.log(`Connection made by on ${connection._socket.remoteAddress}`, 'Express WS server');
            /* Here we setup a controller */
            connection.on('message', function message(data) {
                console.log('received: %s', data);
            });
        });
        return endpoint;
    }));
    Logger.log(`WebSockets Server started on ${process.env.WS_PORT || 4040}`, 'Express WS server');
    httpServer.on('upgrade', async function upgrade(request, socket, head) {
        Logger.log('Received upgrade request', 'Express WS server');
        const {pathname} = parse(request.url);
        for (const endpoint of wsEndpoints) {
            if (pathname === endpoint.path) {
                Logger.log('Match pathname', 'debug');
                endpoint.space.handleUpgrade(request, socket, head, function done(ws) {
                    endpoint.space.emit('connection', ws, request);
                });
            } else {
                socket.destroy();
            }
        }
    });
    return httpServer;
};
