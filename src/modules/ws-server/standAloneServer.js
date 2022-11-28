import {createStandAloneWsServer} from './index.js';
import {uuidV4} from '../../utils/common.js';
import {Logger} from '../../utils/logger.js';

export const websocketsStandAloneServer = async () => {
    const ws = await createStandAloneWsServer({port: process.env.WS_PORT || 4040});
    Logger.log(`WebSockets Server started on ${process.env.WS_PORT || 4040}`, 'Ws Server');
    ws.on('connection', function connection(connection) {
        connection.id = uuidV4();
        connection.send(JSON.stringify({event: 'Registered', payload: {id: connection.id}}));
        Logger.log(`Connection made by on ${connection._socket.remoteAddress}`, 'Ws Server');
        /* Here we setup a controller */
        connection.on('message', function message(data) {
            console.log('received: %s', data);
        });
    });
    return ws;
};
