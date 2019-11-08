import React from 'react';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LibraryScreen from './screens/LibraryScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import SignInScreen from './screens/SignInScreen';
// import initSocket from './utils/init-socket';

import { StatusBar, View, Text, StyleSheet, SafeAreaView, Platform, AppState } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  }
});

@observer
class App extends React.Component {
  componentDidMount() {
    AppState.addEventListener('change', async state => {
      console.log('AppState changed to', state);
      if (state === 'active') {
        await ApplicationState.authorize();
      } else if (state === 'background') {
        ApplicationState.loggedIn = false;
      }
    })
  }
  render() {
    const AppContainer = createAppContainer(MainSwitchNavigator);
    return (
      <Provider ApplicationState={ApplicationState}>
        <View style={styles.container}>
          <AppContainer/>
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
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {  
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Material style={[{color: tintColor}]} size={25} name={'face'}/>  
        </View>
      ),
    }
  },
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
}, { initialRouteName: 'Home' });


const MainSwitchNavigator = createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack,
});




// const App = createAppContainer(MainNavigator);

export default App;