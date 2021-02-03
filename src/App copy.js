import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';

import HomeScreen from './screens/HomeScreen';
import MoreScreen from './screens/MoreScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SigninScreen';
import OtpVerifyScreen from './screens/auth/OtpVerifyScreen';
import OtpVerifySignin from './screens/auth/OtpVerifySignin';

import {GetUser} from './util/LocalStorage';

function getInitialScreen() {
  GetUser().then((userData) => {
    if(userData != null){
      console.log(`GetUser: ${userData.token}`);
      return 'App';
    }else{
      console.log(`user is not avilable`);
      return 'Auth';
    }
  });
}


const MainStack = createDrawerNavigator({
  Home: HomeScreen,
  More: MoreScreen
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Signup: SignupScreen,
  OtpVerify: OtpVerifyScreen,
  OtpVerifyS: OtpVerifySignin
},
{
  defaultNavigationOptions: {
    header: null
  }
});
const RootSwitch = createAnimatedSwitchNavigator({
  Auth: AuthStack,
  App: MainStack
},
{
  // The previous screen will slide to the bottom while the next screen will fade in
  transition: (
    <Transition.Together>
      <Transition.Out
        type="slide-left"
        durationMs={300}
        interpolation="easeOut"
      />
      {/*<Transition.In type="fade" durationMs={500} />*/}
    </Transition.Together>
  ),
  //initialRouteName: getInitialScreen()
});

const App1 = createAppContainer(RootSwitch);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return App1;
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
export default App1;
