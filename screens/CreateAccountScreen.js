import React from 'react';
import { Button, View, StyleSheet, Text, Alert, ActivityIndicator, Picker } from 'react-native';
import { TextInput } from 'react-native-paper';
import { observer, inject } from 'mobx-react';

const Space = ({ children, margin = 8 }) => (
  <View style={{ marginVertical: margin }}>
    {children}
  </View>
);

@inject('ApplicationState')
@observer
class CreateAccountScreen extends React.Component {
  state = {
    username: '',
    password: '',
    age: 13,
    sex: '--',
    location: ''
  };
  _fakeFetch = async ({ username, password }) => {
    console.log({ username, password })
    await new Promise(resolve => setTimeout(resolve, 2000));
    const passed = Math.random() > 0.5;
    console.log({ passed })
    return passed;
  }
  _createAccount = ({ username, password, age, location, sex }) => {
    const { socket } = this.props.ApplicationState;
    return new Promise(resolve => {
      console.log(socket)
      socket.emit('client:create-account', {
        username,
        password,
        age,
        location,
        sex
      }, response => {
        console.log({
          response
        });
        resolve(response);
      })
    });
  }
  _validateInputs = () => {
    const fieldLengthValidations = {
      username: [4, 13],
      password: [4, 13],
      location: [2, 13],
      sex: [1],
      age: [2]
    };
    const values = this.state;
    console.log(values);
    const onlyAscii = /^[\x00-\x7F]+$/;
    return Object.keys(fieldLengthValidations).map(field => {
      const value = values[field];
      const [min, max] = fieldLengthValidations[field];
      if (value.length < min) {
        return `${field} must be at least ${min} characters`;
      } else if (value.length > max) {
        return `${field} must be less than ${max} characters`;
      } else if (!onlyAscii.test(value)) {
        return `found weird characters in the ${field} input`;
      }
    }).filter(Boolean);
  };
  _submit = async () => {

    this.setState({
      inProgress: true
    })

    const validationErrors = this._validateInputs();
    if (validationErrors.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.setState({
        inProgress: false
      });
      return Alert.alert(
        'FAILURE',
        validationErrors[0],
      );
    }

    console.log(this.state.username, this.state.password);
    const { username, password, age, location, sex } = this.state;
    const { success, authToken, reason } = await this._createAccount({
      username,
      password,
      age,
      location,
      sex
    });
    this.setState({
      inProgress: false
    });
    if (success) {
      this.props.ApplicationState.loggedIn = true;
      this.props.ApplicationState.user = {
        username,
        password,
        age,
        location,
        sex,
        authToken
      };
      Alert.alert(
        'SUCCESS',
        `Create account successful!  Welcome, ${username}.`,
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
        `Create account failed: ${reason}`,
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
          <Text style={{ fontSize: 28, marginTop: 20 }}>Create Account</Text>
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
          <Text>Location</Text>
          <TextInput 
            style={{ height: 20, borderColor: 'gray', borderWidth: 1, paddingVertical: 5 }} 
            textContentType={'username'}
            autoCapitalize={'none'}
            value={this.state.location}
            onChangeText={location => this.setState({ location })}
          />
        </Space>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text>Sex</Text>
            <Picker
              selectedValue={this.state.sex}
              style={{ height: 50, width: 100 }}
              onValueChange={(itemValue, itemIndex) => this.setState({ sex: itemValue })}>
              {
                [
                  '--',
                  'M',
                  'F',
                  'Yes Plz'
                ].map(val => (
                  <Picker.Item label={val} value={val} />
                ))
              }
            </Picker>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Age</Text>
            <Picker
              selectedValue={this.state.age}
              style={{ height: 50, width: 100 }}
              onValueChange={(itemValue, itemIndex) => this.setState({ age: itemValue })}>
              {
                Array(88).fill().map((v, i) => i + 13).map(num => (
                  <Picker.Item label={num.toString()} value={num.toString()} />
                ))
              }
            </Picker>
          </View>
        </View>
        
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

export default CreateAccountScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  sideBySide: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,

    borderWidth: 3,
    borderColor: 'black'
  }
});