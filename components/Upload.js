import React from 'react';
import {
  Text,
  TouchableHighlight,
  Alert
} from 'react-native';
const ENDPOINT = 'http://107.173.6.167:500/upload';

export default class Upload extends React.Component {
  _uploadFile = async () => {
    const { uri } = this.props;
    console.log('uploading', uri);
    // extract the filetype
    let fileType = uri.substring(uri.lastIndexOf(".") + 1);
    let fileName = uri.substring(uri.lastIndexOf("/") + 1);

    let formData = new FormData();

    formData.append("audioFile", {
      uri,
      name: fileName,
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
    Alert.alert(
      'SUCCESS',
      'Audio uploaded successfully!',
      [
        { text: 'OK', onPress: () => this.props.onSuccess() }
      ]
    );
  };
  render() {
    const { uri } = this.props;
    return (
      <>
        <Text>{uri}</Text>
        <TouchableHighlight onPress={this._uploadFile}>
          <Text>Upload!</Text>
        </TouchableHighlight>
      </>
    )
  }
}