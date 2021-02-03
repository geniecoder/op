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
  Alert
} from 'react-native';

import FormInput from '../../component/FormInput';
import AppColrs from '../../values/AppColors';
import AppColors from '../../values/AppColors';
import FormButtom from '../../component/FormButton';
import FormButton from '../../component/FormButton';
import AppStyle from '../../style/AppStyle';

import { PostApiCall, PostApiRequest } from '../../util/ApiCall';
import { BASE_URL_API, GET_OTP_API } from '../../config/api_config';

import { GetUser } from '../../util/LocalStorage';
import strings from '../../values/LangStrings';
import { emailValidator, phoneValidator, userIdValidator } from '../../util/Validation';

const skipArrow = require('../../../assets/images/icons/right-arrow-2.png');


class LoginScreen extends Component {

  static navigationOptions = {
    title: 'Home',
  };

  state = { userId: '', isLoading: false, data: {}, errorMsg: '' };

  constructor(props) {
    super(props);
    // this.state = {
    // };
    this.onChangeText = this.onChangeText.bind(this);
    this.logPrint = this.logPrint.bind(this);
    //this.onPress = this.onPress.bind(this);
    GetUser().then((userData) => {
      if (userData != null) {
        console.log(`GetUser: ${userData.token}`);
        this.props.navigation.navigate('App');
        return 'App';
      } else {
        console.log(`user is not avilable`);
        return 'Auth';
      }
    });
  }

  logPrint() {
    // const { navigation } = this.props;
    console.log(this.state.userId);
    // navigation.navigate('App');
  }

  onChangeText(value) {
    this.setState({ userId: value });
    console.log(`text value is ${value} state value: ${this.state.userId}`);
  }

  showLoader = () => {
    var validate = userIdValidator(this.state.userId);
    console.log(`userId check: ${validate}`);
    if (validate == '') {
      this.setState({ errorMsg: '', isLoading: true }, this.getOtp);
    } else {
      this.setState({ errorMsg: validate });
    }
  };

  getOtp() {
    console.log(`userId from LS: ${this.state.userId}`);
    PostApiRequest(`${BASE_URL_API}${GET_OTP_API}`,
      {
        'email': this.state.userId
      }
    ).then(data => {
      this.setState({ isLoading: false, data: data });
      //console.log(`ApiResponse: ${JSON.stringify(data)}`);
      if (data != null) {
        if (data.status == '1') {
          this.props.navigation.navigate('OtpVerify', { userId: this.state.userId });
        } else {
          switch (data.statusCode) {
            case '401':
              this.setState({ errorMsg: data.message });
              break;
            default:
              console.log(`Somthing went wrong`);
          }
          if (data.statusCode == '401') {
            this.setState({ errorMsg: data.message });
          } else {
            console.log(`Somthing went wrong`);
          }
        }
      } else {
        Alert.alert('Somthing went wrong');
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { formContainer, bodyText, scrollStyle, imgContainer, imgStyle, skipText, rowStyle, signupText } = AppStyle;
    return (
      <ScrollView contentContainerStyle={scrollStyle} keyboardShouldPersistTaps="handled" >
        <View style={imgContainer}>
          <Image style={imgStyle} source={require('../../../assets/images/brand/logoBoxOla.png')} />
        </View>
        <View style={formContainer}>
          <View>
            <FormInput autoCapitalize={'none'} lable={strings.loginLable} placeholder='' initValue={this.state.userId} errorMsg={this.state.errorMsg} onChangeText={this.onChangeText} />
          </View>
          <FormButton text={strings.loginBtn} isLoading={this.state.isLoading} onPress={this.showLoader} />
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
              <Text style={bodyText}>{strings.signupAsk}</Text>
              <View style={{ width: 4 }} />
              <TouchableOpacity onPress={() => navigate('Signup')}>
                <Text style={signupText}>{strings.signupLink}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default LoginScreen;
