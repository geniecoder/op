import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Header from '../component/Header';
import { WebView } from 'react-native-webview';

class TestScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Header navigation={navigation} title={this.state.pageTitle} />
                <View style={{flex:1, backgroundColor: 'red',}}>
                    <Text style={{color: 'black'}}>dsfdsf</Text>
                </View>
            </View>
        );
    }
}

export default TestScreen;
