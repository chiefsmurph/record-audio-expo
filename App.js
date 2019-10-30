import React from 'react';
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
// import initSocket from './utils/init-socket';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';
import { observer, Provider } from 'mobx-react';
import ApplicationState from './mobx/ApplicationState';

@observer
class App extends React.Component {
  render() {
    const AppContainer = createAppContainer(MainScreenNavigator);
    return (
        <Provider ApplicationState={ApplicationState}>
          <AppContainer/>
        </Provider>
    );
  }
}

const MainScreenNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Library: { screen: LibraryScreen },
});

// const App = createAppContainer(MainNavigator);

export default App;
