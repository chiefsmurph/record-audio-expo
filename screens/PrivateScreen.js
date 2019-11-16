import React from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  View,
  StyleSheet,
  Modal
} from 'react-native';
import { observer, inject } from 'mobx-react';
import LibraryPlayer from '../components/LibraryPlayer';
import Profile from '../components/Profile';


function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

class ProfileModal extends React.Component {
  render() {
    const { username, onClose } = this.props;
    console.log('profile', {
      username
    })
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={!!username}
      >
        <Button title={'Close Profile'} onPress={onClose} />
        <Profile username={username}/>
      </Modal>
    );
  }
}


@inject('ApplicationState')
@observer
class PublicScreen extends React.Component {
  // static navigationOptions = {
  //   title: 'Library',
  // };
  state = {
    playingFile: null,
    clickCount: 0,
    showingProfile: null
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
    const { playingFile, clickCount, showingProfile } = this.state;
    let { feed: { private: privateFeed } } = this.props.ApplicationState;
    // console.log('render library', feed)
    privateFeed = privateFeed.map(upload => ({
      ...upload,
      displayText: upload.user.username + ' - ' + upload.name
    }));
    return (
      <>
        <Text style={{ fontSize: 28, marginHorizontal: 20, marginTop: 20, marginBottom: 10 }}>Private Messages {showingProfile}</Text>
        {/* <View
          style={{
            marginVertical: 4,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        /> */}
        <FlatList
          data={privateFeed.slice(0, 50)}
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
                  {/* <Button title={playingFile.user.username} onPress={() => {
                      console.log('btn')
                      this.setState({ showingProfile: playingFile.user.username })
                    }} /> */}
                  <TouchableHighlight 
                    style={[{ height: 48 }]}
                    title={playingFile.user.username}
                    onPress={() => {
                      console.log('pressed')
                      this.setState({ showingProfile: playingFile.user.username })
                    }}
                  >
                    {/* <Text style={{ paddingHorizontal: 10 }}>{playingFile.user.username}</Text> */}
                    <View>
                      <Text style={{ paddingHorizontal: 10 }}>{playingFile.user.username}</Text>
                      <Text style={{ paddingHorizontal: 10 }}>{playingFile.user.age} / {playingFile.user.sex} / {playingFile.user.location}</Text>
                    </View>
                  </TouchableHighlight>
                </View>
                <View>
                  <Text style={{ paddingHorizontal: 10 }}>{playingFile.name}</Text>
                  <Text style={{ paddingHorizontal: 10 }}>{formatDate(new Date(playingFile.timestamp))}</Text>
                </View>
              </View>
              {/* <Text style={{ paddingHorizontal: 10 }}>{playingFile.displayText}</Text> */}
              <LibraryPlayer playingFile={playingFile.fileName} key={playingFile + clickCount} />
            </View>
          )
        }
        <ProfileModal username={showingProfile} onClose={() => this.setState({ showingProfile: null })} />
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

    paddingBottom: 40
  },
  bordered: {

    borderWidth: 3,
    borderColor: 'black',
  }
});

export default PublicScreen;