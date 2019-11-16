import React from 'react';
import { version } from '../config';
import { Button, View, StyleSheet, Text } from 'react-native';
import Record from '../components/Record';
import Upload from '../components/Upload';

class HomeScreen extends React.Component {
  state = {
    audioFile: null,
    recordKey: 0,
    uploading: false
  }
  render() {
    const { navigate } = this.props.navigation;
    const { audioFile, recordKey, uploading } = this.state;
    return (
      <View style={styles.homeContainer}>
        <Text>Version: {version}</Text>
        { !uploading && (
          <Record 
            onSetAudioFile={audioFile => this.setState({ audioFile })} 
            key={recordKey} 
          />
        )}
        <View style={{ flex: 1, opacity: audioFile ? 1 : 0 }}>
          <Upload 
            uri={audioFile} 
            setUploading={uploading => this.setState({ uploading })}
            onSuccess={() => {
              this.setState(({ recordKey }) => ({
                audioFile: null,
                recordKey: recordKey + 1,
                uploading: false
              }));
              navigate('Public')
            }}
            key={recordKey} 
          />
        </View>
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  homeContainer: {
    // borderRadius: 4,
    // borderWidth: 3,
    // borderColor: 'orange',
    flex: 1,



    // justify-content: center;
    // flex-direction: column;
    // text-align: center;

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // minWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
    // maxWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
  }
});