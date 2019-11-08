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



class TypeNameModal extends React.Component {
  state = {
    text: '',
    query: 'apple'
  }
  render() {
    const { visible, setName, onCancel } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
      >
        <View style={{ margin: 60, padding: 20 }}>
          <Text style={{ fontSize: 20 }}>Type a name for your recording...</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 5 }}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
            autoFocus={true}
          />
          <Text>Public recording?</Text>
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
          />
              
          <Button
            title={'Complete Upload'}
            onPress={() => setName(this.state.text)}
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
    showingModal: false,
    name: undefined,
    uploading: false
  }
  _onSetName = async name => {
    Keyboard.dismiss();

    setTimeout(() => {
      this.props.setUploading(true)
    
      this.setState({
        name,
        uploading: true,
        showingModal: false
      }, this._uploadFile);
    }, 200);
    
  }

  _uploadClick = () => {
    this.setState({
      showingModal: true
    });
  }
    

  _uploadFile = async () => {
    const { uri } = this.props;
    console.log('uploading', uri);
    // extract the filetype
    let fileType = uri.substring(uri.lastIndexOf(".") + 1);
    // let fileName = uri.substring(uri.lastIndexOf("/") + 1);

    let formData = new FormData();

    const { username, authToken } = this.props.ApplicationState.user;
    const name = `${username} - ${this.state.name}.${fileType}`
    formData.append("audioFile", {
      uri,
      name,
      type: `audio/${fileType}`
    });

    formData.append("name", this.state.name);
    formData.append("fileType", fileType);
    formData.append("username", username);
    formData.append("authToken", authToken);

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
    this.props.onSuccess();
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
    const { showingModal, uploading } = this.state;
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
          visible={showingModal}
          setName={this._onSetName} 
          onCancel={() => {
            Keyboard.dismiss();
            setTimeout(() => this.setState({ showingModal: false }), 200);
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
  }
});