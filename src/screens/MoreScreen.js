import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Logout } from '../util/LocalStorage';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';
import NavButton from '../component/NavButton';
import ProductDataMangaer from '../util/ProductDataManager';
import moreIcon from '../../assets/images/icons/more.png';


class MoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.contentView = this.contentView.bind(this);

  }

  contentView() {
    const { navigation } = this.props;
    const user = ProductDataMangaer.getInstance().getUser()
    return (
      <ScrollView
        style={{ width: "100%"}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginTop: 10, marginHorizontal: 20, flex:1 }}>
          <NavButton onPress={() => {

            //  navigation.navigate('Home');

          }} icon={moreIcon} text='All Brands' />

          <NavButton onPress={() => {

            //  navigation.navigate('Home');

          }} icon={moreIcon} text='About Us' />

          <NavButton onPress={() => {

            console.log(`goto webview about us`);

              navigation.navigate('WebScreen', {url: 'https://www.olapharmacy.com/about-us', title: 'About Us'});

          }} icon={moreIcon} text='Privacy Policy' />

          <NavButton onPress={() => {

            //  navigation.navigate('Home');

          }} icon={moreIcon} text='Terms and Conditions' />

          <NavButton onPress={() => {

            //  navigation.navigate('Home');

          }} icon={moreIcon} text='Return &amp; Refunds' />

          <NavButton onPress={() => {

            //  navigation.navigate('Home');

          }} icon={moreIcon} text='Shipping policy' />

          <NavButton onPress={() => {

            //  navigation.navigate('Home');

          }} icon={moreIcon} text='Business Partnerships' />

          <NavButton onPress={() => {

            //  navigation.navigate('Home');

          }} icon={moreIcon} text='FAQs' />
          <NavButton onPress={() => {
            if (user !== null) {
              Logout();
              navigation.navigate('Home');
            } else {
              navigation.navigate('Auth');
            }
          }} icon={moreIcon} text={user !== null ? 'Logout' : 'Login'} />

        </View>
      </ScrollView>


    );
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={[AppStyle.containerStyle, {flex:1}]}>
        <Header navigation={navigation} title='More' />
        <this.contentView />
      </View>
    );
  }
}

export default MoreScreen;
