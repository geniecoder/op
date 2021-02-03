import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import img from '../../../assets/images/product_img.jpg'
import heartIcon from '../../../assets/images/icons/heart.png'
import AppColors from '../../values/AppColors';
import AppStyles from  '../../style/AppStyle';


export default ProductCard = (props) => {
    const finalPrice = Number(props.data.product_data.price.final_price);
    const specialPrice = Number(props.data.product_data.price.special_price);
    const price = Number(props.data.product_data.price.price);
    const savePrice = price-finalPrice;
    const percentOff = (savePrice/price)*100;
    return (
        <View style={{backgroundColor: '#fff', alignSelf: 'stretch', flex:1}}>
            <View style={{ alignItems: 'center', marginTop:20}}>
                <Image source={{uri: props.data.product_data.image != ''
                ? props.data.product_data.image
                : 'https://www.olapharmacy.com/media/catalog/product/placeholder/default/medicine_icon_1.png'
                }} style={{height:70, width:70}}/>
            </View>
            <View style={{margin:10}}>
                <Text style={[AppStyles.productTitleSmall]}>{props.data.product_data.product_title}</Text>
                <Text style={[AppStyles.tinyGrayText, {marginTop:3}]}>{props.data.product_data.short_description}</Text>
                <View style={{flexDirection: 'row', marginTop:5, alignItems: 'center', }}>
                    <Text style={{ fontFamily: 'Roboto', fontSize:15, fontWeight: '500', color: AppColors.appBlue}}>{`₹ ${Number(props.data.product_data.price.final_price)}`}</Text>
                    {
                        props.data.product_data.price.special_price != null
                        ? <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize:9, marginTop:3, marginLeft:4, textDecorationLine: 'line-through',}}>{`₹${Number(props.data.product_data.price.price)}`}</Text>
                            <Text style={{fontSize:9, marginTop:3, marginLeft:7, color:AppColors.appYellow}}>{`Save ₹${savePrice}`}</Text>
                          </View>
                        :<View/>
                    }
                </View>
            </View>
            {
                props.data.product_data.price.special_price != null
                ? <View style={{position: 'absolute', alignItems: 'center', justifyContent: 'center', margin:10, height:25, width:25, borderRadius: 25/2, backgroundColor:AppColors.appYellow, alignSelf: 'flex-start'}}>
                        <Text style={{fontSize: 8, color:'#fff'}}>{`${parseInt(percentOff)}%`}</Text>
                        <Text style={{fontSize: 6, color:'#fff'}}>OFF</Text>
                    </View>
                : <View/>
            }
            <View style={{position: 'absolute', paddingRight:10, paddingTop:10, alignSelf: 'flex-end'}}>
                <Image source={heartIcon}/>
            </View>
        </View>
    );
}
