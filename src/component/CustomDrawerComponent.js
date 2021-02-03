import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';

import AppColors from '../values/AppColors';

import heartIcon from '../../assets/images/icons/heart.png';

import background from '../../assets/images/graphic/menubg.png';
import profilePic from '../../assets/images/graphic/boy.png';
import myProfile from '../../assets/images/icons/myProfile.png';
import myOrder from '../../assets/images/icons/myOrder.png';
import address from '../../assets/images/icons/address.png';
import wishlist from '../../assets/images/icons/wishlist.png';
import myPrescription from '../../assets/images/icons/myPrescription.png';
import wallet from '../../assets/images/icons/wallet.png';
import myCart from '../../assets/images/icons/myCart.png';
import refer from "../../assets/images/icons/refer-earn.png";
import hospital from '../../assets/images/icons/hospital.png';
import more from '../../assets/images/icons/more.png';

import { GetUser } from '../util/LocalStorage';
import { BASE_URL_API, WISH_LIST } from '../config/api_config';

import ProductDataManager from '../util/ProductDataManager';

const NavButton = (props) => {
  return (
    <TouchableOpacity onPress={() => {
      if (props.text === 'Wishlist') {
        props.navigate(props.screenName, { url: `${BASE_URL_API}${WISH_LIST}?customer_id=${ProductDataManager.getInstance().getUser().customer_id}` });
      } else {
        props.navigate(props.screenName);
      }
    }}>
      <View style={styles.menuItems}>
        <Image source={props.icon} />
        <Text style={styles.menuItemText}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
}
const UserInfo = () => {
  let firstName = 'Guest';
  let lastName = '';
  let email = '';

  const user = ProductDataManager.getInstance().getUser();
  if (user !== null) {
    firstName = user.first_name;
    lastName = user.last_name;
    email = user.email;
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
      <View style={{ flexDirection: 'row', width: 64, height: 64, backgroundColor: '#0d447a', borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.profileNameText}>{firstName ? firstName.charAt(0) : ''}</Text>
        <Text style={styles.profileNameText}>{lastName ? lastName.charAt(0) : ''}</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', }}>
          <Text style={styles.fullNameText}>{firstName}</Text>
          <View style={{ width: 5 }} />
          <Text style={styles.fullNameText} numberOfLines={1}>{lastName}</Text>
        </View>
        <Text style={styles.emailText}>{email}</Text>
      </View>
    </View>
  );
}

export const CustomDrawerComponent = (props) => {
  const { navigate } = props.navigation;
  const user = ProductDataManager.getInstance().getUser();
  return (
    <View style={{ flex: 1 }}>
      <Image style={{ marginTop: 40 }} source={background} />
      <View style={{ position: 'absolute', marginTop: 60 }}>
        <UserInfo />
        <ScrollView style={{ marginTop: 40 }}>
          <View>
            {/*<DrawerItems {...props}/>*/}
            <NavButton navigate={navigate} screenName={user !== null ? 'MyProfile' : 'Auth'} icon={myProfile} text='My Profile' />
            <NavButton navigate={navigate} screenName={user !== null ? 'MyOrders' : 'Auth'} icon={myOrder} text='My Orders' />
            <NavButton navigate={navigate} screenName={user !== null ? 'AddressList' : 'Auth'} icon={address} text='My Address' />
            <NavButton navigate={navigate} screenName={user !== null ? 'MyPrescriptions' : 'Auth'} icon={myPrescription} text='My Prescriptions' />
            <NavButton navigate={navigate} screenName={user !== null ? 'WishList' : 'Auth'} icon={wishlist} text='Wishlist' />
            
            {/*<NavButton navigate={navigate} screenName='WalletScreen' icon={wallet} text='Wallet' />*/}
            <NavButton navigate={navigate} screenName={user !== null ? 'CartScreen' : 'Auth'} icon={myCart} text='My Cart' />
            {/*<NavButton navigate={navigate} screenName='MoreScreen' icon={hospital} text='Refer - Earn' />*/}
            <NavButton navigate={navigate} screenName='MoreScreen' icon={more} text='More' />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: Dimensions.get('window').height * 0.95 ,
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  fullNameText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    color: '#0e457c',
    textTransform:'capitalize'
  },
  menuItems: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 30,
    paddingLeft: Dimensions.get('window').width * 0.05,
    flex: 1,
  },
  menuItemText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: '#1e2120',
    marginLeft: 22,
  },
  profileNameText: {
    fontFamily: 'Roboto',
    fontSize: 28,
    color: '#e6ecf1',
    textTransform: 'capitalize'
  },


  emailText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#1e2120',

  },
});