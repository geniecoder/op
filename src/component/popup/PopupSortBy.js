import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Modal, TouchableOpacity, Image, FlatList } from 'react-native';
import ButtonRect from '../../component/ButtonRect';
import AppStyles from '../../style/AppStyle';
import AppStyle from '../../style/AppStyle';
import AppColors from '../../values/AppColors';
import iconCancel from '../../../assets/images/icons/cancel.png';
import RadioButton from "react-native-radio-button";

export default PopupSortBy = (props) => {

    const [sortBy, setSortBy] = useState('');
    //setSortBy(props.sortBy);
    return (
        <Modal
            visible={props.isVisible}
            transparent animationType='none'
            onRequestClose={() => props.closeModal}>
            <TouchableOpacity
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                activeOpacity={1}
                onPress={() => {
                    console.log(`this should close popup`);
                    props.closeModal()
                }}
            >
                <TouchableOpacity activeOpacity={1} style={styles.modal}>

                    <View style={styles.modalBody}>
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 15 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: AppColors.appGrayDark }}>SORT BY</Text>
                                <TouchableOpacity
                                    onPress={() => props.closeModal()}>
                                    <Image source={iconCancel} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: .5, backgroundColor: AppColors.appGrayLight, }} />
                            <View style={{ marginHorizontal: 15 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSortBy('low-to-high');
                                        props.setSortBy('0');
                                    }}>
                                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text>Price - low to high</Text>

                                        <RadioButton
                                            innerColor="#2f80ed"
                                            outerColor="#2f80ed"
                                            animation="bounceIn"
                                            size={8}
                                            isSelected={sortBy === "low-to-high"}
                                            onPress={() => {
                                                setSortBy('low-to-high');
                                                props.setSortBy('0');
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSortBy('high-to-low');
                                        props.setSortBy('1');
                                    }}>
                                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text>Price - hight to low</Text>
                                        <RadioButton
                                            innerColor="#2f80ed"
                                            outerColor="#2f80ed"
                                            animation="bounceIn"
                                            size={8}
                                            isSelected={sortBy === "high-to-low"}
                                            onPress={() => {
                                                setSortBy('high-to-low');
                                                props.setSortBy('1');
                                                // props.setSortBy('low-to-high');
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )

}

const styles = StyleSheet.create({
    modal: {
        height: Dimensions.get('window').height * 0.35,
        width: Dimensions.get('window').width * 0.85,
    },
    modalHeader: {
        // flex: 1,
        height: Dimensions.get('window').width * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0d447a',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
    },
    modalBody: {
        flex: 1,
        backgroundColor: '#ffffff',
        // borderBottomRightRadius: 12,
        // borderBottomLeftRadius: 12,
        justifyContent: 'space-between'
    },
    modalHeaderText: {
        fontSize: 18,
        color: '#ffffff',

    },
    modalIconImage: {
        flex: 2,
        width: '70%',
        height: '70%',
        resizeMode: 'contain',
        margin: '15%',
        marginBottom: -5
    },
    modalIconText: {
        flex: 1,
        fontFamily: 'Roboto',
        fontSize: 14,
        color: 'black',
        textAlign: 'center'
    },
    bigTextStyle: {
        fontFamily: 'Roboto',
        fontSize: 17,
        color: 'black',
        textAlign: 'center'
    }
});