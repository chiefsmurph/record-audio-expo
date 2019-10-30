import React from 'react';
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
// import initSocket from './utils/init-socket';

import { StatusBar, View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { observer, Provider } from 'mobx-react';
// import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
 
console.log(getStatusBarHeight());

import ApplicationState from './mobx/ApplicationState';


// const Root = styled.View`
// flex: 1;
// background-color: ${props => props.theme.BLACK};
// `;

// const StatusBarAndroid = styled.View`
// height: 24;
// background-color: ${props => props.theme.BLACK};
// `;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

// const styles = StyleSheet.create({
//   paddingTop: 40,
// });

@observer
class App extends React.Component {
  render() {
    const AppContainer = createAppContainer(MainScreenNavigator);
    return (
      <Provider ApplicationState={ApplicationState}>
        <View style={styles.container}>
          <Text>Hello World</Text>
          <AppContainer style={{ paddingTop: 20, backgroundColor: 'black' }} />
        </View>
          {/* <Text>Hello</Text> */}
          {/* <AppContainer style={{ paddingTop: 20, backgroundColor: 'black' }} /> */}
      </Provider>
      
    );
  }
}

const MainScreenNavigator = createMaterialBottomTabNavigator({
  Home: { screen: HomeScreen },
  Library: { screen: LibraryScreen },
});

// const App = createAppContainer(MainNavigator);

export default App;