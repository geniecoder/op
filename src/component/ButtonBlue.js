import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppColors from '../values/AppColors';


export default ButtonBlue = (props) => {

    var childView;
    if (props.isLoading == true) {
        //console.log('is loading true');
        childView = <ActivityIndicator size="small" color="#ffffff" />;
    } else {
        //console.log('is loading false');
        childView = <Text style={styles.btnText}>{props.text}</Text>;
    }
    return (
        <TouchableOpacity
            style={styles.btnStyle}
            onPress={() => props.onPress()}
            underlayColor='#fff'>
            {childView}
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    btnStyle: {
        borderRadius: 2,
        borderWidth: 1,
        borderColor: AppColors.appBlue,
        height: 32,
        flex: 1,
        backgroundColor: AppColors.appBlue,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: 13,
        fontFamily: 'Roboto'
    },
});