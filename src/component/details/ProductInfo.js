import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import AppColors from '../../values/AppColors';
import AppStyle from '../../style/AppStyle';

export default ProductInfo = (props) => {
    const { productInfo, onChangeQty, productQty } = props;
    return (
        <View style={AppStyle.sectionContainer}>
            <Text style={styles.textBluehead}>{productInfo.name}</Text>
            <Text style={[AppStyle.bodySmall, { marginTop: 8 }]}>{productInfo.custom_attributes[1].value}</Text>
            <View style={[AppStyle.lineFullWidth, { marginTop: 10 }]} />
            <Text style={[styles.textPrice, { marginTop: 10 }]}>{`Rs. ${productInfo.price}`}</Text>
            <View style={{ marginTop: 15 }}>
                <Text style={[AppStyle.bodySmall, { color: AppColors.appGrayDark1, marginBottom: 7 }]}>Qty :</Text>
                <TextInput style={styles.textInput}
                    maxLength={3}
                    returnKeyType="done"
                    keyboardType="numeric"
                    onChangeText={value => onChangeQty(value)}>
                    1
                </TextInput>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textBluehead: {
        fontFamily: 'Roboto',
        fontSize: 15,
        color: AppColors.appBlue,
    },
    textPrice: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: AppColors.appBlue,
    },
    textInput: {
        width: 80,
        height: 32,
        paddingLeft: 15,
        borderColor: "#e0e0e0",
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 11,
        justifyContent: "flex-end",
        margin: 1,
        color: 'black',
    },
});