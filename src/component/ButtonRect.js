import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppColors from '../values/AppColors';


export default ButtonRect = (props) => {

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
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: AppColors.appBlue,

        height: 60,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: '#fff',
        fontSize: 15,
        marginLeft: 20,
        marginRight: 20,
        fontFamily: 'Roboto'
    },
});