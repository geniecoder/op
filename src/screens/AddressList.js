import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';
import deliveryIcon from '../../assets/images/icons/deliveryAddress.png'
import AddressCard from '../component/card/AddressCard';

import { BASE_URL_API, ADDRESS_LIST, DELETE_ADDRESS } from '../config/api_config';
import { GetUser } from '../util/LocalStorage';
import { PostApiRequest, GetApiRequest, DeleteApiRequest } from '../util/ApiCall';
import AlertPopup2 from '../component/popup/AlertPopup2';
import binImg from '../../assets/images/graphic/rubbish-bin.png';
import RetryView from '../component/RetryView';


class AddressList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            showAlert: false,
            alertLine1: 'Want to delete',
            alertLine2: 'Do you want to delete the Address',
            alertBtnText1: 'Cancel',
            alertBtnText2: 'Delete',
            alertTitle: 'Alert',
            retryVisible: false
        };
        this.contentView = this.contentView.bind(this);
        this.selectAddress = this.selectAddress.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
        this.state.listType = this.props.navigation.getParam('listType', '');
        this.addressDeleteRequest = this.addressDeleteRequest.bind(this);
        this.editAddress = this.editAddress.bind(this);

    }

    componentDidMount() {
        GetUser().then((userData) => {
            if (userData != null) {
                this.setState({ user: userData });
                console.log(`user ${JSON.stringify(this.state.user)}`);
                return 'App';
            } else {
                return 'Auth';
            }
        });
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.getData();
            }
        );
    }

    deleteAddress(addressId) {
        this.setState({ addressId: addressId, showAlert: true });
    }


    editAddress(item) {
       // console.log(`edit address ${JSON.stringify(item)}`);
        this.props.navigation.navigate('AddAddress', { addressItem: item });
    }

    addressDeleteRequest() {
        DeleteApiRequest(`${BASE_URL_API}${DELETE_ADDRESS}/${this.state.addressId}`)
            .then((response) => {
                if (response.status === '1') {
                    this.getData();
                }
                console.log(`response: ${JSON.stringify(response)}`);
            })
            .catch(error => {
                console.log(`error: ${error}`);
            });
    }

    getData() {
        GetApiRequest(`${BASE_URL_API}${ADDRESS_LIST}/${this.state.user.customer_id}`)
            .then((response) => {
                this.setState({ isLoading: false, data: response.data });
                //this.state.isLoading = false;
                //this.state.data = response.data;
                //this.getDefaultAddress();
                console.log(`data: ${JSON.stringify(this.state.data)}`);
            }).catch(error => {
                console.log(`error: ${error}`);
                this.setState({ isLoading: false, retryVisible: true });
            })
    }
    selectAddress(addressItem) {
        const { navigation } = this.props;
        if (this.state.listType === 'selection') {
            navigation.navigate('CheckoutScreen', { selectedAddress: addressItem });
        }

    }
    reloadData() {
        console.log(`data reload`)
        this.setState({ isLoading: true, retryVisible: false }, this.getData());

    }
    contentView() {
        if (this.state.retryVisible) {
            return <RetryView onPress={() => this.reloadData()} />
        }
        if (this.state.isLoading) {
            return this.loadingView();
        } else {
            if (this.state.data !== null) {
                if (this.state.data.length > 0) {
                    return (
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                style={{ width: "100%" }}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                {
                                    this.state.listType === '' ? <View /> :
                                        <View style={{ marginHorizontal: 15, marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={deliveryIcon} />
                                                <Text style={[AppStyle.bodyText, { marginLeft: 12 }]}>Choose Delivery Address</Text>
                                            </View>
                                        </View>
                                }
                                {this.state.data.map((item, index) => {
                                    return (
                                        <AddressCard data={item} index={index} selectAddress={this.selectAddress} listType={this.state.listType} deleteAddress={this.deleteAddress} editAddress={this.editAddress} />
                                    );
                                })}
                                <View style={{ height: 20 }} />

                            </ScrollView>
                            {/*<ButtonRect text={`Continue`} onPress={() => {
                                //this.addToCart();
                                console.log(`continue`);
                            }} />*/}
                            <AlertPopup2 isVisible={this.state.showAlert}
                                closeModal={() => { this.setState({ showAlert: false }) }}
                                text1={this.state.alertLine1}
                                text2={this.state.alertLine2}
                                btnText1={this.state.alertBtnText1}
                                btnText2={this.state.alertBtnText2}
                                title={this.state.alertTitle}
                                img={binImg}
                                onPress1={() => {
                                    this.setState({ showAlert: false });
                                }}
                                onPress2={() => {
                                    this.setState({ showAlert: false });
                                    this.addressDeleteRequest();
                                }}
                            />
                        </View>
                    );
                } else {
                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={AppStyle.bodyText}>Please add address</Text>
                        </View>
                    );

                }

            }
        }
    }
    loadingView() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
            ;
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
                <Header navigation={navigation} title='Address' />
                <this.contentView />

            </View>
        );
        //----
        /*const { navigation } = this.props;
        return (
            <View >
                <Header title='Address' navigation={navigation} />

                <this.contentView />
                <ButtonRect text='Continue' onPress={() => {
                    //this.placeOrder();
                }} />
            </View>
        );*/
    }
}

export default AddressList;
