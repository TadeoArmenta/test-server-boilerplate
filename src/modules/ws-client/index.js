import {WebSocket} from 'ws';

export const createSocketWSClient = async (endPoint) => new WebSocket( endPoint );
export const addEventToWSClient = async (client, eventName, onEvent) => client.on(eventName, onEvent);
