import React, { Component } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BASE_URL_API, CANCEL_REASON, CANCEL_ORDER } from '../config/api_config';
import { PostApiRequest } from '../util/ApiCall';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import Header from '../component/Header';
import RadioButton from "react-native-radio-button";
import InputMultiline from '../component/InputMultiline';

class CancelOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoading: true,
            orderId: props.navigation.getParam('orderId', ''),
            selectedIndex: -1,
            reasonText: '',
            checkValidate: false


        };
        this.contentView = this.contentView.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        PostApiRequest(`${BASE_URL_API}${CANCEL_REASON}`).
            then(response => {
                if (response.status === '1') {
                    this.setState({ data: response.data, isLoading: false })
                    console.log(`response: ${JSON.stringify(this.state.data)}`);
                }
            }).catch(error => {
                console.log(`error: ${error}`);
            });
    }

    cancelOrderRequest(id) {
        const bodyObj = {
            data: {
                orderId: id,
                cancel_reason: this.state.reasonText
            }
        }
        PostApiRequest(`${BASE_URL_API}${CANCEL_ORDER}`, bodyObj).then(response => {
            console.log(`response: ${JSON.stringify(response)}`);
            if (response.status === '1') {


                Alert.alert(
                    'Success',
                    'Your order has been cancelled',
                    [

                        { text: 'Go to Home', onPress: () => this.props.navigation.navigate('Home', { cancelResponse: response }) },
                    ],
                    { cancelable: false },
                );
            }
        }).catch(error => {
            console.log(`error ${error}`)
        })

    }

    onChangeText(value) {
        this.setState({ reasonText: value })
    }

    contentView() {
        const { isLoading, data, selectedIndex } = this.state;
        if (isLoading) {
            return (<this.loadingView />);
        }
        if (data != null) {
            return (
                <View style={{ flex: 1, margin: 20 }}>
                    <ScrollView
                        style={{ width: "100%" }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {data.map((item, index) => {
                            return (
                                <TouchableOpacity style={{ paddingVertical: 10 }}
                                    onPress={() => {
                                        //this.setState({ paymentOption: 'online' });

                                        this.setState({ selectedIndex: index, reasonText: item.reason });
                                    }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <RadioButton
                                            innerColor="#2f80ed"
                                            outerColor="#2f80ed"
                                            animation="bounceIn"
                                            size={8}
                                            isSelected={selectedIndex === index}
                                            onPress={() => {
                                                this.setState({ selectedIndex: index, reasonText: item.reason });
                                                // eslint-disable-next-line react/no-this-in-sfc
                                            }}
                                        />
                                        <Text style={[AppStyle.bodyText, { marginLeft: 15 }]}>
                                            {item.reason}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                        <TouchableOpacity style={{ paddingVertical: 10 }}
                            onPress={() => {
                                //this.setState({ paymentOption: 'online' });

                                this.setState({ selectedIndex: -1 });
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <RadioButton
                                    innerColor="#2f80ed"
                                    outerColor="#2f80ed"
                                    animation="bounceIn"
                                    size={8}
                                    isSelected={selectedIndex === -1}
                                    onPress={() => {
                                        this.state.checkValidate = false;
                                        this.setState({ selectedIndex: -1, reasonText: '' });
                                        // eslint-disable-next-line react/no-this-in-sfc
                                    }}
                                />
                                <Text style={[AppStyle.bodyText, { marginLeft: 15 }]}>
                                    Other
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.selectedIndex === -1 ?
                            <InputMultiline initValue={this.state.reasonText} onChangeText={this.onChangeText.bind(this)} maxLength={200} /> :
                            <View />
                        }
                        {this.state.reasonText === '' && this.state.checkValidate ? <Text style={AppStyle.errorStyle}>Please type your reason for cancellation</Text> : <View />}

                    </ScrollView>

                </View>
            );
        }
    }

    loadingView() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}><ActivityIndicator size="large" color="#000" /></View>;
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={AppStyle.pageContainer}>
                <Header navigation={navigation} title='Cancel Order' />
                <this.contentView />
                <View style={{ flexDirection: 'row' }}>
                    <ButtonWide text='Back' backgroundColor={AppColors.appGray} onPress={() => {
                        this.props.navigation.goBack();
                    }} />
                    <ButtonWide text='Continue' backgroundColor={AppColors.appBlue}
                        onPress={() => {
                            this.state.checkValidate = true;
                            console.log(`reasonText: ${this.state.reasonText}`)
                            if (this.state.reasonText !== '') {
                                this.cancelOrderRequest(this.state.orderId);
                                console.log(`orderid:${this.state.orderId}`);
                            } else {

                                this.setState({});
                            }

                        }} />
                </View>
            </View>
        );
    }
}

export default CancelOrder;

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 15,
        backgroundColor: '#fff',
        padding: 15,
    },
    selectionText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: AppColors.appGray,
    }
});
