import io from 'socket.io-client';
const ENDPOINT = 'http://89376b9f.ngrok.io';

export default () => {
  const socket = io(ENDPOINT);
  return socket;
};