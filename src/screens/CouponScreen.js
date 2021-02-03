import React, { Component } from 'react';
import {
    View, Text, ScrollView, Image, TextInput, StyleSheet, ToastAndroid,
    Platform,
    AlertIOS,
    Alert,
    ActivityIndicator
} from 'react-native';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import Header from '../component/Header';
import ButtonRect from '../component/ButtonRect';
import { PostApiRequest, GetApiRequest } from '../util/ApiCall';
import { BASE_URL_API, GET_COUPON, POST_COUPON } from '../config/api_config';
import { GetUser } from '../util/LocalStorage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProductDataManager from '../util/ProductDataManager';

class CouponScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            cList: null,
            isCouponAdding: false
        };
        this.contentView = this.contentView.bind(this);
        this.getData = this.getData.bind(this);
        this.couponList = this.couponList.bind(this);
        this.couponInput = this.couponInput.bind(this);
    }
    componentDidMount() {
        this.getData();
    }
    getData() {
        GetApiRequest(`${BASE_URL_API}${GET_COUPON}`)
            .then(response => {
                console.log(`getCoupon response ${JSON.stringify(response.data)}`);
                this.setState({ isLoading: false, cList: response.data });
                //this.setState({ isLoading: false, data: response });
            }).catch(error => {
                console.log(`error ${error}`);
            })
    }

    notifyMessage(msg) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(`Coupon not valid`, ToastAndroid.SHORT)
        } else {
            // AlertIOS.alert(msg);
            //AlertIOS.alert('Sync Complete', 'All your data are belong to us.');
            Alert.alert(
                'Coupon not valid',
                'error msg will be here',
                [

                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: true },
            );
        }
    }
    applyCoupon(coupon) {
        //console.log(`applyCoupon quoteId: ${ProductDataManager.getInstance().getQuoteId()}`);
        if (this.state.isCouponAdding === false) {
            this.setState({ isCouponAdding: true });
            const bodyObj = {
                data: {
                    action: "add",
                    quoteid: ProductDataManager.getInstance().getQuoteId(),
                    couponcode: coupon,
                }
            }
            PostApiRequest(`${BASE_URL_API}${POST_COUPON}`, bodyObj)
                .then(response => {
                    this.setState({ isCouponAdding: false });
                    console.log(`PostCoupon response: ${JSON.stringify(response)}`);
                    if (response.status === '1') {
                        if (response.data.couponInfo.couponApplied === true) {
                            this.props.navigation.state.params.couponAppliedSuccess();
                            this.props.navigation.navigate('CartScreen');
                        } else {
                            this.notifyMessage(`Invalid coupon code`);
                        }
                    }
                })
                .catch(error => {
                    console.log(`error ${error}`);
                });
        }
    }
    loadingView() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#000" /></View>
    }
    contentView() {
        if (this.state.isLoading) {
            return this.loadingView();
        }
        if (this.state.cList == null) {
            return (<Text>retry</Text>);
        }
        return (
            <View style={{flex:1}}>
                <ScrollView
                    style={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <this.couponInput />
                    <this.couponList />
                </ScrollView>

            </View>
        );
    }

    couponInput() {
        return (
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: AppColors.appGrayLight }}>

                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <TextInput
                        autoFocus
                        autoCorrect={false}
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                        placeholder="Enter Coupon Code"
                        placeholderTextColor="#333"
                        selectionColor='#333'
                        returnKeyType='search'
                        onChangeText={(value) => {
                            //this.onChangeText(searchText);
                            //this.searchingProduct(searchText);
                            this.setState({ couponCode: value });
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => {
                        if (this.state.couponCode !== null && this.state.couponCode !== '') {
                            this.applyCoupon(this.state.couponCode);
                        }
                    }}
                >
                    <Text>Apply</Text>
                </TouchableOpacity>

            </View>
        );
    }

    onChangeText(value) {
        console.log(`onChangeText ${value}`);
    }

    couponList() {
        return (
            this.state.cList.map((item, index) => {
                return (
                    <View>
                        <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ width: 250 }}>
                                <Text style={{ fontWeight: "bold", fontFamily: 'Roboto', marginBottom: 5 }}>{item.code}</Text>
                                <Text style={AppStyle.bodySmall}>{item.description}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log(`clicked on Apply`);
                                    this.applyCoupon(item.code);
                                }}
                            >
                                <Text style={AppStyle.textSmallBlue}>
                                    Apply
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={AppStyle.lineFullWidth} />
                    </View>


                );
            })
        );
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={AppStyle.pageContainer}>
                <Header navigation={navigation} title='Coupon' />

                <this.contentView />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        alignSelf: 'stretch',
        backgroundColor: AppColors.appBlue,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 15,
        paddingLeft: 5
    },

    textInput: {
        height: 40,

        marginRight: 20,
        borderColor: '#e0e0e0',
        fontSize: 14,
        color: AppColors.appGrayDark1,
    },
});

export default CouponScreen;
