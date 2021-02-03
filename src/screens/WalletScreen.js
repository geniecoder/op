import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';

class WalletScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <View style={AppStyle.pageContainer}>
                <Header title='Wallet' />
                <Text> WalletScreen </Text>
                
            </View>
        );
    }
}

export default WalletScreen;
