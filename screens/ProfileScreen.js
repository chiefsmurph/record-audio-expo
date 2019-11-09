import React from 'react';
import Profile from '../components/Profile';


export default class ProfileScreen extends React.Component {
  state = { keyCount: 0 };
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', this.componentDidFocus),
      // this.props.navigation.addListener('willBlur', this.componentWillBlur),
    ];
  }
  componentDidFocus = () => {
    console.log("focus");
    this.setState(({ keyCount }) => ({ keyCount: keyCount + 1 }));
  }
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  render() {
    const { keyCount } = this.state;
    return keyCount ? <Profile key={this.state.keyCount} /> : null;
  }
}