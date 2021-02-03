import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppColors from '../values/AppColors';

export default class UploadButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
        
        <TouchableOpacity
            style={styles.btnStyle}
            onPress={() => this.props.onPress()}
            underlayColor='#fff'>
            <Text style={styles.btnText}>Upload Now</Text>
        </TouchableOpacity>
      
    );
  }
}

const styles = StyleSheet.create ({
    btnStyle:{
        paddingTop:6,
        paddingBottom:6,
        width:180,
        backgroundColor: AppColors.appBlue,
        borderRadius:4,
        borderWidth: 1,
        borderColor: '#fff',
        height: 35,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
      },
      btnText:{
          color:'#fff',
          fontSize: 13,
          fontFamily: 'Roboto'
      },
});
