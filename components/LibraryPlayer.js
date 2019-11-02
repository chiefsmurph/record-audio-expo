import React from 'react';
import {
  View,
  Slider,
  Text,
  TouchableHighlight,
  StyleSheet
} from 'react-native';
import { Audio } from 'expo-av';

class LibraryPlayer extends React.Component {

  constructor(props) {
    super(props);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      playingAudio: null,
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
    this._loadAudioAndPlay();
  }

  componentWillUnmount() {
    // console.log('unmounting');
    this._stopPlayer();
  }

  _loadAudioAndPlay = async () => {
    const { playingFile } = this.props;
    if (!playingFile) return console.log(`can't play null`);
    console.log(`loading and playin ${playingFile}`);
    this.sound = new Audio.Sound();
    this.sound.setOnPlaybackStatusUpdate(this._updateScreenForSoundStatus);
    try {
      await this.sound.loadAsync(
        { uri: `http://107.173.6.167:500/audio/${playingFile}` },
        { shouldPlay: true }
      );
      await this.sound.playAsync();
      // Your sound is playing!
    } catch (error) {
      console.error(error);
      // An error occurred!
    }
  }
  
  _stopPlayer = async () => {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
  }

  _updateScreenForSoundStatus = status => {
    // console.log('_updateScreenForSoundStatus', status);
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
    this.props.onSetAudioFile(fileURI);
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
  }

  _onRecordPressed = () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onPlayPausePressed = async () => {
    if (this.sound != null) {
      if (this.state.isPlaying) {
        this.sound.pauseAsync();
      } else {
        if (this.state.soundPosition === this.state.soundDuration) {
          await this.sound.setPositionAsync(0);
        }
        setTimeout(() => this.sound.playAsync(), 200);
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
    return (
      <>
        <View style={styles.playbackContainer}>
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
              disabled={!this.state.isPlaybackAllowed || this.state.isLoading}
              hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
            >
              {/* <Image
                style={styles.image}
                source={this.state.isPlaying ? ICON_PAUSE_BUTTON.module : ICON_PLAY_BUTTON.module}
              /> */}
              <Text style={{ paddingVertical: 5, paddingHorizontal: 30}}>{this.state.isPlaying ? 'Pause' : 'Play'}</Text>
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
      </>
    );
  }
}
export default LibraryPlayer;


const styles = StyleSheet.create({
  // emptyContainer: {
  //   alignSelf: 'stretch',
  //   backgroundColor: BACKGROUND_COLOR,
  // },
  // container: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   alignSelf: 'stretch',
  //   backgroundColor: BACKGROUND_COLOR,
  //   minHeight: DEVICE_HEIGHT,
  //   maxHeight: DEVICE_HEIGHT,
  // },
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 30
    // minHeight: ICON_THUMB_1.height * 2.0,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 100
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