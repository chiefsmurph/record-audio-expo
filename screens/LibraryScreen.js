import React from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  Button,
  View,
  StyleSheet
} from 'react-native';
import { observer, inject } from 'mobx-react';
import LibraryPlayer from '../components/LibraryPlayer';

@inject('ApplicationState')
@observer
class LibraryScreen extends React.Component {
  static navigationOptions = {
    title: 'Library',
  };
  state = {
    playingFile: null,
    clickCount: 0,
  }
  componentDidMount() {
    const { socket, loggedIn } = this.props.ApplicationState;
  }
  componentWillUnmount() {
    // console.log('library unmounts')
  }
  render() {
    console.log('welcome to library screen')
    const navigation = this.props.navigation;
    const { playingFile, clickCount } = this.state;
    let { feed } = this.props.ApplicationState;
    console.log('render library', feed)
    feed = feed.map(upload => ({
      ...upload,
      displayText: upload.user.username + ' - ' + upload.name
    }));
    return (
      <>
        <Text style={{ fontSize: 28, marginHorizontal: 20, marginTop: 20, marginBottom: 10 }}>Public Feed</Text>
        {/* <View
          style={{
            marginVertical: 4,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        /> */}
        <FlatList
          data={feed.slice(0, 50)}
          renderItem={({ item }) => (
            <Button
              color={item.isPrivate ? 'orange' : 'blue'}
              title={item.displayText}
              onPress={() => this.setState({ playingFile: item, clickCount: clickCount + 1 })}
              />
          )}
        />
        {
          playingFile && (
            <View style={{ paddingVertical: 15 }}>
              <View style={styles.sideBySide}>
                <View>
                  <Text style={{ paddingHorizontal: 10 }}>{playingFile.user.username}</Text>
                  <Text style={{ paddingHorizontal: 10 }}>{playingFile.user.age} / {playingFile.user.sex} / {playingFile.user.location}</Text>
                </View>
                <View>
                  <Text style={{ paddingHorizontal: 10 }}>{playingFile.name}</Text>
                </View>
              </View>
              {/* <Text style={{ paddingHorizontal: 10 }}>{playingFile.displayText}</Text> */}
              <LibraryPlayer playingFile={playingFile.fileName} key={playingFile + clickCount} />
            </View>
          )
        }
      </>
    );
  }
}


const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   paddingVertical: 10,
  //   paddingHorizontal: 5,
  // },
  sideBySide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingVertical: 10,
    paddingHorizontal: 5,

    // borderWidth: 3,
    // borderColor: 'black',
    paddingBottom: 40
  }
});

export default LibraryScreen;