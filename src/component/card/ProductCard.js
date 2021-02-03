import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import img from '../../../assets/images/product_img.jpg';
import heartIcon from '../../../assets/images/icons/heart.png';
import heartYellowIcon from '../../../assets/images/icons/heartYellow.png';
import AppColors from '../../values/AppColors';
import AppStyles from '../../style/AppStyle';
import ButtonOutline from '../ButtonOutline';


export default ProductCard = (props) => {

    const { imgUrl, productTitle, shortDescription, price, finalPrice, specialPrice, inWishList, gridMargin, item } = props;

    const [wishListValue, setWishListValue] = React.useState(inWishList);
    //const finalPrice = Number(props.data.product_data.price.final_price);
    //const specialPrice = Number(props.data.product_data.price.special_price);
    // const price = Number(props.data.product_data.price.price);
    //console.log(`price after convert to Number - specialPrice ${specialPrice} finalPrice ${finalPrice} price ${price}`);
    const savePrice = price - finalPrice;
    const percentOff = (savePrice / price) * 100;
    const itemWidth = Dimensions.get('window').width / 2;
    return (
        <View style={{ backgroundColor: '#fff', width: itemWidth, flex: 1, marginBottom: 2, marginLeft: gridMargin }}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Image source={{
                    uri: imgUrl != ''
                        ? imgUrl
                        : 'http://13.127.86.151/ola-web/pub/media/catalog/product/placeholder/default/medicine_icon_1.png'
                }} style={{ height: 70, width: 70 }} />
            </View>
            <View style={{ margin: 10 }}>
                <Text style={[AppStyles.productTitleSmall]} numberOfLines={2}>{productTitle}</Text>
                <Text style={[AppStyles.tinyGrayText, { marginTop: 3 }]}>{shortDescription}</Text>
                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', }}>
                    <Text style={{ fontFamily: 'Roboto', fontSize: 15, fontWeight: '500', color: AppColors.appBlue }}>{`₹ ${finalPrice}`}</Text>
                    {
                        specialPrice != 0
                            ? <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 9, marginTop: 3, marginLeft: 4, textDecorationLine: 'line-through', }}>{`₹${price}`}</Text>
                                <Text style={{ fontSize: 9, marginTop: 3, marginLeft: 7, color: AppColors.appYellow }}>{`Save ₹${savePrice}`}</Text>
                            </View>
                            : <View />
                    }
                </View>
            </View>
            {
                specialPrice != 0
                    ? <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', margin: 10, height: 25, width: 25, borderRadius: 25 / 2, backgroundColor: AppColors.appYellow, alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 8, color: '#fff' }}>{`${parseInt(percentOff)}%`}</Text>
                        <Text style={{ fontSize: 6, color: '#fff' }}>OFF</Text>
                    </View>
                    : <View />
            }
            <View style={{ position: 'absolute', paddingRight: 10, paddingTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                    onPress={() => {
                        //console.log(`icon clicked ${inWishList}`);
                        props.handleWishList(wishListValue, item.id);
                        if (props.cardFor !== 'wishlist') {
                            setWishListValue(wishListValue === 0 || wishListValue === null ? 1 : 0);
                        }
                    }}
                >
                    <Image source={wishListValue == 0 || wishListValue == null ? heartIcon : heartYellowIcon} />
                </TouchableOpacity>
            </View>
            {props.addToCart ?
                <View style={{ margin: 10, flex: 1, justifyContent: 'flex-end' }}>
                    <ButtonOutline text='Add to Cart' onPress={() => props.addToCart(props.item.id)} />
                </View> : <View />}

        </View>
    );
}
