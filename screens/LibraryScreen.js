import React from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  Button
} from 'react-native';

import LibraryPlayer from '../components/LibraryPlayer';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Library',
  };
  state = {
    playingFile: null,
    recentUploads: [],
  }
  componentDidMount() {
    this.props.screenProps.socket.emit('client:request-recent-uploads');
    this.props.screenProps.socket.on('server:recent-uploads', recentUploads => {
      // setTimeout(() => {
        console.log('recentUploads', recentUploads);
        this.setState({ recentUploads });
      // }, 3000);
    });
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