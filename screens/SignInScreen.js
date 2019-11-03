import React from 'react';
import { Button, View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { observer, inject } from 'mobx-react';

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
  _fakeFetch = async ({ username, password }) => {
    console.log({ username, password })
    await new Promise(resolve => setTimeout(resolve, 2000));
    const passed = Math.random() > 0.5;
    console.log({ passed })
    return passed;
  }
  _signIn = ({ username, password }) => {
    const { socket } = this.props.ApplicationState;
    return new Promise(resolve => {
      console.log(socket)
      socket.emit('client:login', {
        username,
        password
      }, response => {
        console.log({
          response
        });
        resolve(response);
      });
    });
  }
  _submit = async () => {
    console.log(this.state.username, this.state.password);
    const { username, password } = this.state;
    this.setState({
      inProgress: true
    })
    const { success, authToken } = await this._signIn({
      username,
      password
    });
    this.setState({
      inProgress: false
    });
    if (success) {
      
      this.props.ApplicationState.user = {
        username,
        authToken
      };
      Alert.alert(
        'SUCCESS',
        `Login successful!  Welcome, ${username}. ${authToken}`,
        [
          { 
            text: 'OK', 
            onPress: () => this.props.navigation.navigate('App')
          }
        ]
      );
    } else {
      Alert.alert(
        'FAILURE',
        'Login failed',
      );
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Button title='Click here to go back' onPress={() => {
          this.props.navigation.navigate('Welcome');
          console.log(this.props.navigation)
        }} />
        <Space>
          <Text style={{ fontSize: 28, marginTop: 20 }}>Sign In</Text>
          <View
            style={{
              marginTop: 4,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
        </Space>
        <Space>
          <Text>Username</Text>
          <TextInput 
            style={{ height: 20, borderColor: 'gray', borderWidth: 1, paddingVertical: 5 }} 
            textContentType={'username'}
            autoCapitalize={'none'}
            value={this.state.username}
            onChangeText={username => this.setState({ username })}
          />
        </Space>
        <Space>
          <Text>Password</Text>
          <TextInput 
            style={{ height: 20, borderColor: 'gray', borderWidth: 1, paddingVertical: 5 }} 
            textContentType={'password'}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
        </Space>
        <Space>
          {
            this.state.inProgress
              ? <ActivityIndicator 
                  size="large" 
                  color="#0000ff"
                  style={[
                    {
                      transform: [{ scale: 2 }],
                      marginVertical: 30
                    }
                  ]} />
              : <Button title='Submit' onPress={this._submit} />
          }
          
        </Space>
      </View>
    )
  }
}

export default SignInScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  }
});