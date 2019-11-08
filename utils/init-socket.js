import io from 'socket.io-client';
import { endpoint } from '../config';

export default () => {
  const socket = io(endpoint);
  return socket;
};