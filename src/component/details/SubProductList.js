import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppColors from '../../values/AppColors';
import AppStyle from '../../style/AppStyle';

export const perCalculate = (currentProductPrice, subProductPrice) => {

    console.log(`currentPrice ${currentProductPrice} subPrice: ${subProductPrice}`);

    if (currentProductPrice > subProductPrice) {
        const chepPrec = ((currentProductPrice - subProductPrice) / currentProductPrice) * 100;
        return chepPrec.toFixed(2);
    } else {
        const perc = ((subProductPrice - currentProductPrice) / currentProductPrice) * 100;
        return perc.toFixed(2);
    }
}

export default SubProductList = (props) => {
    return (
        <View style={AppStyle.sectionContainer}>
            <Text style={[AppStyle.bodyText, { fontWeight: 'bold', marginBottom: 20 }]}>{`Substitutes for ${props.productInfo.name}`}</Text>
            {
                props.substituteArray.map((item, index) => (
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                props.loadNewProduct(item);
                                //this.setState({ sku: item.product_data.sku, productId: item.product_id, pageTitle: item.product_data.product_title, isLoading: true });

                                //props.navigation.navigate('ProductScreen', {sku: item.product_data.sku, productName: item.product_data.product_title, productId: item.product_id });
                                console.log(`product click id ${JSON.stringify(item)}`);
                            }}
                        >
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                    <Image source={{uri: item.product_data.image}} style={{height:70, width:70, borderWidth: 1, borderRadius: 5, overflow: 'hidden',  borderColor: AppColors.appGrayLight}}/>
                                    <Text style={[AppStyle.bodySmall, { marginHorizontal: 8, fontWeight: 'bold', flex: 1 }]}>{item.product_data.product_title}</Text>
                                    <View style={{alignItems: 'flex-end'}}>
                                        <Text style={[AppStyle.bodySmall, { width: 70, marginLeft: 10, textAlign: 'right', marginBottom:20 }]}>{`₹ ${Number(item.product_data.price.final_price)}/strip`}</Text>
                                        {Number(props.productInfo.price) > Number(item.product_data.price.final_price) ? <View style={[styles.roundedBackgroiundGreen]}>
                                            <Text style={[AppStyle.bodySmall, { color: 'white' }]}>{`${perCalculate(props.productInfo.price, item.product_data.price.final_price)}% Cheaper`}</Text>
                                        </View> : <View style={[styles.roundedBackgroiundRed]}>
                                                <Text style={[AppStyle.bodySmall, { color: 'white' }]}>{`${perCalculate(props.productInfo.price, item.product_data.price.final_price)}% Expensive`}</Text>
                                            </View>}
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={[AppStyle.lineFullWidth, { marginVertical: 15 }]} />
                    </View>
                ))
            }
        </View>
    );

    function perValue() {
        return (
            <Text style={[AppStyle.bodySmall, { color: 'white' }]}>5% Cheaper</Text>
        )
    }
}



const styles = StyleSheet.create({
    roundedBackgroiundRed: {
        alignSelf: 'baseline',
        backgroundColor: 'red',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        color: 'white',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    roundedBackgroiundGreen: {
        alignSelf: 'baseline',
        backgroundColor: 'green',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        color: 'white',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
});