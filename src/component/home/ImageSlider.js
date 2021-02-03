import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import ButtonS from '../ButtonS';
import AppColors from '../../values/AppColors';

export default ImageSlider = (props) => {
    return (
        <Swiper style={styles.wrapper} showsButtons={true} showsButtons={false}>
            {
                props.data.map((data) => {
                    return (
                        <ImageBackground style={{ height: 180, padding: 24, alignSelf: 'stretch', justifyContent: 'flex-end' }} source={{ uri: data.mobile_banner_img }} >
                            <View style={styles.contentStyle}>
                                <Text style={styles.textStyle}>{data.mobile_caption}</Text>
                                {/*<ButtonS text='Order Now' onPress={() => { console.log(`order now clicked`) }} />*/}
                            </View>
                        </ImageBackground>
                    )
                })
            }
        </Swiper>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 190,
        marginTop: 10,
    },
    contentStyle: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 25,
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    textStyle: {
        width: 170,
        color: AppColors.appBlue,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
    }
});
