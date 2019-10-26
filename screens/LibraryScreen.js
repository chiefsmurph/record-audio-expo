import React from 'react';
import { Text } from 'react-native';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Your Library',
  };
  render() {
    const navigation = this.props.navigation;
    console.log({navigation});
    return (
      <Text>
        Welcome to your library.
      </Text>
    );
  }
}
export default ProfileScreen;