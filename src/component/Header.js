import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, Image, TouchableOpacity } from 'react-native';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';

import logoWhite from '../../assets/images/brand/ola-pharmacy-white.png';
import backIcon from '../../assets/images/icons/left-arrow.png';
import notiIcon from '../../assets/images/icons/notifications-button.png';
import cartIcon from '../../assets/images/icons/cart-icon.png';
import editIcon from '../../assets/images/icons/edit-2.png';
import addIcon from '../../assets/images/icons/plus-button-small.png'
import ProductDataManager from '../util/ProductDataManager';
import { PreviousRouteName } from '../util/Methods';


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 30 : StatusBar.currentHeight;

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.iconsView = this.iconsView.bind(this);
  }

  /*componentWillReceiveProps({ someProp }) {
    this.setState({})
  }*/

  goBack() {
    //const {goBack} = this.props.navigation;
    //this.props.navigate.goBack();
    console.log(`value is ${this.props.value}`);
    // this.props.goBack();
  }

  iconsView() {
    const { navigation } = this.props;
    const routeName = navigation.state.routeName;
    const cartCount = ProductDataManager.getInstance().getCartCount();
    let showCount = cartCount > 0 ? true : false;
    console.log(`cartCount: ${cartCount}`);
    console.log(`routeName ${routeName}`);
    switch (routeName) {
      case 'CartScreen':
        return (<View />);
      case 'CheckoutScreen':
        return (<View />);
      case 'ThankYou':
        return (<View />);
      case 'ViewOrderDetails':
        return (<View />);
      case 'MyOrders':
        return (<View />);
      case 'CityScreen':
        return <View />
      case 'FilterScreen':
        return <View />
      case 'MoreScreen':
        return <View />
      case 'WebScreen':
        return <View />
      case 'AddressList':
        return (
          <View style={AppStyle.rowStyle}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(`AddAddress`);
                //this.props.onPressEdit();
              }}
            >
              <Image
                style={{ width: 22, height: 22 }}
                source={addIcon}
                tintColor='white'
              />
            </TouchableOpacity>
          </View>
        )
      case 'MyProfile':
        return (
          <View style={AppStyle.rowStyle}>
            <TouchableOpacity
              onPress={() => {
                //navigation.navigate(`CartScreen`);
                this.props.onPressEdit();
              }}
            >
              <Image source={editIcon} style={{ tintColor: '#fff', height: 18, width: 18 }} />
            </TouchableOpacity>
          </View>
        );
      case 'AddAddress':
        return (
          <View style={AppStyle.rowStyle}>

          </View>
        );
      default:
        return (
          <View style={AppStyle.rowStyle}>
            <TouchableOpacity
              onPress={() => {
                if (ProductDataManager.getInstance().getUser() !== null) {
                  navigation.navigate(`CartScreen`);
                } else {
                  this.props.navigation.navigate('Auth');
                }
              }}
            >
              <View style={{ padding: 5 }}>
                <Image source={cartIcon} />{showCount === true ?
                  <View style={{ position: 'absolute', backgroundColor: 'red', alignSelf: 'flex-end', borderRadius: 5, }}>
                    <Text style={{ color: '#fff', fontSize: 10, marginHorizontal: 2, marginVertical: 1 }}>{ProductDataManager.getInstance().getCartCount()}</Text>
                  </View> :
                  <View />
                }
              </View>
            </TouchableOpacity>
          </View>
        );
    }

  }

  render() {
    const { navigation, title } = this.props;


    return (
      <View>
        <GeneralStatusBarColor backgroundColor={AppColors.appBlue} barStyle="light-content" />
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <TouchableOpacity onPress={() => {
              switch (navigation.state.routeName) {
                case 'ThankYou':
                  navigation.navigate('Home');
                case 'MyOrders':
                  if (PreviousRouteName(navigation) === 'CheckoutScreen') {
                    navigation.navigate('Home');
                  } else {
                    navigation.goBack();
                  }
                default:
                  navigation.goBack();
              }
            }}>
              <Image style={{ margin: 10 }} source={backIcon} />
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', marginLeft: 10 }}>
              <Text numberOfLines={1} style={{ fontSize: 18, width: 250, color: '#fff' }}>{title}</Text>
            </View>
          </View>
          <this.iconsView />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    alignSelf: 'stretch',
    backgroundColor: AppColors.appBlue,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 5
  },
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
});

export default Header;
