import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  Library: {screen: LibraryScreen},
});

const App = createAppContainer(MainNavigator);

export default App;
