import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import AppStyle from '../../style/AppStyle';
import AppColors from '../../values/AppColors';
import ButtonOutline1 from '../../component/ButtonOutline1';
import ButtonS from '../../component/ButtonS';
import ButtonWide from '../../component/ButtonWide';
import barcodeIcon from '../../../assets/images/icons/barcode.png'
import calendarIcon from '../../../assets/images/icons/calendar-2.png'

import ButtonR from '../../component/ButtonRect';
import ButtonBlue from '../../component/ButtonBlue';
import moment from 'moment';
export default CardMyOrder = (props) => {
    //console.log(`card item ${JSON.stringify(props.item.items)}`);
    const { name, order_id, created_at } = props.item.items.order;
    const { status, grand_total, order_type, increment_id } = props.item;

    StView = () => {
        if (status === 'processing') {
            return (
                <View style={{ backgroundColor: '#F7BA3E', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Processing</Text>
                </View>
            );
        }
        if (status === 'pending') {
            return (
                <View style={{ backgroundColor: '#F7BA3E', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>{order_type === '1' ? 'Pending' : 'Processing'}</Text>
                </View>
            );
        }
        if (status === 'complete') {
            return (
                <View style={{ backgroundColor: '#3FBE4F', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Complete</Text>
                </View>
            );
        }
        if (status === 'canceled') {
            return (
                <View style={{ backgroundColor: '#ED4459', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Canceled</Text>
                </View>
            );
        }
        if (status === 'prescription_approved') {
            return (
                <View style={{ backgroundColor: '#3FBE4F', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Prescription Approved</Text>
                </View>
            );
        }
        if (status === 'pending_payment') {
            return (
                <View style={{ backgroundColor: '#ED4459', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Payment Pending</Text>
                </View>
            );
        }
        if (status === 'order_dispatched') {
            return (
                <View style={{ backgroundColor: '#3FBE4F', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Order Dispatched</Text>
                </View>
            );
        }
        if (status === 'prescription_not_approved') {
            return (
                <View style={{ backgroundColor: '#ED4459', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Prescription Declined</Text>
                </View>
            );
        }

        return <View />

    }
    return (
        <View style={{ backgroundColor: 'white', padding: 15, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={barcodeIcon} />
                    <Text style={{ marginHorizontal: 5 }}>Order:</Text>
                    <Text>{increment_id}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ marginRight: 7 }} source={calendarIcon} />
                    <Text>{moment(created_at).format("Do MMM YY")}</Text>
                </View>
            </View>
            <View style={{ marginVertical: 10, backgroundColor: AppColors.appGrayLight, height: .6 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text numberOfLines={1} style={[AppStyle.textSmallBold, { width: 180 }]}>{name}</Text>
                {<StView />}
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 7 }}>
                {/*<Text style={AppStyle.tinyGrayText, { fontSize: 10 }}>Schedule for</Text>
                <Text style={[AppStyle.tinyGrayText, { fontSize: 10, marginLeft: 5, color: AppColors.appBlue }]}>Tomorrow, 04:00 PM</Text>*/}
            </View>
            {Number(grand_total) > 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={AppStyle.textSmallBold}>Amount Payable</Text>
                <Text style={AppStyle.textSmallBlue}>{`₹ ${Number(grand_total)}`}</Text>
            </View> : <View />}


            <View style={[AppStyle.lineFullWidth, { marginVertical: 10 }]} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                {status === 'pending_payment' ?
                    <ButtonOutline1 text='Retry Payment' onPress={() => {

                        props.retryPayment(increment_id);

                    }} /> :
                    <ButtonOutline1 text={status === 'canceled' || status === 'complete' ? 'Reorder' : 'Cancel Order'} onPress={() => {
                        if (status === 'canceled' || status === 'complete') {
                            props.reorder(increment_id);
                        } else {
                            //props.cancelOrder(order_id);
                            props.navigation.navigate('CancelOrderScreen', { 'orderId': order_id });
                        }
                    }} />
                }

                <View style={{ width: 20 }} />
                <ButtonBlue text={'View Details'} onPress={() => {

                    props.navigation.navigate('ViewOrderDetails', { 'orderId': order_id, 'orderType': order_type });
                    console.log(`goto details`);

                }} />
            </View>
        </View>
    )
}