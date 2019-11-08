import io from 'socket.io-client';
import { endpoint } from '../config';
import ApplicationState from '../mobx/ApplicationState';

export default () => {
  const socket = io(endpoint);
  socket.on('server:recent-uploads', feed => {
    console.log({ feed })
    ApplicationState.feed = feed;
  });
  return socket;
};