import {addEventToWSClient, createSocketWSClient} from './index.js';
import {Logger} from '../../utils/logger.js';
const scope = 'WebSocketsClient';

export const createSimpleWSClient = async () => {
    const client = {connect: null, disconnect: null, wsClient: null};
    const createConnection = async () => {
        const client = await createSocketWSClient(process.env.WS_ENDPOINT || 'ws://localhost:4040/ws');
        /* Initial connection event */
        const onOpen = () =>{
            Logger.log(`We are connected to ${process.env.WS_ENDPOINT || 'ws://localhost:4040/ws'}`, scope);
            client.transmit = (eventName, data) => {
                client.send(JSON.stringify({event: eventName, payload: data}));
            };
        };
        /* All messages get here */
        const onMessage = (e) =>{
            try {
                const data = JSON.parse(e);
                if (data.event === 'Registered') {
                    Logger.log(`Registered with id ${data.payload.id} at ${new Date()}`, scope);
                    client.id = data.payload.id;
                }
                /* Here we can put controllers */
            } catch (e) {
                Logger.error(`Error Serializing socket message: ${e.message} on ${e.toString()}`, scope);
            }
        };
        /* Close and re-instantiate */
        const onClose = (e) => {
            if (e.code > 1000) {
                Logger.log(`Socket is closed. Reconnect will be attempted in 1 second.', ${new Date}, ${e.reason}`, scope);
                setTimeout(async () => {
                    client.wsClient = await createConnection();
                }, (process.env.WS_HEARTBIT / 3));
            }
        };
        /* Send the close signal on error */
        const onError = (err) =>{
            Logger.error(`Socket encountered error: , ${err.message}, 'Closing socket'`, scope);
            client.close(3000, err.message);
        };
        await addEventToWSClient(client, 'open', onOpen);
        await addEventToWSClient(client, 'message', onMessage);
        await addEventToWSClient(client, 'close', onClose);
        await addEventToWSClient(client, 'error', onError);
    };
    client.wsClient = await createConnection();
    client.connect = createConnection;
    client.disconnect = ()=>client.wsClient = null;
    return client;
};