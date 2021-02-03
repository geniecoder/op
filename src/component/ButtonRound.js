import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import AppColors from '../values/AppColors';


export default ButtonRound = (props) => {
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
    btnStyle:{
        paddingTop:6,
        paddingBottom:6,
        backgroundColor: AppColors.appBlue,
        borderRadius:15,
        height: 30,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
      },
      btnText:{
          color:'#fff',
          fontSize: 13,
          marginLeft: 20,
          marginRight:20,
          fontFamily: 'Roboto'
      },
});