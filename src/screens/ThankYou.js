import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import thankYouThumbsUp from '../../assets/images/graphic/thankYouThumbsUp.png';
import Header from '../component/Header';

import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';
import ButtonRect from '../component/ButtonRect'

class ThankYou extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: ''
    };
    const { navigation } = this.props
    this.state.orderId = navigation.getParam('orderId', '');
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={AppStyle.pageContainer}>
        <Header navigation={navigation} title='Thank You' />
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
          <Image source={thankYouThumbsUp} />
          <Text style={[styles.txtStyle1, [{ marginTop: 15 }]]}>Thank You</Text>
          <Text style={[AppStyle.bodyText, [{ marginTop: 10 }]]}>{`Your order has been placed with order id: ${this.state.orderId}`}</Text>
          <View style={{ height: 60 }} />
          <ButtonRect text='Check Order Status' onPress={() => {
            console.log(`check order status clicked`);
            navigation.navigate('MyOrders');
          }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txtStyle1: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: AppColors.appGrayDark1,
  },
});

export default ThankYou;
