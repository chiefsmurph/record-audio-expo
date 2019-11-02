import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { observer, inject } from 'mobx-react';

@inject('ApplicationState')
@observer
class WelcomeScreen extends React.Component {
  componentDidMount() {
    if (this.props.ApplicationState.loggedIn) {
      this.props.navigation.navigate('App');
    }
  }
  render() {
    console.log(this.props.navigation)
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 28 }}>Welcome to record-audio-expo</Text>
        <Button title={'Sign In'} onPress={() => { this.props.navigation.navigate('SignIn'); console.log('signin')}} />
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