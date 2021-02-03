import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppStyle from '../../style/AppStyle';
import Colors from '../../values/AppColors';
import proImg from '../../../assets/images/product_img.jpg';
import removeIcon from '../../../assets/images/icons/delete.png'
import addIcon from '../../../assets/images/icons/add.png';
import minusIcon from '../../../assets/images/icons/minus.png';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default CartItem = (props) => {
    const { index, item, updatePost, cartItemDelete } = props;
    const tpM = index == 0 ? 0 : 1;
    return (
        <View style={{ marginTop: tpM, padding: 20, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: item.imageUrl }} style={{ height: 80, width: 80 }} />
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text numberOfLines={2} style={[AppStyle.textSmallBlue, { fontWeight: '500' },]}>{item.prodName}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                cartItemDelete(item);
                            }}>
                            <Image source={removeIcon} />
                        </TouchableOpacity>

                    </View>
                    <Text numberOfLines={1} style={AppStyle.bodySmall}>{item.shortDesc}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignContent: 'space-between' }}>
                        <Text style={AppStyle.textBigBlue}>
                            {`₹ ${item.finalPrice}`}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    updatePost(item, -1);
                                }}>
                                <Image source={minusIcon} />
                            </TouchableOpacity>
                            <View style={{ width: 20, alignItems: 'center' }}>
                                <Text>{item.qty}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    updatePost(item, 1);
                                }}>
                                <Image source={addIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}