import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AppStyle from '../../style/AppStyle';
import AppColors from '../../values/AppColors';

import delectIcon from '../../../assets/images/icons/delete.png';

export default ProductItemSM = (props) => {
    const { image } = props.item;
    return (
        <View style={{ paddingVertical: 17, paddingHorizontal: 12, marginBottom: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center' }}>
                <Image source={{
                    uri: image != ''
                        ? image
                        : 'http://13.127.86.151/ola-web/pub/media/catalog/product/placeholder/default/medicine_icon_1.png'
                }} style={{ padding: 5, height: 70, width: 70 }} />
                <View style={{ paddingRight: 15, paddingLeft: 10., flex: 1 }}>
                    <Text>{props.item.name}</Text>
                    <Text style={[AppStyle.bodySmall, { marginTop: 4 }]}>{props.item.add_to_cart.short_des}</Text>
                    <Text style={styles.priceText}>{`₹ ${Number(props.item.add_to_cart.price)}`}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    console.log(`delete product from array`);
                    props.removeProductFromArray(props.item.add_to_cart.productId);
                }}>
                    <Image source={delectIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    priceText: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: AppColors.appBlue,
        marginTop: 10

    }
});