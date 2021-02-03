import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Button, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import AppColors from '../../values/AppColors';
import {IMG_BASE_URL} from '../../config/api_config';


export default ProductImageSlider = (props) => {
    console.log(`${IMG_BASE_URL}data.file`)
    return (
        <Swiper style={styles.wrapper} showsButtons={true} showsButtons={false}>
            {
                props.data.map((data) => {
                    console.log(`image url: ${IMG_BASE_URL}${data.file}`);
                    return (
                        
                        <Image resizeMode="contain" style={{ height: 225, padding: 24, alignSelf: 'stretch', justifyContent: 'flex-end', backgroundColor: '#fff' }} source={{ uri: `${IMG_BASE_URL}${data.file}` }} />
                    )
                })
            }
        </Swiper>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        height: 230,
        
    },
    contentStyle: {
        flexDirection: 'row',
        alignItems: 'flex-end',
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