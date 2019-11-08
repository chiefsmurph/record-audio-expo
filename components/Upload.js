import React from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  Keyboard,
  Switch
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer, inject } from 'mobx-react';
import Autocomplete from 'react-native-autocomplete-input';

import { endpoint } from '../config';


class SelectUserModal extends React.Component {
  state = {
    username: '',
    query: 'apple'
  }
  render() {
    const { visible, setUser, onCancel } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
      >
        <View style={{ margin: 60, padding: 20 }}>
          <Text style={{ fontSize: 20 }}>Type a username to send your message to...</Text>
          <TextInput
            autoCapitalize={'none'}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            autoFocus={true}
          />
          {/* <Text>Public recording?</Text>
          <Switch
            onValueChange={() => {}}
            value={true}
            onTintColor={'orange'}
            tintColor={'grey'}
          />

          <Autocomplete
            data={['apple', 'pie', 'couch']}
            // defaultValue={'apple'}
            onChangeText={text => this.setState({ query: text })}
            renderItem={({ item, i }) => (
              <TouchableOpacity onPress={() => this.setState({ query: item })}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          /> */}
              
          <Button
            title={'Send Private Message'}
            onPress={() => setUser(this.state.username)}
          />
          
          <Button
            style={{ marginTop: 20 }}
            color={'red'}
            title={'Go Back'}
            onPress={onCancel}  
          />
        </View>
      </Modal>
    );
  }
};


class TypeNameModal extends React.Component {
  state = {
    name: '',
    query: 'apple',
    isPrivate: false
  }
  render() {
    const { visible, onSend, onCancel } = this.props;
    const { isPrivate } = this.state;
    const buttonText = `Send ${isPrivate ? 'private' : 'public'} message`;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
      >
        <View style={{ margin: 60, padding: 20 }}>
          <Text style={{ fontSize: 20 }}>Type a name for your recording...</Text>
          <TextInput
            autoCapitalize={'none'}
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            autoFocus={true}
          />

          <View style={styles.horizontal}>
            <Text>Private recording?</Text>
            <Switch
              onValueChange={isPrivate => this.setState({ isPrivate })}
              value={this.state.isPrivate}
              trackColor={'orange'}
            />
          </View>

          <Autocomplete
            data={['apple', 'pie', 'couch']}
            // defaultValue={'apple'}
            onChangeText={text => this.setState({ query: text })}
            renderItem={({ item, i }) => (
              <TouchableOpacity onPress={() => this.setState({ query: item })}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
              
          <Button
            title={buttonText}
            onPress={() => onSend({
              name: this.state.name,
              isPrivate: this.state.isPrivate
            })}
          />
          
          <Button
            style={{ marginTop: 20 }}
            color={'red'}
            title={'Cancel'}
            onPress={onCancel}  
          />
        </View>
      </Modal>
    );
  }
};

@inject('ApplicationState')
@observer
export default class Upload extends React.Component {
  state = {
    showingTypeNameModal: false,
    showingSelectUserModal: false,
    name: undefined,
    isPrivate: false,
    uploading: false,
    recipientUser: null
  }
  _onSend = () => {
    const { recipientUser, isPrivate } = this.state;
    if (!isPrivate || recipientUser) {
      this._beginUpload();
    } else {
      this.setState({
        showingSelectUserModal: true
      });
    }
  };
  _beginUpload = () => {
    Keyboard.dismiss();

    setTimeout(() => {
      this.props.setUploading(true)
    
      this.setState({
        uploading: true,
        showingTypeNameModal: false,
        showingSelectUserModal: false
      }, this._uploadFile);
    }, 200);
  };
  _onSetUser = async username => {
    this.setState({ recipientUser: username }, this._onSend);
    console.log({ username}, 'set');
  };

  _uploadClick = () => {
    this.setState({
      showingTypeNameModal: true
    });
  }
    

  _uploadFile = async () => {
    const { uri, onSuccess } = this.props;
    console.log('uploading', uri);
    // extract the filetype
    let fileType = uri.substring(uri.lastIndexOf(".") + 1);
    // let fileName = uri.substring(uri.lastIndexOf("/") + 1);


    const {
      name,
      isPrivate,
      recipientUser
    } = this.state;

    let formData = new FormData();
    

    const { username, authToken } = this.props.ApplicationState.user;
    const audioName = `${username} - ${name}.${fileType}`
    formData.append("audioFile", {
      uri,
      name: audioName,
      type: `audio/${fileType}`
    });


    formData.append("name", name);
    formData.append("fileType", fileType);
    formData.append("username", username);
    formData.append("authToken", authToken);
    formData.append("isPrivate", isPrivate);
    formData.append("recipientUser", recipientUser);

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    await fetch(`${endpoint}/upload`, options);
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.setState({
      uploading: false
    })
    onSuccess();
    Alert.alert(
      'SUCCESS',
      'Audio uploaded successfully!',
      // [
      //   { 
      //     text: 'OK', 
      //     onPress: () => {
            
      //     }
      //   }
      // ]
    );
    
  };
  render() {
    const { uri } = this.props;
    const { showingTypeNameModal, showingSelectUserModal, uploading } = this.state;
    return (
      <View style={styles.container}>
        {
          !uploading 
            ? (
              <TouchableHighlight onPress={this._uploadClick}>
                <View style={styles.container}>
                  <MaterialCommunityIcon
                    size={85} 
                    name={'upload'}
                  />
                  <Text>Upload!</Text>
                </View>
              </TouchableHighlight>
            )
          : (
            <>
              <ActivityIndicator 
                size="large" 
                color="#0000ff"
                style={[
                  {
                    transform: [{ scale: 2 }],
                    marginBottom: 30
                  }
                ]} />
              <Text>Upload in progress...</Text>
            </>
          )
        }
        <TypeNameModal 
          visible={showingTypeNameModal}
          onSend={({ name, isPrivate }) => {
            this.setState({
              name,
              isPrivate
            }, this._onSend)
          }}
          onCancel={() => {
            Keyboard.dismiss();
            setTimeout(() => this.setState({ showingTypeNameModal: false }), 200);
          }} />
        <SelectUserModal 
          visible={showingSelectUserModal}
          setUser={this._onSetUser} 
          onCancel={() => {
            Keyboard.dismiss();
            setTimeout(() => this.setState({ showingSelectUserModal: false }), 200);
          }} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  // emptyContainer: {
  //   alignSelf: 'stretch',
  //   backgroundColor: BACKGROUND_COLOR,
  // },
  container: {

    // borderRadius: 4,
    // borderWidth: 3,
    // borderColor: 'green',


    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    // backgroundColor: BACKGROUND_COLOR,
    // minHeight: DEVICE_HEIGHT,
    // maxHeight: DEVICE_HEIGHT,
  },

  horizontal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 70
  }
});