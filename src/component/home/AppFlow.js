import React from 'react';
import {View, Image, Text} from 'react-native';
import searchIcon from '../../../assets/images/icons/search-3.png';
import cartIcon from '../../../assets/images/icons/carts.png';
import boxIcon from '../../../assets/images/icons/box.png';
import presIcon from '../../../assets/images/icons/prescription-1.png';
import AppStyle from '../../style/AppStyle';

export default AppFlow = (props) => {
    return (
        <View style={{alignSelf: 'stretch', marginBottom:10, flexDirection: 'row', justifyContent: 'space-evenly',  backgroundColor: '#fff'}}>
            <View style={{alignItems: 'center', justifyContent: 'center', margin:10}}>
                <Image style={{marginBottom:10}} source={searchIcon}/>
                <Text style={[AppStyle.tinyGrayDark, {paddingLeft:10}]}>Search Product</Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', margin:10}}>
                <Image style={{marginBottom:10}} source={cartIcon}/>
                <Text style={[AppStyle.tinyGrayDark, {paddingLeft:10}]}>Add to basket</Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', margin:10}}>
                <Image style={{marginBottom:10}} source={presIcon}/>
                <Text style={[AppStyle.tinyGrayDark, {paddingLeft:10}]}>Make the payment</Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center', margin:10}}>
                <Image style={{marginBottom:10}} source={boxIcon}/>
                <Text style={[AppStyle.tinyGrayDark, {paddingLeft:10}]}>Order is delivered</Text>
            </View>
        </View>
    );
}