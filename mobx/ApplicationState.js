import { observable, action } from 'mobx';
import { create, persist } from 'mobx-persist';
import { AsyncStorage } from 'react-native';

import initSocket from '../utils/init-socket';

class ApplicationStateStore {

  @observable hasInit = false;
  @observable socket = initSocket();

  @observable loggedIn = false;

  @persist('object') @observable user = {
    username: null,
    authToken: null,
    // authToken: '983ce597f9f3460c'
  }

  // @observable list = [
  //   { title: 'Go to the School', isFinished: true },
  //   { title: 'Prepare tasks for today', isFinished: false },
  //   { title: 'Team meeting', isFinished: false },
  //   { title: 'Commit tasks changed', isFinished: false }
  // ]

  // @action finishItem (index) {
  //   const copiedList = this.list.slice()
  //   const isFinished = copiedList[index].isFinished
  //   if (isFinished) return

  //   copiedList[index].isFinished = true
  //   this.list = copiedList // update store by re-assigning
  // }

  // @action deleteItem (index) {
  //   this.list = this.list.filter((item, i) => i != index)
  // }
}

const store = new ApplicationStateStore();
console.log({ store });

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true
})
hydrate('Applicationstate', store).then(() => {
  console.log(store.user);
  console.log('Applicationstate has been hydrated')
});
export default store;