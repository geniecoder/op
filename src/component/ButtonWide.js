import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AppColors from '../values/AppColors';

export default ButtonWide = (props) => {
    return (
        <TouchableOpacity
            style={[styles.btnStyle, { backgroundColor: props.backgroundColor }]}
            onPress={() => props.onPress()}
            underlayColor='#fff'>
            <Text style={styles.btnText}>{props.text}</Text>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    btnStyle: {
        paddingTop: 6,
        paddingBottom: 6,
        height: 60,
        flex: 1,
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
