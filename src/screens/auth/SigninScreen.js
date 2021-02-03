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
  ToastAndroid,
  Alert,
  AlertType
} from 'react-native';

import AppStyle from '../../style/AppStyle';
import FormInput from '../../component/FormInput';
import AppColrs from '../../values/AppColors';
import AppColors from '../../values/AppColors';
import FormButtom from '../../component/FormButton';
import FormButton from '../../component/FormButton';
import { LengthLimit, MarginView } from '../../values/IntValue';
import { firstNameValidator, lastNameValidator, emailValidator, mobileValidator } from '../../util/Validation';
import { PostApiCall, PostApiRequest } from '../../util/ApiCall';
import { BASE_URL_API, GET_OTP_SIGNIN } from '../../config/api_config';
import strings from '../../values/LangStrings';

const skipArrow = require('../../../assets/images/icons/right-arrow-2.png');

class SigninScreen extends Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    errorFirstName: '',
    errorLastName: '',
    errorEmail: '',
    errorMobile: '',
    isLoading: false,
    data: {},
  };

  constructor(props) {
    super(props);
    // this.state = {
    // };
    this.onChangeText = this.onChangeText.bind(this);
    this.logPrint = this.logPrint.bind(this);
  }

  logPrint() {
    // const { navigation } = this.props;
    console.log(this.state.userId);
    // navigation.navigate('App');
  }

  showLoader = () => {
    this.setState({ isLoading: true, errorFirstName: '', errorLastName: '', errorEmail: '', errorMobile: '' }, this.getOtp);
  }
  getOtp() {
    PostApiRequest(`${BASE_URL_API}${GET_OTP_SIGNIN}`, {
      'mobile_number': this.state.mobile,
      'email': this.state.email,
      'check_account': 'false'
    }).then((data) => {
      if (data != null) {
        this.setState({ isLoading: false, data: data });
        console.log(`response: ${JSON.stringify(data)}`)
        if (data.status == '1') {
          this.props.navigation.navigate('OtpVerifyS', { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, mobile: this.state.mobile });
        } else {
          switch (data.statusCode) {
            case '401':
              this.setState({ errorMobile: data.message });
              break;
            case '400':
              this.setState({ errorEmail: data.message });
              break;
            default:
              console.log(`Somthing went wrong`);
          }
        }
      } else {
        this.setState({ isLoading: false });

        //ToastAndroid.show('Somthing went wrong', ToastAndroid.SHORT);
        console.log(`Somthing went wrong`);
        Alert.alert('Somthing went wrong', '');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  validateAllFields = () => {
    var validateFName = firstNameValidator(this.state.firstName);
    var validateLName = lastNameValidator(this.state.lastName);
    var validateEmail = emailValidator(this.state.email);
    var validateMobile = mobileValidator(this.state.mobile);
    if (validateFName == '' && validateLName == '' && validateEmail == '' && validateMobile == '') {
      this.showLoader();
    } else {
      this.setState({ errorFirstName: validateFName, errorLastName: validateLName, errorEmail: validateEmail, errorMobile: validateMobile });
    }
  }

  onChangeText(value) {
    this.setState({ userId: value });
    console.log(`text value is ${value}`);
  }
  render() {
    const { navigate } = this.props.navigation;
    const { formContainer, bodyText, bodySmall, bodySmallBlue, scrollStyle, imgContainer1, imgStyle, skipText, rowStyle, signupText, rowSBStyle, inputSpacing, inputSpacingH } = AppStyle;
    return (
      <ScrollView contentContainerStyle={scrollStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={imgContainer1}>
          <Image style={imgStyle} source={require('../../../assets/images/brand/logoBoxOla.png')} />
        </View>
        <View style={formContainer}>
          <View style={rowSBStyle}>
            <View style={{ flex: 1 }}>
              <FormInput lable='First Name' errorMsg={this.state.errorFirstName} maxLength={LengthLimit.firstName} placeholder='' initValue={this.state.firstName} onChangeText={(text) => this.setState({ firstName: text })} />
            </View>
            <View style={inputSpacingH} />
            <View style={{ flex: 1 }}>
              <FormInput lable='Last Name' errorMsg={this.state.errorLastName} maxLength={LengthLimit.lastName} placeholder='' initValue={this.state.lastName} onChangeText={(text) => this.setState({ lastName: text })} />
            </View>
          </View>
          <View style={inputSpacing} />
          <FormInput autoCapitalize={'none'} lable='Email' errorMsg={this.state.errorEmail} placeholder='' maxLength={LengthLimit.email} initValue={this.state.email} onChangeText={(text) => this.setState({ email: text })} />
          <View style={inputSpacing} />
          <FormInput lable='Mobile' errorMsg={this.state.errorMobile} placeholder='' maxLength={LengthLimit.mobile} initValue={this.state.mobile} onChangeText={(text) => this.setState({ mobile: text })} />
          <View style={{ height: 10 }} />
          <View style={rowStyle}>
            <Text style={bodySmall}>{strings.signingTC} </Text>
            <Text style={bodySmallBlue}>{strings.terms}</Text>
          </View>
          <View style={{ height: 4 }} />
          <View style={rowStyle}>
            <Text style={bodySmall}>&</Text>
            <Text style={bodySmallBlue}>{strings.pp}</Text>
          </View>
          <FormButton text='Signup' isLoading={this.state.isLoading} onPress={this.validateAllFields} />
        </View>
        <View style={{ marginTop: 100, marginBottom: 50 }}>
          <View>
            <TouchableOpacity onPress={() => navigate('App')}>
              <View style={rowStyle}>
                <Text style={skipText}>Skip</Text>
                <Image source={skipArrow} />
              </View>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
            <View style={rowStyle}>
              <Text style={bodyText}>Already have an account?</Text>
              <View style={{ width: 4 }} />
              <TouchableOpacity onPress={() => navigate('Login')}>
                <Text style={signupText}>Login here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default SigninScreen;
