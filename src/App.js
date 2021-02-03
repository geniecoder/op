import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createStackNavigator } from 'react-navigation-stack';
import { Transition } from 'react-native-reanimated';


import HomeScreen from './screens/HomeScreen';
import MoreScreen from './screens/MoreScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SigninScreen';
import OtpVerifyScreen from './screens/auth/OtpVerifyScreen';
import OtpVerifySignin from './screens/auth/OtpVerifySignin';
import ProductList from './screens/ProductList';
import ProductScreen from './screens/ProductScreen';
import UploadPrescription from './screens/UploadPrescription';
import SpecifyMedicine from './screens/SpecifyMedicine';
import ThankYou from './screens/ThankYou';
import Splash from './screens/Splash';
import MyPrescriptions from './screens/MyPrescriptions';
import CheckoutScreen from './screens/CheckoutScreen';
import ProductSearch from './screens/ProductSearch';
import TestScreen from './screens/TestScreen';
import CartScreen from './screens/CartScreen';
import MyProfile from './screens/MyProfile';
import MyOrders from './screens/MyOrders';
import AddressList from './screens/AddressList';
import WishList from './screens/WishList';
import WalletScreen from './screens/WalletScreen';
import CouponScreen from './screens/CouponScreen';
import ViewOrderDetails from './screens/ViewOrderDetails';
import HomeProductSearch from './screens/HomeProductSearch';
import AddAddress from './screens/AddAddress';
import CitySelection from './screens/CitySelection';
import FilterScreen from './screens/FilterScreen';
import CancelOrder from './screens/CancelOrder';
import WebViewScreen from './screens/WebViewScreen';


import heartIcon from '../assets/images/icons/heart.png';
import AppColors from './values/AppColors';
import { GetUser } from './util/LocalStorage';

import { CustomDrawerComponent } from './component/CustomDrawerComponent';

console.disableYellowBox = true;

class App extends Component {

  checklogin = () => {
    GetUser().then((userData) => {
      if (userData != null) {
        console.log(`GetUser: ${userData.token}`);
        //this.props.navigation.navigate('App');
        return 'App';
      } else {
        console.log(`user is not avilable`);
        return 'Auth';
      }
    });
  }
  render() {
    const AppNavigator = createAppContainer(RootSwitch);
    return <AppNavigator />;
  }
}
/*const NavButton = (props) => {
  return (
    <TouchableOpacity onPress={() => props.navigate(props.screenName)}>
      <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}>
        <Image source={heartIcon} />
        <Text style={{ marginLeft: 20, fontSize: 16, fontFamily: "Roboto", color: AppColors.appGrayDark1 }}>My Profile</Text>
      </View>
    </TouchableOpacity>
  );
}*/
/*const CustomDrawerComponent = (props) => {
  const { navigate } = props.navigation;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: 150, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
        <Text>Title</Text>
      </View>
      <ScrollView>
        <View>
          {
          <TouchableOpacity onPress={() => {
            console.log(`home clicked`);
            navigate('ProductScreen');
          }}>
            <Text>Home</Text>
          </TouchableOpacity>
          <NavButton navigate={navigate} screenName='MoreScreen'/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}*/

const MainStack = createStackNavigator({
  Home: HomeScreen,
  ProductList: ProductList,
  MoreScreen: MoreScreen,
  ProductScreen: ProductScreen,
  UploadPresScreen: UploadPrescription,
  SpecifyMedicine: SpecifyMedicine,
  ThankYou: ThankYou,
  MyPrescriptions: MyPrescriptions,
  CheckoutScreen: CheckoutScreen,
  ProductSearch: ProductSearch,
  CartScreen: CartScreen,
  MyProfile: MyProfile,
  MyOrders: MyOrders,
  AddressList: AddressList,
  WishList: WishList,
  WalletScreen: WalletScreen,
  CouponScreen: CouponScreen,
  ViewOrderDetails: ViewOrderDetails,
  HomeProductSearch: HomeProductSearch,
  AddAddress: AddAddress,
  CityScreen: CitySelection,
  FilterScreen: FilterScreen,
  CancelOrderScreen: CancelOrder,
  WebScreen: WebViewScreen,
}
  ,
  {
    defaultNavigationOptions: {
      header: null
    }
  },
);
const DrawerNav = createDrawerNavigator({
  Drawer: MainStack
},
  {
    contentComponent: CustomDrawerComponent,
    defaultNavigationOptions: {
      header: null
    }
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



const RootSwitch = createAnimatedSwitchNavigator(
  {
    Splash: Splash,
    Auth: AuthStack,
    //App: MainStack
    App: DrawerNav
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
    initialRouteName: 'Splash'
  });
const App1 = createAppContainer(RootSwitch);
export default App1;

/* build apk

https://medium.com/codingtown/how-to-generate-apk-file-from-react-native-f4fbc923bfdb

https://stackoverflow.com/questions/35283959/build-and-install-unsigned-apk-on-device-without-the-development-server

run this command after creat some folders
npx react-native bundle --dev false --platform android --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res

after then run below command inside android folder
 cd android

./gradlew assembleDebug

./gradlew assembleRelease

*/