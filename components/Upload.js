import React from 'react';
import {
  Text,
  TouchableHighlight,
  Alert,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';


const ENDPOINT = 'http://107.173.6.167:500/upload';



class TypeNameModal extends React.Component {
  state = {
    text: ''
  }
  render() {
    const { visible, setName } = this.props;
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
          <Button
            title={'Complete Upload'}
            onPress={() => setName(this.state.text)}
          />
        </View>
      </Modal>
    );
  }
};


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

    formData.append("audioFile", {
      uri,
      name: `${this.state.name}.${fileType}`,
      type: `audio/${fileType}`
    });

    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    await fetch(ENDPOINT, options);
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
          setName={this._onSetName} />
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