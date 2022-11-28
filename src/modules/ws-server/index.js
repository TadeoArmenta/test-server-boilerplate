import {WebSocketServer} from 'ws';


export const createWsServer = async () => new WebSocketServer({noServer: true});

export const createStandAloneWsServer = async (config) => new WebSocketServer(config);
export const addEventToServer = async (server, event, onEvent) => server.on(event, onEvent);
