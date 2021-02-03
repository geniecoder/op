import React, { Component } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import { PostApiRequest, GetApiRequest } from '../util/ApiCall';
import { BASE_URL_API, ORDER_DETAILS } from '../config/api_config';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import Header from '../component/Header';
import moment from 'moment';

import barcodeIcon from '../../assets/images/icons/barcode.png'
import calendarIcon from '../../assets/images/icons/calendar-2.png'
import arrowDown from '../../assets/images/icons/arrowDown.png'
import arrowUp from '../../assets/images/icons/arrowUp.png'
import orderIcon from '../../assets/images/icons/order-placed-copy.png'
import shippedOrderA from '../../assets/images/icons/shippedOrder-copy.png'
import shippedOrder from '../../assets/images/icons/shippedOrder.png'
import prescApprovalOrderA from '../../assets/images/icons/presc-approval-copy.png'
import prescApprovalOrder from '../../assets/images/icons/presc-approval.png'
import dispatchOrderA from '../../assets/images/icons/dispatch-copy.png'
import dispatchOrder from '../../assets/images/icons/dispatch.png'
import deliveredOrderA from '../../assets/images/icons/delivered-copy.png'
import deliveredOrder from '../../assets/images/icons/delivered.png'

import placeholder from '../../assets/images/graphic/placeholder.png'

import backIcon from '../../assets/images/icons/left-arrow.png';

import addressIcon from '../../assets/images/icons/group-4.png'
import shippedIcon from '../../assets/images/icons/shipped.png'
import infoIcon from '../../assets/images/icons/info.png'
import editIcon from '../../assets/images/icons/edit-2.png'
import { TouchableOpacity } from 'react-native-gesture-handler';

class ViewOrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: null,
            orderId: '',
            isFullTrackView: false,
            isVisibleFullVIcon: true,
            orderType: '',
            orderProgress: 0,
        };
        this.trackOrder = this.trackOrder.bind(this);
        this.contentView = this.contentView.bind(this);
        this.getData = this.getData.bind(this);
        this.contentView = this.contentView.bind(this);
        this.orderInfo = this.orderInfo.bind(this);
        this.orderItems = this.orderItems.bind(this);
        this.addressView = this.addressView.bind(this);
        this.state.orderId = this.props.navigation.getParam('orderId', '');
        this.state.orderType = this.props.navigation.getParam('orderType', '');
        this.amountView = this.amountView.bind(this);
        this.trackOrderFlow = this.trackOrderFlow.bind(this);
        this.currentTrackStatus = this.currentTrackStatus.bind(this);
        // console.log(`orderType: ${this.props.navigation.getParam('orderType', 'no type')} `);
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.getData();
    }
    getData() {
        GetApiRequest(`${BASE_URL_API}${ORDER_DETAILS}/${this.state.orderId}`)
            .then(response => {
                if (response.status === '1') {
                    this.setStatus(response.data.order.orderDetails.status);
                    
                    const status  = response.data.order.orderDetails.status;
                    if(status === 'pending_payment' || status === 'canceled' || status === 'prescription_not_approved'){
                        this.setState({ isLoading: false, data: response.data, isVisibleFullVIcon: false });
                    }else{
                        this.setState({ isLoading: false, data: response.data, isVisibleFullVIcon: true });
                    }
                   
                    console.log(`responseData: ${JSON.stringify(this.state.data)} `);
                }
            }).catch(error => {
                console.log(`error ${error}`);
            })
    }
    loadingView() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    contentView() {
        if (this.state.isLoading !== false) {
            return this.loadingView();
        }
        if (this.state.data !== null) {
            return (
                <ScrollView
                    style={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <this.orderInfo />
                    <this.trackOrder />
                    <this.orderItems />
                    <this.addressView />
                    <this.amountView />

                </ScrollView>
            );
        } else {
            return <Text>retry</Text>
        }
    }

    orderInfo() {
        const { created_at,
            entity_id,
            status,
            state,
            grand_total,
            subtotal,
            shipping_method } = this.state.data.order.orderDetails
        return (
            <View style={{ backgroundColor: 'white', padding: 15, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={barcodeIcon} />
                        <Text style={{ marginHorizontal: 5 }}>Order:</Text>
                        <Text>{entity_id}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ marginRight: 7 }} source={calendarIcon} />
                        <Text>{moment(created_at).format("Do MMM YY")}</Text>
                    </View>
                </View>
            </View>
        );
    }

    setStatus(status) {
        switch (status) {
            case 'pending':
                this.setState({ orderProgress: 1 });
                break;
            case 'prescription_approved':
                this.setState({ orderProgress: 2 });
                break;
            case 'processing':
                this.setState({ orderProgress: 3 });
                break;
            case 'order_dispatched':
                this.setState({ orderProgress: 4 });
                break;
            case 'complete':
                this.setState({ orderProgress: 5 });
                break;
            default:
                break;
        }
        console.log(`status: ${status}, orderProgress: ${this.state.orderProgress}, orderType: ${this.state.orderType}`);
    }

    statusCard(img, title, des) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <Image source={img} />
                <View style={{ marginLeft: 10, flex: 1 }} >
                    <Text style={[AppStyle.textSmallBlue, { fontSize: 16 }]}>{title}</Text>
                    <Text style={AppStyle.bodySmall}>{des}</Text>
                </View>
            </View>
        )
    }


    currentTrackStatus() {
        const { status } = this.state.data.order.orderDetails;
        const { orderType } = this.state;
        switch (status) {
            case 'pending':

                return this.statusCard(orderIcon, 'Order Placed', 'Your order is currently being reviewed by our pharmacist.');
                break;
            case 'prescription_approved':
                return this.statusCard(orderIcon, 'Prescription Approved ', 'Your prescription has been approved by our pharmacist.');
                break;
            case 'processing':
                return this.statusCard(orderIcon, 'Processing', 'Our team is processing and preparing your order to be dispatched.');
                break;
            case 'order_dispatched':
                return this.statusCard(orderIcon, 'Order Dispatched', 'Your order has been dispatched and will reach you soon.');
                break;
            case 'complete':
                return this.statusCard(orderIcon, 'Delivered', 'Your order has been delivered to you. Please do leave a product review.');
                break;
            case 'pending_payment':
                return this.statusCard(orderIcon, 'Payment Pending', 'Your payment is still pending for this order. Kindly make the payment to place the order.');
                break;
            case 'canceled':
                return this.statusCard(orderIcon, 'Order Cancelled', 'This order has been cancelled.');
                break;
            case 'prescription_not_approved':
                return this.statusCard(orderIcon, 'Prescription Rejected', 'Your prescription has been rejected. Please re-upload a prescription as per the valid prescription guide.');
                break;
            default:
                return <View />
                break;
                
        }
    }

    trackOrderFlow() {
        const lineHeight = 30;
        const { orderProgress, orderType } = this.state;
        return (
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                    <Image source={orderIcon} />
                    <View style={{ marginLeft: 10, flex: 1 }} >
                        <Text style={[AppStyle.textSmallBlue, { fontSize: 16 }]}>Order Placed</Text>
                        <Text style={AppStyle.bodySmall}>Your order is currently being reviewed by our pharmacist.</Text>
                    </View>

                </View>

                {orderType === '1' ?
                    <View>
                        <View style={{ height: lineHeight, width: 1, backgroundColor: AppColors.appGray, marginLeft: 25, marginVertical: 2 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                            <Image source={orderProgress >= 2 ? prescApprovalOrderA : prescApprovalOrder} />
                            <View style={{ marginLeft: 10, flex: 1 }} >
                                <Text style={[orderProgress >= 2 ? AppStyle.textSmallBlue : AppStyle.textSmallGray, { fontSize: 16 }]}>{orderProgress >= 2 ? 'Prescription Approved' : 'Prescription Approval'}</Text>
                                <Text style={AppStyle.bodySmall}>{orderProgress >= 2 ? 'Your prescription has been approved by our pharmacist.' : 'Your prescription is being reviewed for approval.'}</Text>
                            </View>

                        </View>
                    </View>
                    :
                    <View />
                }


                <View style={{ height: lineHeight, width: 1, backgroundColor: AppColors.appGray, marginLeft: 25, marginVertical: 2 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                    <Image source={orderProgress >= 3 ? dispatchOrderA : dispatchOrder} />
                    <View style={{ marginLeft: 10, flex: 1 }} >
                        <Text style={[orderProgress >= 3 ? AppStyle.textSmallBlue : AppStyle.textSmallGray, { fontSize: 16 }]}>Order to be Dispatched</Text>
                        <Text style={AppStyle.bodySmall}>Your order is ready to be dispatched.</Text>
                    </View>

                </View>

                <View style={{ height: lineHeight, width: 1, backgroundColor: AppColors.appGray, marginLeft: 25, marginVertical: 2 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                    <Image source={orderProgress >= 4 ? shippedOrderA : shippedOrder} />
                    <View style={{ marginLeft: 10, flex: 1 }} >
                        <Text style={[orderProgress >= 4 ? AppStyle.textSmallBlue : AppStyle.textSmallGray, { fontSize: 16 }]}>Shipped</Text>
                        <Text style={AppStyle.bodySmall}>Your order has been shipped and will reach you shortly.</Text>
                    </View>

                </View>

                <View style={{ height: lineHeight, width: 1, backgroundColor: AppColors.appGray, marginLeft: 25, marginVertical: 2 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                    <Image source={orderProgress >= 5 ? deliveredOrderA : deliveredOrder} />
                    <View style={{ marginLeft: 10, flex: 1 }} >
                        <Text style={[orderProgress >= 5 ? AppStyle.textSmallBlue : AppStyle.textSmallGray, { fontSize: 16 }]}>Delivered</Text>
                        <Text style={AppStyle.bodySmall}>Your order has been delivered to you.</Text>
                    </View>
                </View>
            </View>
        );
    }

    trackOrder() {
        return (
            <View style={{ backgroundColor: 'white', padding: 15, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>TRACK ORDER</Text>
                    {this.state.isVisibleFullVIcon ?
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ isFullTrackView: !this.state.isFullTrackView })
                                console.log(`isFullTrackView ${this.state.isFullTrackView}`);
                            }}>
                            <Image source={arrowDown} style={{ margin: 5 }} />
                        </TouchableOpacity> :
                        <View />
                    }


                </View>
                {this.state.isFullTrackView ? <this.trackOrderFlow /> : <this.currentTrackStatus />}

            </View>
        );
    }

    orderItems() {
        return (
            <View>
                {this.state.data.order.items.map((item, index) => {

                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (this.state.orderType !== '1') {
                                    this.props.navigation.navigate('ProductScreen', { sku: item.sku, productName: item.pName, productId: item.pid });
                                }
                            }}>
                            <View style={{ padding: 10, flexDirection: 'row', backgroundColor: 'white', marginBottom: 3 }}>
                                <Image source={{ uri: item.img }} style={{ height: 70, width: 70, resizeMode: 'stretch' }} defaultSource={placeholder} />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text numberOfLines={2} style={[AppStyle.textSmallBlue, { fontWeight: '500' },]}>{item.pName}</Text>
                                    <Text numberOfLines={1} style={AppStyle.bodySmall}>{item.desc}</Text>
                                    <Text style={AppStyle.textBigBlue}>
                                        {Number(item.final_price) > 0 ? `₹ ${Number(item.final_price)}` : ''}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }

    amountView() {
        // const { priceInfo } = this.state;
        const { created_at,
            entity_id,
            status,
            state,
            grand_total,
            subtotal,
            shipping_method,
            order_type,
            discount_amount,
            shipping_amount } = this.state.data.order.orderDetails
        //console.log(`priceInfo: ${JSON.stringify(priceInfo)}`);
        return (
            <View style={{ marginTop: 10, backgroundColor: '#fff', padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={AppStyle.bodyText}>
                        Subtotal
                    </Text>
                    <Text style={AppStyle.bodyText}>{`₹ ${Number(subtotal)}`}</Text>
                </View>
                {Number(discount_amount) === 0 ? <View /> :
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={AppStyle.bodyText}>
                            Discount
                </Text>
                        <Text style={AppStyle.bodyText}>{`₹ ${Number(discount_amount)}`}</Text>
                    </View>
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={AppStyle.bodyText}>
                        Delivery Charges
                    </Text>
                    <Text style={AppStyle.bodyText}>{`₹ ${Number(shipping_amount)}`}</Text>
                </View>
                <View style={AppStyle.lineFullWidth} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>
                    <Text style={[AppStyle.title, { fontWeight: 'bold' }]}>
                        Grand Total
                    </Text>
                    <Text style={[AppStyle.title, { fontWeight: 'bold' }]}>{`₹ ${Number(grand_total)}`}</Text>
                </View>
            </View>
        );
    }

    addressView() {
        const { firstname, lastname, postcode, street, city, email, telephone, country_id } = this.state.data.order.shipping.address;
        return (
            <View style={styles.sectionContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={addressIcon} />
                        <Text style={{ marginLeft: 10 }}>Delivery Address</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: AppColors.pageBackground, marginTop: 14, padding: 12 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={addressIcon} />
                        <Text style={{ marginLeft: 10 }}>{`${firstname} ${lastname}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 7, alignItems: 'center' }}>
                        <Text style={styles.selectionText}>Phone</Text>
                        <View style={{ height: 10, width: 1, backgroundColor: '#999999', marginLeft: 15, marginRight: 15 }} />
                        <Text style={styles.selectionText}>{telephone}</Text>
                    </View>
                    <Text style={[styles.selectionText, { marginTop: 7 }]}>
                        {`${city}, ${street}, ${country_id}, ${postcode},`}
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={AppStyle.pageContainer}>
                <Header navigation={navigation} title='Track Order' />
                <this.contentView />
            </View>
        );
    }
}
export default ViewOrderDetails;

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
