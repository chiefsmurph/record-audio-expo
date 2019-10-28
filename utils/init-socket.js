import io from 'socket.io-client';
const ENDPOINT = 'http://107.173.6.167:500';

export default () => {
  const socket = io(ENDPOINT);
  return socket;
};