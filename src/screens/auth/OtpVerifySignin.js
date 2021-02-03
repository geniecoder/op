import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal,
  AsyncStorage,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Button,
} from 'react-native';

import FormInput from '../../component/FormInput';
import AppColrs from '../../values/AppColors';
import AppColors from '../../values/AppColors';
import FormButtom from '../../component/FormButton';
import FormButton from '../../component/FormButton';
import AppStyle from '../../style/AppStyle';
import { BASE_URL_API, OTP_VERIFY_SIGNIN, GET_OTP_SIGNIN, REGISTER } from '../../config/api_config';
import { PostApiCall, PostApiRequest } from '../../util/ApiCall';
import { SaveUser, GetUser, Logout } from '../../util/LocalStorage';
import strings from '../../values/LangStrings';

const skipArrow = require('../../../assets/images/icons/right-arrow-2.png');

class OtpVerifySignin extends Component {
  state = {
    otp: '',
    isLoading: false,
    data: {},
    errorMsg: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  };

  constructor(props) {
    super(props);
    // this.state = {
    // };
    this.onChangeText = this.onChangeText.bind(this);
    this.logPrint = this.logPrint.bind(this);
    const { navigation } = this.props;
    this.state.firstName = navigation.getParam('firstName', '');
    this.state.lastName = navigation.getParam('lastName', '');
    this.state.email = navigation.getParam('email', '');
    this.state.mobile = navigation.getParam('mobile', '');
  }

  logPrint() {
    // const { navigation } = this.props;
    console.log(this.state.otp);
    // navigation.navigate('App');
  }

  onChangeText(value) {
    this.setState({ userId: value });
    console.log(`text value is ${value}`);
  }

  showLoader = () => {
    this.setState({ isLoading: true }, this.otpVerify);
  };

  getOtp() {
    PostApiRequest(`${BASE_URL_API}${GET_OTP_SIGNIN}`, {
      'mobile_number': this.state.mobile,
      'email': this.state.email,
      'check_account': 'false'
    }).then((data) => {
      this.setState({ isLoading: false, data: data });
      if (data.status == '1') {
        console.log('otp sent successfully');
        //this.props.navigation.navigate('OtpVerifyS', {firstName: this.state.firstName, lastName: this.lastName });
      } else {
        console.log('otp sent failed');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  otpVerify() {
    console.log(`userId from OVS: ${this.state.userId}`);
    const bodyObj = {
      data: {
        firstname: this.state.firstName,
        lastname: this.state.lastName,
        mobile_number: this.state.mobile,
        check_account: "false",
        verified_mobile: 1,
        otp: this.state.otp,
        email: this.state.email,
        fcm_id: '',
        device_type: '',
        device_id: ''
      }
    }
    PostApiRequest(`${BASE_URL_API}${REGISTER}`, bodyObj)
      .then(data => {
        this.setState({ isLoading: false, data: data });
        console.log(`ApiResponse: ${JSON.stringify(data)}`);
        if (data != null) {
          if (data.status == '1') {
            this.setState({ errorMsg: '' });
            console.log(`userdata: ${JSON.stringify(data.data)}`);
            SaveUser(data.data)
              .then((res) => {
                console.log(`SaveUser: ${res}`);
                this.props.navigation.navigate('App');
                /*GetUser().then((userData) => {
                  if(userData != null){
                    console.log(`GetUser: ${userData.token}`);
                  }else{
                    console.log(`user is not avilable`);
                  }
                });*/
              });
          } else {
            switch (data.statusCode) {
              case '401':
                this.setState({ errorMsg: data.message });
                break;
              default:
                console.log('Somthing went wrong');
            }
          }
        } else {
          console.log('Somthing went wrong');
        }
        //this.props.navigation.navigate('OtpVerify', {userId: this.state.userId});
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    const { formContainer, bodyText, scrollStyle, imgContainer, imgStyle, skipText, rowStyle, signupText } = AppStyle;
    return (
      <ScrollView contentContainerStyle={scrollStyle} keyboardShouldPersistTaps="handled" >
        <View style={imgContainer}>
          <Image style={imgStyle} source={require('../../../assets/images/brand/logoBoxOla.png')} />
        </View>
        <View style={formContainer}>
          <View>
            <FormInput lable='Verification Code' errorMsg={this.state.errorMsg} placeholder='' initValue={this.state.otp} onChangeText={(text) => this.setState({ otp: text })} />
          </View>
          <FormButton text='Verify' isLoading={this.state.isLoading} onPress={this.showLoader} />
          <TouchableOpacity onPress={() => {
            this.getOtp();
          }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text style={bodyText}>{strings.resendOtp}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 100, marginBottom: 50 }}>
          <View>
            <TouchableOpacity onPress={() => navigate('App')}>
              <View style={rowStyle}>
                <Text style={skipText}>Skip</Text>
                <Image source={skipArrow} />
              </View>
            </TouchableOpacity>
            <View style={{ height: 4 }} />
            <View style={rowStyle}>
              <Text style={AppStyle.bodyText}>Don't have an account yet?</Text>
              <View style={{ width: 4 }} />
              <TouchableOpacity onPress={() => navigate('Signup')}>
                <Text style={signupText}>Signup here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default OtpVerifySignin;
