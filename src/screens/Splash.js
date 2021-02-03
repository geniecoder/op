import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { GetUser } from '../util/LocalStorage';

import logo from '../../assets/images/brand/OlaPharmacy.png';
import bg from '../../assets/images/graphic/bg.png';
import ProductDataManager from '../util/ProductDataManager';

class Splash extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.checkLoggedIn();
        }, 2500)
    }
    checkLoggedIn() {
        GetUser().then((userData) => {
            if (userData != null) {
                console.log(`GetUser: ${JSON.stringify(userData)}`);
                ProductDataManager.getInstance().setUser(userData);
                this.props.navigation.navigate('App');

                return 'App';
            } else {
                console.log(`user is not avilable`);
                this.props.navigation.navigate('Auth');
                return 'Auth';
            }
        });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Image source={bg} style={{ position: 'absolute' }} />
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <Image style={{ height: 150, width: 150, resizeMode: 'contain' }} source={logo} />
                </View>
            </View>
        );
    }
}

export default Splash;
