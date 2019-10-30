import React from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  Button
} from 'react-native';
import { observer, inject } from 'mobx-react';
import LibraryPlayer from '../components/LibraryPlayer';

@inject('ApplicationState')
@observer
class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Library',
  };
  state = {
    playingFile: null,
    recentUploads: [],
  }
  componentDidMount() {
    const { socket } = this.props.ApplicationState;
    socket.emit('client:request-recent-uploads');
    socket.on('server:recent-uploads', recentUploads =>
        this.setState({ recentUploads })
    );
  }
  render() {
    console.log('welcome to library screen')
    const navigation = this.props.navigation;
    const { playingFile, recentUploads } = this.state;
    // console.log(this.props.screenProps)
    return (
      <>
        <FlatList
          data={recentUploads.slice(0, 10)}
          renderItem={({ item }) => (
            <Button
              title={item}
              onPress={() => this.setState({ playingFile: item })}
              />
          )}
        />
        <LibraryPlayer playingFile={playingFile} key={playingFile} />
      </>
    );
  }
}
export default ProfileScreen;