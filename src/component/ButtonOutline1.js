import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';


export default ButtonOutline1 = (props) => {
    return (
        <TouchableOpacity
            style={styles.btnStyle}
            onPress={() => props.onPress()}
            underlayColor='#fff'>
            <Text style={styles.btnText}>{props.text}</Text>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    btnStyle: {
        borderRadius: 2,
        borderWidth: 1,
        borderColor: AppColors.appBlue,
        height: 32,
        flex:1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: AppColors.appBlue,
        fontSize: 13,
        fontFamily: 'Roboto'
    },
});