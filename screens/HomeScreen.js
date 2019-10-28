import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import Record from '../components/Record';
import Upload from '../components/Upload';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Record some audio',
  };
  state = {
    audioFile: null,
    recordKey: 0
  }
  componentDidMount() {
    // console.log(this.props.screenProps);
    
  }
  render() {
    const { navigate } = this.props.navigation;
    const { audioFile, recordKey } = this.state;
    return (
      <View style={styles.homeContainer}>
        <Button
          title="Go to the library"
          onPress={() => navigate('Library')}
        />
        <Record 
          onSetAudioFile={audioFile => this.setState({ audioFile })} 
          key={recordKey} 
        />
        {
          audioFile && (
            <Upload 
              uri={audioFile} 
              onSuccess={() => {
                this.setState(({ recordKey }) => ({
                  audioFile: null,
                  recordKey: recordKey + 1
                }));
                navigate('Library')
              }}
            />
          )
        }
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  homeContainer: {
    borderRadius: 4,
    borderWidth: 3,
    borderColor: '#d6d7da',
    // flex: 1,
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // minWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
    // maxWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
  }
});