import React from 'react';
import { Button, View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react';
// import Icon from 'react-native-vector-icons/Foundation';
import { Foundation, FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';

const wait = (ms = 1400) => new Promise(resolve => setTimeout(resolve, ms));

@inject('ApplicationState')
@observer
class WelcomeScreen extends React.Component {
  state = {
    loadingStatus: null,
    loginSuccess: null
  }
  _preloadSuccessIcon = () => {
    return Font.loadAsync(FontAwesome.font);
  }
  async componentDidMount() {
    const { hasInit } = this.props.ApplicationState;
    if (!hasInit) {
      this.setState({
        loadingStatus: 'Initializing'
      });
      await wait();
      await this._preloadSuccessIcon();
      this.props.ApplicationState.hasInit = true;
    }
    const { authorize, user: { username, authToken }} = this.props.ApplicationState;
    console.log(typeof authorize, 'username', username)
    if (username && authToken) {
      this.setState({
        loadingStatus: 'Logging you back in'
      })
      const response = await authorize();
      console.log({ response})
      const { success } = response;
      await wait();
      if (success) {
        this.setState({
          loginSuccess: true,
          loadingStatus: `Welcome back, ${username}`
        });
        await wait();
        this.props.navigation.navigate('App')
      } else {
        Alert.alert(
          'FAILURE',
          'There is an issue with your auth token.  Clear your cache and login again.'
        );
      }
    }
    this.setState({
      loadingStatus: null
    })
  }
  // _authToken = async ({ username, authToken }) => {
  //   const { socket } = this.props.ApplicationState;
  //   return new Promise(resolve => {
  //     console.log(socket)
  //     socket.emit('client:auth-token', {
  //       username,
  //       authToken
  //     }, response => {
  //       console.log({
  //         response
  //       });
  //       resolve(response);
  //     })
  //   });
  // }
  render() {
    console.log(this.props.navigation);
    const { loadingStatus, loginSuccess } = this.state;
    if (loadingStatus) {
      return (
        <View style={[styles.container, { justifyContent: 'center' }]}>
          {
            loginSuccess
              ? (
                <Foundation color={'green'} size={95} name={'check'}/> 
              )
              : (
              <ActivityIndicator 
                size="large" 
                color="#0000ff"
                style={[
                  {
                    transform: [{ scale: 2 }],
                    marginBottom: 30
                  }
                ]} />
              )
          }
          
          <Text style={{ fontSize: 23 }}>{loadingStatus}...</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 28 }}>Welcome to record-audio-expo</Text>
        <Button title={'Sign In'} onPress={() => this.props.navigation.navigate('SignIn')} />
        <Button title={'Create Account'} onPress={() => this.props.navigation.navigate('CreateAccount')} />
      </View>
      
    )
  }
}

export default WelcomeScreen;


const styles = StyleSheet.create({
  container: {
    // borderRadius: 4,
    // borderWidth: 3,
    // borderColor: 'orange',
    flex: 1,



    justifyContent: 'space-between',
    // flex-direction: column;
    // text-align: center;

    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'center',
    marginVertical: 300
    // height: 100
    // minWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
    // maxWidth: (ICON_PLAY_BUTTON.width + ICON_STOP_BUTTON.width) * 3.0 / 2.0,
  }
});