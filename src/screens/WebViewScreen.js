import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../component/Header';
import AppColors from '../values/AppColors';

class WebViewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
                <Header navigation={navigation} title={this.props.navigation.getParam('title', '')} />
                <WebView source={{ uri: 'https://www.olapharmacy.com/about-us' }} />

            </View>

        );
    }
}

export default WebViewScreen;
