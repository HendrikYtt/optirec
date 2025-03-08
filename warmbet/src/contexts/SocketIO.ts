import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { makeContext } from '../lib/context';

localStorage.debug = '*';

const socket = io('https://pusher.optirec.ml', {
    autoConnect: true,
});
socket.on('error', (...args) => console.log('test', ...args));

export const [SocketIOProvider, useSocketIO] = makeContext(() => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const subscribe = (event: string, callback: () => unknown) => {
        socket.on(event, callback);
        return () => {
            socket.off(event, callback);
        };
    };

    return { isConnected, subscribe };
});
