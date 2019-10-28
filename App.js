import React from 'react';
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import initSocket from './utils/init-socket';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';

class App extends React.Component {
  state = {
    parentState: 'testiddsng testing',
    socket: null,
    recentUploads: []
  }

  componentDidMount() {
    const socket = initSocket();
    this.setState({ socket });
  }

  render() {
    const AppContainer = createAppContainer(MainScreenNavigator);
    return (
        <AppContainer screenProps={this.state} />
    );
  }
}

const MainScreenNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Library: { screen: LibraryScreen },
});

// const App = createAppContainer(MainNavigator);

export default App;
