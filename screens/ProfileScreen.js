import React from 'react';
import { Text } from 'react-native';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile Page',
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <Text>
        Welcome to Jane's profile
      </Text>
    );
  }
}
export default ProfileScreen;