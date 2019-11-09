import React from 'react';
import { Button, View, StyleSheet, Text, Alert, ActivityIndicator, AsyncStorage, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { observer, inject } from 'mobx-react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LibraryPlayer from '../components/LibraryPlayer';

const Space = ({ children, margin = 8 }) => (
  <View style={{ marginVertical: margin }}>
    {children}
  </View>
);

@inject('ApplicationState')
@observer
class Profile extends React.Component {
  state = {
    profileData: null,
    playingFile: null,
    clickCount: 0
  };
  _logout = async () => {
    await AsyncStorage.clear();
    this.props.ApplicationState.user = {};
    this.props.navigation.navigate('Welcome');
  };
  componentDidMount() {
    const userToLookup = this.props.username || this.props.ApplicationState.user.username;
    console.log({ userToLookup })
    this.props.ApplicationState.socket.emit(
      'client:request-profile', 
      userToLookup,
      profileData => this.setState({ profileData })
    );
  }
  render() {
    const { playingFile, profileData, clickCount } = this.state;
    if (!profileData) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator 
            size="large" 
            color="#0000ff"
            style={[
              {
                transform: [{ scale: 2 }],
                marginBottom: 30
              }
            ]} />
        </View>
      )
    }
    let { 
      user: {
        username,
        age,
        location,
        sex
      },
      publicMessages
    } = profileData;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>{username}</Text>
        <Text style={{ fontSize: 16 }}>{age} / {location} / {sex}</Text>
        <View
          style={{
            marginTop: 4,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />

        <FlatList
          data={publicMessages.slice(0, 50)}
          renderItem={({ item }) => (
            <Button
              color={item.isPrivate ? 'orange' : 'blue'}
              title={item.name}
              onPress={() => this.setState({ playingFile: item, clickCount: clickCount + 1 })}
              />
          )}
        />

        {
          playingFile && (
            <View style={{ paddingVertical: 15 }}>
              <View style={styles.sideBySide}>
                {/* <View> */}
                  {/* <Text style={{ paddingHorizontal: 10 }}>{playingFile.user.username}</Text> */}
                  {/* <Text style={{ paddingHorizontal: 10 }}>{playingFile.user.age} / {playingFile.user.sex} / {playingFile.user.location}</Text> */}
                {/* </View> */}
                {/* <View> */}
                  <Text style={{ paddingHorizontal: 10 }}>{playingFile.name}</Text>
                {/* </View> */}
              </View>
              {/* <Text style={{ paddingHorizontal: 10 }}>{playingFile.displayText}</Text> */}
              <LibraryPlayer playingFile={playingFile.fileName} key={playingFile + clickCount} />
            </View>
          )
        }

        <Space>
          <TouchableOpacity onPress={this._logout} hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
            <Text>Click here to log out</Text>
          </TouchableOpacity>
        </Space>
        
      </View>
    )
  }
}

export default Profile;


const styles = StyleSheet.create({
  container: {
    padding: 10,
    textAlign: 'center'
    // flex: 1,
    // justifyContent: 'center',
    // flexDirection: 'row',
    // alignItems: 'center',
  },

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