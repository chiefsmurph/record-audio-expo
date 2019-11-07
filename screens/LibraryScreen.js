import React from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  Button,
  View
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
    clickCount: 0
  }
  componentDidMount() {
    const { socket } = this.props.ApplicationState;
    socket.emit('client:request-recent-uploads');
    socket.on('server:recent-uploads', recentUploads => {
        this.setState({ recentUploads });
        // console.log(JSON.stringify(recentUploads, null, 2));
    });
  }
  componentWillUnmount() {
    // console.log('library unmounts')
  }
  render() {
    console.log('welcome to library screen')
    const navigation = this.props.navigation;
    const { playingFile, recentUploads, clickCount } = this.state;
    // console.log(this.props.screenProps)
    return (
      <>
        <Text style={{ fontSize: 28, margin: 5 }}>Public Feed</Text>
        {/* <View
          style={{
            marginVertical: 4,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        /> */}
        <FlatList
          data={recentUploads.slice(0, 50)}
          renderItem={({ item }) => (
            <Button
              title={item.slice(0, item.lastIndexOf('.'))}
              onPress={() => this.setState({ playingFile: item, clickCount: clickCount + 1 })}
              />
          )}
        />
        {
          playingFile && (
            <View style={{ paddingVertical: 10 }}>
              <Text style={{ paddingHorizontal: 10 }}>{playingFile}</Text>
              <LibraryPlayer playingFile={playingFile} key={playingFile + clickCount} />
            </View>
          )
        }
      </>
    );
  }
}
export default ProfileScreen;