import React from 'react';
import { Button, View, StyleSheet, Text, Alert, ActivityIndicator, AsyncStorage } from 'react-native';
import { TextInput } from 'react-native-paper';
import { observer, inject } from 'mobx-react';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Space = ({ children, margin = 8 }) => (
  <View style={{ marginVertical: margin }}>
    {children}
  </View>
);

@inject('ApplicationState')
@observer
class SignInScreen extends React.Component {
  state = {
    username: '',
    password: ''
  };
  _logout = async () => {
    await AsyncStorage.clear();
    this.props.ApplicationState.user = {};
    this.props.navigation.navigate('Welcome');
  }
  render() {
    const { user } = this.props.ApplicationState;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20 }}>{JSON.stringify(user, null, 2)}</Text>
        <View
          style={{
            marginTop: 4,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />
        <TouchableOpacity onPress={this._logout} hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}>
          <Text>Click here to log out</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default SignInScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  }
});