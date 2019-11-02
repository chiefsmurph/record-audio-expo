import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

const Space = ({ children, margin = 8 }) => (
  <View style={{ marginVertical: margin }}>
    {children}
  </View>
);

class SignInScreen extends React.Component {
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
          />
        </Space>
        <Space>
          <Text>Password</Text>
          <TextInput 
            style={{ height: 20, borderColor: 'gray', borderWidth: 1, paddingVertical: 5 }} 
            textContentType={'password'}
            secureTextEntry={true}
          />
        </Space>
        <Space>
          <Button title='Submit' />
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