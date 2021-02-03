import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';

import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
export default NavButton = (props) => {
    return (
        <View>
            <TouchableOpacity onPress={() => {
                props.onPress();
            }}>
                <View style={styles.menuItems}>
                    <Image source={props.icon} />
                    <Text style={styles.menuItemText}>{props.text}</Text>
                </View>
            </TouchableOpacity>
            <View style={{height:1, backgroundColor: AppColors.appGrayLight}}></View>
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
    },
    menuItems: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: 20,
        marginTop:20
       
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
        color: '#e6ecf1'
    },


    emailText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: '#1e2120',

    },
});