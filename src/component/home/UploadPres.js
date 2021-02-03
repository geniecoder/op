
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import UploadButton from '../UploadButton';
import preDocImage from '../../../assets/images/graphic/perscription_doctor.png';
import AppColors from '../../values/AppColors';
import { GetUser } from '../../util/LocalStorage';

export default UploadPres = (props) => {
  return (
    <View style={{flex:1, backgroundColor: '#fff', marginTop: 5, flexDirection: 'row', justifyContent:'center' }}>
      <View style={{  alignItems: 'center', marginVertical:8 }}>
        <Image source={preDocImage} />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft:30}}>
        <Text style={styles.textStyle}>Upload Prescription</Text>
        <View style={{ height: 8 }} />
        <TouchableOpacity
          style={styles.btnStyle}
          onPress={() => {
            console.log(`goting to prescription`);
            GetUser().then((userData) => {
              if (userData != null) {
                console.log(`GetUser: ${userData.token}`);
                props.navigation.navigate('UploadPresScreen');
                //return 'App';
              } else {
                console.log(`user is not avilable`);
                props.navigation.navigate('Auth');
                //return 'Auth';
              }
            });
            
          }}
          underlayColor='#fff'>
          <Text style={styles.btnText}>Upload Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  textStyle: {
    color: AppColors.appBlue,
    fontSize: 19,
    fontFamily: 'Roboto'
  },
  btnStyle: {
    paddingTop: 6,
    paddingBottom: 6,
    width: 180,
    backgroundColor: AppColors.appBlue,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
    height: 35,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Roboto'
  },
});
