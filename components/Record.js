import React from 'react';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import {
  Dimensions,
  Image,
  Slider,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const RecordIcon = (
  <MaterialCommunityIcon 
    // style={[{color: tintColor}]} 
    size={25} 
    name={'record-rec'}
  />
);  

const recordingSettings = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  // web: (() => {
  //   const mimes = [
  //     {
  //       mimeType: 'audio/mp4;codecs="mp4a.40.5"', // MPEG-4 HE-AAC v1
  //       audioBitsPerSecond: 64000,
  //       bitsPerSecond: 64000,
  //       extension: '.m4a',
  //     },
  //     {
  //       mimeType: 'audio/mp4;codecs="mp4a.40.2"', // MPEG-4 AAC LC
  //       audioBitsPerSecond: 64000,
  //       bitsPerSecond: 64000,
  //       extension: '.m4a',
  //     },
  //     {
  //       mimeType: 'audio/webm;codecs="opus"',
  //       audioBitsPerSecond: 64000,
  //       bitsPerSecond: 64000,
  //       extension: '.webm',
  //     },
  //     {
  //       mimeType: 'audio/webm;codecs="vp8"',
  //       audioBitsPerSecond: 64000,
  //       bitsPerSecond: 64000,
  //       extension: '.webm',
  //     },
  //     {
  //       mimeType: 'audio/webm',
  //       audioBitsPerSecond: 64000,
  //       bitsPerSecond: 64000,
  //       extension: '.webm',
  //     },
  //     {
  //       mimeType: 'audio/mpeg', // Support depends on polyfill
  //       audioBitsPerSecond: 128000,
  //       bitsPerSecond: 128000,
  //       extension: '.mp3',
  //     },
  //   ]

  //   for (let index = 0; index < mimes.length; index++) {
  //     const mime = mimes[index]

  //     if (window.MediaRecorder.isTypeSupported(mime.mimeType)) {
  //       return mime
  //     }
  //   }

  //   return false;
  // })(),
};

export default class Record extends React.Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
    };
    // // UNCOMMENT THIS TO TEST maxFileSize:
    // this.recordingSettings.android['maxFileSize'] = 12000;
  }

  componentDidMount() {
    this._askForPermissions();
  }

  componentWillUnmount() {
    // console.log('unmounting record');
    this._onStopPressed();
  }

  _askForPermissions = async () => {
    console.log('asking');
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === 'granted',
    });
  };

  _updateScreenForSoundStatus = status => {
    if (status.isLoaded) {
      this.setState({
        soundDuration: status.durationMillis,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      });
    } else {
      this.setState({
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      });
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    try {

    } catch (e) {

    }
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const fileURI = this.recording.getURI();
    const info = await FileSystem.getInfoAsync(fileURI);
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound, status } = await this.recording.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
    this.props.onSetAudioFile(fileURI);
  }

  _onRecordPressed = () => {
    this.props.onSetAudioFile(null);
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.sound != null) {
      this.sound.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.sound != null) {
      this.sound.setIsMutedAsync(!this.state.muted);
    }
  };

  _onVolumeSliderValueChange = value => {
    if (this.sound != null) {
      this.sound.setVolumeAsync(value);
    }
  };

  _trySetRate = async (rate, shouldCorrectPitch) => {
    if (this.sound != null) {
      try {
        await this.sound.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async value => {
    this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
  };

  _onPitchCorrectionPressed = async value => {
    this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
  };

  _onSeekSliderValueChange = value => {
    if (this.sound != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.sound.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.sound != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.soundDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playFromPositionAsync(seekPosition);
      } else {
        this.sound.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return this.state.soundPosition / this.state.soundDuration;
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getPlaybackTimestamp() {
    if (
      this.sound != null &&
      this.state.soundPosition != null &&
      this.state.soundDuration != null
    ) {
      return `${this._getMMSSFromMillis(this.state.soundPosition)} / ${this._getMMSSFromMillis(
        this.state.soundDuration
      )}`;
    }
    return '';
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }
  render() {
    const { state } = this;
    const recordText = this.state.isPlaybackAllowed 
      ? 'Start Recording ' // 'Rerecord'
      : (this.state.isRecording ? 'Stop' : 'Start') + ' Recording';
    return (
      <View style={styles.container}>
        {/* <Text>Record some audio</Text> */}
        {/* <Text>{JSON.stringify(state, null, 2)}</Text> */}
        <View style={styles.recordContainer}>
          <TouchableHighlight
            onPress={this._onRecordPressed}
            disabled={this.state.isLoading}>
            <View style={styles.recordContainer}>
              <MaterialCommunityIcon 
                // style={[{color: tintColor}]} 
                size={85} 
                name={this.state.isRecording ? 'stop' : 'record-rec'}
              />
              <Text>{recordText}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={[styles.playbackContainer, { opacity: this.state.isPlaybackAllowed ? 1 : 0 }]}>
          <Slider
            style={styles.playbackSlider}
            // trackImage={ICON_TRACK_1.module}
            // thumbImage={ICON_THUMB_1.module}
            value={this._getSeekSliderPosition()}
            onValueChange={this._onSeekSliderValueChange}
            onSlidingComplete={this._onSeekSliderSlidingComplete}
            disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
          />
          <Text style={[styles.playbackTimestamp]}>
            {this._getPlaybackTimestamp()}
          </Text>
          <View style={styles.playStopContainer}>
            <TouchableHighlight
              // underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={this._onPlayPausePressed}
              disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>
              {/* <Image
                style={styles.image}
                source={this.state.isPlaying ? ICON_PAUSE_BUTTON.module : ICON_PLAY_BUTTON.module}
              /> */}
              <Text style={{ padding: 20 }}>{this.state.isPlaying ? 'Pause' : 'Play'}</Text>
            </TouchableHighlight>
            {/* <TouchableHighlight
              // underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={this._onStopPressed}
              disabled={!this.state.isPlaybackAllowed || this.state.isLoading}>
              <Text>STOP</Text>
            </TouchableHighlight> */}
          </View>
        </View>
      </View>
    );
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
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    // backgroundColor: BACKGROUND_COLOR,
    // minHeight: DEVICE_HEIGHT,
    // maxHeight: DEVICE_HEIGHT,
  },
  recordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // noPermissionsText: {
  //   textAlign: 'center',
  // },
  // wrapper: {},
  // halfScreenContainer: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   alignSelf: 'stretch',
  //   minHeight: DEVICE_HEIGHT / 2.0,
  //   maxHeight: DEVICE_HEIGHT / 2.0,
  // },
  // recordingContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   alignSelf: 'stretch',
  //   minHeight: ICON_RECORD_BUTTON.height,
  //   maxHeight: ICON_RECORD_BUTTON.height,
  // },
  // recordingDataContainer: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   minHeight: ICON_RECORD_BUTTON.height,
  //   maxHeight: ICON_RECORD_BUTTON.height,
  //   minWidth: ICON_RECORD_BUTTON.width * 3.0,
  //   maxWidth: ICON_RECORD_BUTTON.width * 3.0,
  // },
  // recordingDataRowContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   minHeight: ICON_RECORDING.height,
  //   maxHeight: ICON_RECORDING.height,
  // },
  playbackContainer: {
    // borderRadius: 4,
    // borderWidth: 3,
    // borderColor: 'red',
    alignSelf: 'stretch',
    alignItems: 'center',
    // alignSelf: 'stretch',
    // minHeight: 100,
    // maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  // liveText: {
  //   color: LIVE_COLOR,
  // },
  // recordingTimestamp: {
  //   paddingLeft: 20,
  // },
  playbackTimestamp: {
    textAlign: 'right',
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  // image: {
  //   backgroundColor: BACKGROUND_COLOR,
  // },
  // textButton: {
  //   backgroundColor: BACKGROUND_COLOR,
  //   padding: 10,
  // },
  // buttonsContainerBase: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },
  // buttonsContainerTopRow: {
  //   maxHeight: ICON_MUTED_BUTTON.height,
  //   alignSelf: 'stretch',
  //   paddingRight: 20,
  // },
  playStopContainer: {
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // minWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
    // maxWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
  },
  // volumeContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   minWidth: DEVICE_WIDTH / 2.0,
  //   maxWidth: DEVICE_WIDTH / 2.0,
  // },
  // volumeSlider: {
  //   width: DEVICE_WIDTH / 2.0 - ICON_MUTED_BUTTON.width,
  // },
  // buttonsContainerBottomRow: {
  //   maxHeight: ICON_THUMB_1.height,
  //   alignSelf: 'stretch',
  //   paddingRight: 20,
  //   paddingLeft: 20,
  // },
  // rateSlider: {
  //   width: DEVICE_WIDTH / 2.0,
  // },
});