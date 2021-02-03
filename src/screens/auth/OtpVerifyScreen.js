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
import { BASE_URL_API, LOGIN_API } from '../../config/api_config';
import { PostApiCall, PostApiRequest } from '../../util/ApiCall';
import { SaveUser, GetUser, Logout } from '../../util/LocalStorage';

import OTPInputView from '@twotalltotems/react-native-otp-input'

const skipArrow = require('../../../assets/images/icons/right-arrow-2.png');

class OtpVerifyScreen extends Component {
  //6071
  state = { otp: '', userId: '', isLoading: false, data: {}, errorMsg: '' };

  constructor(props) {
    super(props);
    // this.state = {
    // };
    this.onChangeText = this.onChangeText.bind(this);
    this.logPrint = this.logPrint.bind(this);
    const { navigation } = this.props;
    this.state.userId = navigation.getParam('userId', '0');
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

  otpVerify() {
    console.log(`userId from OVS: ${this.state.userId}`);
    PostApiRequest(`${BASE_URL_API}${LOGIN_API}`, {
      'email': this.state.userId,
      'otp': this.state.otp,
      'device_id': '0000',
      'fcm_id': '010101',
      'device_type': 'ios'
    }).then(data => {
      this.setState({ isLoading: false, data: data });
      console.log(`ApiResponse: ${JSON.stringify(data)}`);
      if (data != null) {
        if (data.status == '1') {
          console.log(`userdata: ${JSON.stringify(data.data)}`);
          this.setState({ errorMsg: '' });
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
              this.setState({ errorMsg: 'This OTP is incorrect' });
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
    console.log(`userId is: ${this.state.userId}`);
    const { formContainer, bodyText, scrollStyle, imgContainer, imgStyle, skipText, rowStyle, signupText } = AppStyle;
    return (
      <ScrollView contentContainerStyle={scrollStyle} keyboardShouldPersistTaps="handled">
        <View style={imgContainer}>
          <Image style={imgStyle} source={require('../../../assets/images/brand/logoBoxOla.png')} />
        </View>
        <View style={formContainer}>
        <Text style={[AppStyle.inputLable, {marginLeft:30}]}>Verification Code</Text>
          <OTPInputView
            style={{ width: '80%', height: 65, alignSelf:'center'}}
            pinCount={4}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={code => {
              //this.setState({ code })
              this.setState({ otp: code });
              if(this.state.otp.length === 4){
                this.showLoader();
              }else{
                this.setState({errorMsg: ''})
              }
            }}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code => {
              console.log(`Code is ${code}, you are good to go!`);
              this.setState({ otp: code });
            })}
          />
          <Text style={[AppStyle.errorStyle, {marginLeft:35}]}>{this.state.errorMsg}</Text>

         { /*<View>
            <FormInput lable='Verification Code' errorMsg={this.state.errorMsg} placeholder='' initValue={this.state.otp} onChangeText={(text) => this.setState({ otp: text })} />
         </View>*/}
          <FormButton text='Verify' isLoading={this.state.isLoading} onPress={this.showLoader} />
          <TouchableOpacity onPress={() => navigate('Login')}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text style={bodyText}>Change Mobile Number</Text>
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

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45
  },

  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 50,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: AppColors.appGrayLight,
    color: AppColors.appGrayDark15
  },

  underlineStyleHighLighted: {
    borderColor: AppColors.appGray,
  },
});

export default OtpVerifyScreen;
