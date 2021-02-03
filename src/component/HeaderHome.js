import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, Image, TouchableOpacity } from 'react-native';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';

import logoWhite from '../../assets/images/brand/ola-pharmacy-white.png';
import logo from '../../assets/images/brand/logo.png';
import menuIcon from '../../assets/images/icons/menu-icon.png';
import notiIcon from '../../assets/images/icons/notifications-button.png';
import cartIcon from '../../assets/images/icons/cart-icon.png';

import ProductDataManager from '../util/ProductDataManager';



const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 30 : StatusBar.currentHeight;

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

class HeaderHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { navigation } = this.props;
    const cartCount = ProductDataManager.getInstance().getCartCount();
    let showCount = cartCount > 0 ? true : false;
    return (
      <View>
        <GeneralStatusBarColor backgroundColor={AppColors.appBlue} barStyle="light-content" />
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
              //navigation.navigate('TestScreen');
            }}
          >
            <Image style={{ margin: 10 }} source={menuIcon} />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Image style={{ marginLeft:20, alignContent: 'center', flex: 1, width:120, resizeMode: 'contain' }} source={logo} />
          </View>
          <View style={AppStyle.rowStyle}>
           {/* <Image source={notiIcon} />*/}
            <View style={{ width: 14, }} />
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

export default HeaderHome;
