import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import ButtonRound from './ButtonRound';
import AppStyle from '../style/AppStyle';

const RetryView = (props) => (
    <View style={{flex:1, alignItems:'center', justifyContent:'center', padding:50}}>
        <Text style={[AppStyle.bodyText, {textAlign:'center', marginBottom:15}]}>Failed to load content, please check your internet connection and try again.</Text>
        <ButtonRound text='RETRY' onPress={props.onPress}/>
    </View>
);

export default RetryView;
