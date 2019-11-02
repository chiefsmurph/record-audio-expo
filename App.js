import React from 'react';
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import SignInScreen from './screens/SignInScreen';
// import initSocket from './utils/init-socket';

import { StatusBar, View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { observer, Provider } from 'mobx-react';
// import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
 
console.log(getStatusBarHeight());

import ApplicationState from './mobx/ApplicationState';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

@observer
class App extends React.Component {
  render() {
    const AppContainer = createAppContainer(MainSwitchNavigator);
    return (
      <Provider ApplicationState={ApplicationState}>
        <View style={styles.container}>
          <AppContainer />
        </View>
      </Provider>
      
    );
  }
}


const AuthStack = createSwitchNavigator({
  Welcome: WelcomeScreen,
  CreateAccount: CreateAccountScreen,
  SignIn: SignInScreen
});


const AppStack = createMaterialBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {  
      tabBarLabel: 'Record Audio',
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Icon style={[{color: tintColor}]} size={25} name={'md-recording'}/>  
        </View>
      ),
    }
  },
  Library: {
    screen: LibraryScreen,
    navigationOptions: {  
      tabBarLabel: 'Library',
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Icon style={[{color: tintColor}]} size={25} name={'md-list'}/>  
        </View>
      ),
    }
  },
});


const MainSwitchNavigator = createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack,
});




// const App = createAppContainer(MainNavigator);

export default App;