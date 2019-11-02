import { observable, action } from 'mobx'
import initSocket from '../utils/init-socket';

class ApplicationStateStore {

  @observable socket = initSocket();

  @observable loggedIn = true;

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
export default store;