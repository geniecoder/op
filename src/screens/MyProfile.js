import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';
import FormInput from '../component/FormInput';
import { LengthLimit, MarginView } from '../values/IntValue';
import femenine from '../../assets/images/icons/femenine.png'
import masculine from '../../assets/images/icons/masculine.png'
import calender from '../../assets/images/icons/calendar-2.png';
import ButtonRect from '../component/ButtonRect';
import ButtonWide from '../component/ButtonWide';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { UPDATE_PROFILE, BASE_URL_API } from '../config/api_config';
import { PutApiRequest } from '../util/ApiCall';
import SnackBar from 'react-native-snackbar-component';
import { SaveUser, GetUser, Logout } from '../util/LocalStorage';
import ProductDataManager from '../util/ProductDataManager';

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: null,
      editMode: false,
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      dob: '',
      gender: 'male',
      showDatePicker: false,
      isProfileUpdated: false
    };
    this.genderSelectorView = this.genderSelectorView.bind(this);
  }
  componentDidMount() {
    console.log(`user: ${this.state.user}`);
    GetUser().then((userData) => {
      if (userData != null) {
        this.setState({
          user: userData,
          firstName: userData.first_name, lastName: userData.last_name, email: userData.email,
          gender: userData.gender == "1" ? 'male' : 'female', mobile: userData.mobile, dob: userData.dob
        });
        console.log(`user ${JSON.stringify(this.state.user)}`);
       //. this.getData();
        return 'App';
      } else {
        return 'Auth';
      }
    });
  }

  updateProfile() {

    const { user, email, firstName, lastName, dob, mobile, gender } = this.state;
    const genderValue = gender === 'male' ? '1' : '2';
    const bodyObj = {
      "customer": {
        "id": user.customer_id,
        "email": email,
        "firstname": firstName,
        "lastname": lastName,
        "website_id": '1',
        "dob": dob,
        "gender": genderValue
      }
    }
    console.log(`going to call putApiRequest`);
    //console.log();

    PutApiRequest(`${BASE_URL_API}${UPDATE_PROFILE}`, bodyObj).
      then((response) => {
        console.log(`response: ${JSON.stringify(response)}`);
        this.updateLoginObj(response);
        this.setState({ isProfileUpdated: true });
        setTimeout(() => {
          this.setState({ isProfileUpdated: false });
        }, 3000)
      }).catch(error => {
        console.log(`error ${error}`)
      });
  }
  updateLoginObj(response) {
    const loginObj = {
      "customer_id": response.id,
      "token": ProductDataManager.getInstance().getUser().token,
      "first_name": response.firstname,
      "last_name": response.lastname,
      "email": response.email,
      "gender": response.gender,
      "dob": response.dob,
      "referral_code": ProductDataManager.getInstance().getUser().referral_code,
      "cartid": ProductDataManager.getInstance().getUser().cartid,
      "cart_count": ProductDataManager.getInstance().getUser().cart_count,
      "mobile": ProductDataManager.getInstance().getUser().mobile
    }
    SaveUser(loginObj).then((res) => {
      console.log(`SaveUser: ${res}`);
      ProductDataManager.getInstance().setUser(res);
    });

  }
  handleConfirm = date => {
    console.log("A date has been picked: ", date);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    //const callMeDate = `${date.getHours() % 12 || 12}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'} - ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    //const prescriptionValidityCallTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours() % 12 || 12}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
    const selectedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    this.setState({
      dob: selectedDate,
      showDatePicker: false
    });
    console.log(`selected date: ${selectedDate}`);
    //console.log(`here is the callMeDate: ${callMeDate}  - ${date}`);
  };
  genderButtonView(img, text, selected) {
    if (selected) {
      return (
        <View style={{ flex:1, flexDirection: 'row', backgroundColor: AppColors.appBlue, height: 30, width: 150, alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
          <Image style={{ tintColor: 'white' }} source={img} />
          <Text style={{ color: 'white', marginLeft: 10, fontFamily: 'Roboto' }}>{text}</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex:1, flexDirection: 'row', height: 30, width: 150, alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: 'black', borderWidth: .2 }}>
          <Image style={{ tintColor: AppColors.appGrayDark }} source={img} />
          <Text style={{ color: AppColors.appGrayDark, marginLeft: 10, fontFamily: 'Roboto' }}>{text}</Text>
        </View>
      );
    }
  }

  genderSelectorView() {
    return (
      <View>
        <Text style={[AppStyle.bodyText, { marginBottom: 10 }]}>
          Gender
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.state.editMode) {
                this.setState({ gender: 'male' });
              }
            }}>
            {this.state.gender === 'male' || this.state.gender === 1 ? this.genderButtonView(masculine, 'male', true) : this.genderButtonView(masculine, 'male', false)}
          </TouchableWithoutFeedback>
          <View style={{width:22}}/>
          <TouchableWithoutFeedback
            onPress={() => {
              if (this.state.editMode) {
                this.setState({ gender: 'female' })
              }
            }}>
            {this.state.gender === 'female' || this.state.gender === 2  ? this.genderButtonView(femenine, 'female', true) : this.genderButtonView(femenine, 'female', false)}
          </TouchableWithoutFeedback>

        </View>
      </View>
    );
  }
  render() {
    const { navigation } = this.props;
    const {firstName, lastName} = this.state;
    return (
      <View style={AppStyle.pageContainer}>
        <Header navigation={navigation} title='My Profile' onPressEdit={() => {
          this.setState({ editMode: true });
        }} />
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
            <View style={{ flexDirection: 'row', width: 150, height: 150, backgroundColor: '#0d447a', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.profileNameText}>{firstName? firstName.charAt(0) : ''}</Text>
              <Text style={styles.profileNameText}>{lastName? lastName.charAt(0) : ''}</Text>
            </View>
          </View>
          <View style={[AppStyle.formContainer, { marginTop: 30 }]}>
            <View style={[AppStyle.rowSBStyle]}>
              <View style={{ flex: 1 }}>
                <FormInput lable='First Name' editable={this.state.editMode} maxLength={LengthLimit.firstName} initValue={this.state.firstName} onChangeText={(text) => this.setState({ firstName: text })} />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <FormInput lable='Last Name' initValue={this.state.lastName} editable={this.state.editMode} onChangeText={(text) => this.setState({ lastName: text })} />
              </View>
            </View>
            <FormInput lable='Email' editable={this.state.editMode} initValue={this.state.email} onChangeText={(text) => this.setState({ email: text })} />
            <FormInput lable='Mobile' editable={false} initValue={this.state.mobile} onChangeText={(text) => this.setState({ mobile: text })} />
            <TouchableWithoutFeedback
              onPress={() => {
                console.log(`change dob`);
                if (this.state.editMode) {
                  this.setState({ showDatePicker: true });
                }

              }}>
              <View style={{ marginBottom: 15 }}>
                <Text style={AppStyle.inputLable}>DOB</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                  <Text>{this.state.dob}</Text>
                  <Image source={calender} />
                </View>
                <View style={{ height: .5, flex: 1, backgroundColor: AppColors.appGray }} />
              </View>
            </TouchableWithoutFeedback>
            <this.genderSelectorView />
          </View>
        </ScrollView>
        {this.state.editMode === true ?
          <View style={{ flexDirection: 'row'}}>
            <ButtonWide text='Cancel' backgroundColor={AppColors.appGray} onPress={() => { this.setState({ editMode: false }) }} />
            <ButtonWide text='Save' backgroundColor={AppColors.appBlue}
              onPress={() => {
                this.updateProfile();
                console.log(`Save info`);
                this.setState({ editMode: false })
              }} />
          </View> :
          <View />
        }

        <DateTimePicker
          isVisible={this.state.showDatePicker}
          onConfirm={this.handleConfirm}
          onCancel={() => this.setState({ showDatePicker: false })}
          mode="date"
          date={this.state.dateObject}
        />
        <SnackBar
          visible={this.state.isProfileUpdated}
          textMessage="Profile has been updated!"
          actionHandler={() => {
            console.log("snackbar button clicked!");
            this.props.navigation.navigate('Home');
          }}
          actionText="Goto Home"
          containerStyle={
            AppStyle.containerStyle
          } />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  profileNameText: {
    fontFamily: 'Roboto',
    fontSize: 42,
    color: '#e6ecf1'
  },
});

export default MyProfile;
