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
    AlertType,
    TouchableWithoutFeedback,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';
import strings from '../values/LangStrings';
const skipArrow = require('../../assets/images/icons/right-arrow-2.png');
import homeIcon from '../../assets/images/icons/homeIcon.png'
import calender from '../../assets/images/icons/calendar-2.png';
import briefcase from '../../assets/images/icons/briefcase.png';
import placeIcon from '../../assets/images/icons/placeholder-4.png';
import gpsIcon from '../../assets/images/icons/gps.png';
import { GetUser } from '../util/LocalStorage';


import FormInput from '../component/FormInput';
import FormDropDown from '../component/FormDropDown';


import FormButtom from '../component/FormButton';
import FormButton from '../component/FormButton';
import { LengthLimit, MarginView } from '../values/IntValue';
import { firstNameValidator, lastNameValidator, emailValidator, mobileValidator, addressValidator, cityValidator, stateValidator, pinCodeValidator } from '../util/Validation';
import { GetApiRequest, PostApiRequest } from '../util/ApiCall';
import { BASE_URL_API, REGION_LIST, ADD_ADDRESS, EDIT_ADDRESS, GOOGLE_LOCATION, LOCATION_DETECT } from '../config/api_config';

import checkedIcon from '../../assets/images/icons/checkboxChecked.png';
import uncheckedIcon from '../../assets/images/icons/checkboxUnchecked.png';


import Geolocation from '@react-native-community/geolocation';
import RetryView from '../component/RetryView';

import ProductDataManager from '../util/ProductDataManager';


class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            mobile: '',
            addressLine1: '',
            addressLine2: '',
            addressType: '',
            landmark: '',
            postalCode: '',
            state: '',
            city: '',
            addressType: 1,
            errorFirstName: '',
            errorLastName: '',
            errorEmail: '',
            errorMobile: '',
            errorAddressLine1: '',
            errorAddressLine2: '',
            errorLandmark: '',
            errorCity: '',
            errorPostalCode: '',
            errorState: '',
            isLoading: false,
            data: null,
            regionData: null,
            editMode: true,
            regionDataMap: null,
            regionId: 537,
            selectedDefaultCheck: false,
            isDefaultAddress: false,
            formType: 'new',
            addressId: '',
            retryVisible: false
        };
        this.contentView = this.contentView.bind(this);
        this.buttonSelectorView = this.buttonSelectorView.bind(this);
        this.trimAllFileds = this.trimAllFileds.bind(this);
        this.toggleCheckBox = this.toggleCheckBox.bind(this);

        this.state.comeFrom = this.props.navigation.getParam('comeFrom', '');

        const addressItem = this.props.navigation.getParam('addressItem', '');
        console.log(`addressItem: ${JSON.stringify(addressItem)}`);
        if (addressItem !== '') {
            this.state.formType = 'edit';
            this.state.firstName = addressItem.firstname;
            this.state.lastName = addressItem.lastname;
            this.state.mobile = addressItem.telephone;
            this.state.addressLine1 = addressItem.street[0];
            this.state.addressLine2 = addressItem.street[1] !== undefined ? addressItem.street[1] : '';
            this.state.landmark = addressItem.street[2] !== undefined ? addressItem.street[2] : '';
            this.state.city = addressItem.city;
            this.state.postalCode = addressItem.postcode;
            this.state.regionId = addressItem.region_id.toString();
            this.state.addressType = Number(addressItem.address_type);
            this.state.selectedDefaultCheck = addressItem.default === 1 ? true : false;
            this.state.addressId = addressItem.entity_id;
        }
    }
    componentDidMount() {
        this.getRegionData();
        GetUser().then((userData) => {
            if (userData != null) {
                this.setState({ user: userData, firstName: userData.first_name, lastName: userData.last_name, mobile: userData.mobile });
                console.log(`user ${JSON.stringify(this.state.user)}`);
                //this.getData();

                this.getCartDetails();
                return 'App';
            } else {
                return 'Auth';
            }
        });

    }
    getRegionData() {
        GetApiRequest(`${BASE_URL_API}${REGION_LIST}`)
            .then((response) => {
                //console.log(`response ${JSON.stringify(response)}`);
                if (response.status === '1') {
                    console.log(`response: ${JSON.stringify(response)}`);
                    this.convertToMap(response.data);
                    this.setState({
                        regionData: response.data,
                        isLoading: false
                    });
                }
            })
            .catch((error) => {
                console.log(`error ${error}`);
                this.setState({ isLoading: false, retryVisible: true });
            });
    }

    convertToMap(jsonData) {
        var data = jsonData.map(function (item) {
            return {

                label: item.region_name,
                value: item.region_id,
            };
        });
        this.setState({ regionDataMap: data });
        console.log(data);
    }

    reloadData() {
        console.log(`data reload`)
        this.setState({ isLoading: true, retryVisible: false }, this.getRegionData());

    }

    contentView() {
        const { navigate } = this.props.navigation;
        const { formContainer, bodyText, bodySmall, bodySmallBlue, scrollStyle, imgContainer1, imgStyle, skipText, rowStyle, signupText, rowSBStyle, inputSpacing, inputSpacingH } = AppStyle;

        if (this.state.retryVisible) {
            return <RetryView onPress={() => this.reloadData()} />
        }
        if (this.state.regionDataMap !== null) {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={scrollStyle}
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ height: 30 }} />
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
                           
                            <FormInput autoCapitalize={'none'} lable='Mobile' errorMsg={this.state.errorMobile} placeholder='' maxLength={LengthLimit.email} initValue={this.state.mobile} onChangeText={(text) => this.setState({ mobile: text })} keyboardType='numeric' maxLength={10} />
                            <View style={inputSpacing} />
                            
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }} >
                                    <FormInput autoCapitalize={'none'} lable='Address line 1' errorMsg={this.state.errorAddressLine1} placeholder='' maxLength={LengthLimit.email} initValue={this.state.addressLine1} onChangeText={(text) => this.setState({ addressLine1: text })} />
                                </View>
                                <View style={{ alignSelf: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.findCoordinates();
                                            //console.log(`get location`);
                                        }}>
                                        <Image style={{ marginVertical: 15 }} source={gpsIcon} />
                                    </TouchableOpacity>

                                </View>

                            </View>

                            <View style={inputSpacing} />
                            
                            <FormInput autoCapitalize={'none'} lable='Address line 2' errorMsg={this.state.errorAddressLine2} placeholder='' maxLength={LengthLimit.email} initValue={this.state.addressLine2} onChangeText={(text) => this.setState({ addressLine2: text })} />
                            <View style={inputSpacing} />
                            
                            <FormInput autoCapitalize={'none'} lable='Landmark' errorMsg={this.state.errorLandmark} placeholder='' maxLength={LengthLimit.email} initValue={this.state.landmark} onChangeText={(text) => this.setState({ landmark: text })} />
                            <View style={inputSpacing} />
                            <FormInput autoCapitalize={'none'} lable='City' errorMsg={this.state.errorCity} placeholder='' maxLength={LengthLimit.email} initValue={this.state.city} onChangeText={(text) => this.setState({ city: text })} />
                            <View style={inputSpacing} />
                            <View style={rowSBStyle}>
                                <View style={{ flex: 1 }}>
                                    <FormInput lable='Postal Code' errorMsg={this.state.errorPostalCode} maxLength={LengthLimit.firstName} placeholder='' initValue={this.state.postalCode} onChangeText={(text) => this.setState({ postalCode: text })} keyboardType='numeric' maxLength={10} />
                                </View>
                                <View style={inputSpacingH} />
                                <View style={{ flex: 1 }}>
                                    {this.state.isLoading ? <View /> : <FormDropDown lable='State' errorMsg={this.state.errorState} placeholder='Select State' regionDataMap={this.state.regionDataMap} onChange={this.onDropDownChange.bind(this)} regionId={this.state.regionId} />}
                                </View>
                            </View>
                            <this.buttonSelectorView />
                            <View style={inputSpacing} />
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    this.toggleCheckBox();
                                }}>
                                    <Image style={{ marginRight: 12, tintColor: '#56ccf2' }} source={this.state.selectedDefaultCheck ? checkedIcon : uncheckedIcon} />
                                </TouchableOpacity>
                                <Text style={AppStyle.bodyText}>Use as my default shipping address</Text>
                            </View>

                            <View style={{ height: 40 }} />
                        </View>
                    </ScrollView>
                    <ButtonRect isLoading={this.state.isLoading} text='Save' onPress={this.trimAllFileds} />
                </View>
            );
        } else {
            return <View />
        }
    }





    findCoordinates = () => {
        // https://maps.googleapis.com/maps/api/geocode/json?latlng=28.704060,77.102493&key=AIzaSyAmJrssSd-btiYXrtA4NIhyei9QJusQ5x4
        Geolocation.getCurrentPosition(info => {
            console.log(`info GPS: ${JSON.stringify(info)}`);
            const bodyObj = {
                latlng: info.coords.latitude,
                long: info.coords.longitude
            }
            PostApiRequest(`${BASE_URL_API}${LOCATION_DETECT}`, bodyObj).
                then(response => {
                    console.log(`response: ${JSON.stringify(response)}`);
                    if (response.status === '1') {
                        const { state, country, pin_code, address1, address2, region_id, city } = response.data;
                        this.setState({ postalCode: pin_code, addressLine1: address1, addressLine2: address2, state: state, regionId: region_id, city: city });
                    }

                }).
                catch(error => {
                    console.log(`error ${error}`);
                });
        });

        /*Geolocation.getCurrentPosition(
            position => {
                const location = JSON.stringify(position);

                console.log(`location: ${JSON.stringify(location)}`);
                //this.setState({ location });
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );*/
    };

    toggleCheckBox = () => {

        if (this.state.selectedDefaultCheck) {
            // removePrescription(data.id);
        } else {
            // addPrescription(prescriptionObj);
        }
        this.setState(() => ({ selectedDefaultCheck: !this.state.selectedDefaultCheck }));
    }

    onDropDownChange(value, index) {
        console.log(`value and index: ${value} : ${index}`);
        this.setState({ regionId: value });
    }

    trimAllFileds() {


        this.setState({
            firstName: this.state.firstName.trim(),
            lastName: this.state.lastName.trim(),
            mobile: this.state.mobile.trim(),
            addressLine1: this.state.addressLine1.trim(),
            addressLine2: this.state.addressLine2.trim(),
            landmark: this.state.landmark.trim(),
            city: this.state.city.trim(),
            postalCode: this.state.postalCode.trim(),
        }, this.validateAllFields);
    }

    validateAllFields = () => {
        var validateFName = firstNameValidator(this.state.firstName);
        var validateLName = lastNameValidator(this.state.lastName);
        // var validateEmail = emailValidator(this.state.email);
        var validateMobile = mobileValidator(this.state.mobile);
        var validateAddress = addressValidator(this.state.addressLine1);
        var validateCity = cityValidator(this.state.city);
        var validatePinCode = pinCodeValidator(this.state.postalCode);
        var validateState = stateValidator(this.state.regionId);
        if (validateFName == '' && validateLName == '' && validateMobile == '' && validateAddress == '' && validateCity == '' && validateState == '' && validatePinCode == '') {
            this.showLoader();
            // this.setState({ errorFirstName: validateFName, errorLastName: validateLName, errorEmail: validateEmail, errorMobile: validateMobile, errorAddressLine1: validateAddress, errorCity: validateCity, errorState: validateState });
        } else {
            this.setState({ errorFirstName: validateFName, errorLastName: validateLName, errorMobile: validateMobile, errorAddressLine1: validateAddress, errorCity: validateCity, errorState: validateState, errorPostalCode: validatePinCode });
        }
    }
    showLoader = () => {
        this.setState({ isLoading: true, errorFirstName: '', errorLastName: '', errorMobile: '', state: '' }, this.saveAddress);
    }

    saveAddress() {



        const bodyObj = {
            data: {
                customer_id: this.state.user.customer_id,
                region_id: this.state.regionId,
                country_code: "IN",
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                address_type: this.state.addressType,
                region_name: "Haryana",
                street_1: this.state.addressLine1,
                street_2: this.state.addressLine2,
                landmark: this.state.landmark,
                postcode: this.state.postalCode,
                city: this.state.city,
                is_default: this.state.selectedDefaultCheck ? 1 : 0,
                telephone: this.state.mobile,
                address_id: this.state.addressId
            }
        }
        PostApiRequest(`${BASE_URL_API}${this.state.formType === 'edit' ? EDIT_ADDRESS : ADD_ADDRESS}`, bodyObj)
            .then((data) => {
                if (data != null) {
                    this.setState({ isLoading: false, data: data });
                    if (data.status === '1') {
                        if (this.state.comeFrom === 'checkout') {
                            this.props.navigation.navigate('CheckoutScreen', { selectedAddress: data.data[0] });
                        } else {
                            this.props.navigation.goBack();
                        }

                        console.log(`save address response: ${JSON.stringify(data)}`);
                        //this.props.navigation.navigate('OtpVerifyS', { firstName: this.state.firstName, lastName: this.lastName, email: this.state.email, mobile: this.state.mobile });
                    } else {
                        switch (data.statusCode) {
                            case '401':
                                this.setState({ errorEmail: data.message });
                                break;
                            case '400':
                                this.setState({ errorMobile: data.message });
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

    selectAddress(addressItem) {
        const { navigation } = this.props;
        if (this.state.comeFrom === 'checkout') {
            navigation.navigate('CheckoutScreen', { selectedAddress: addressItem });
        }
    }



    selectionButtonView(img, text, selected) {
        if (selected) {
            return (
                <View style={{ flexDirection: 'row', backgroundColor: AppColors.appBlue, height: 30, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                    <Image style={{ tintColor: 'white' }} source={img} />
                    <Text style={{ color: 'white', marginLeft: 10, fontFamily: 'Roboto' }}>{text}</Text>
                </View>
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', height: 30, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 4, borderColor: 'black', borderWidth: .2 }}>
                    <Image style={{ tintColor: AppColors.appGrayDark }} source={img} />
                    <Text style={{ color: AppColors.appGrayDark, marginLeft: 10, fontFamily: 'Roboto' }}>{text}</Text>
                </View>
            );
        }
    }
    buttonSelectorView() {
        const { addressType } = this.state;
        return (
            <View>
                <Text style={[AppStyle.bodyText, { marginBottom: 10 }]}>
                    Address Type
            </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (this.state.editMode) {
                                this.setState({ addressType: 1 });
                            }
                        }}>
                        {this.state.addressType === 1 ? this.selectionButtonView(homeIcon, 'Home', true) : this.selectionButtonView(homeIcon, 'Home', false)}
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => {

                            if (this.state.editMode) {
                                this.setState({ addressType: 2 })
                            }

                        }}>
                        {this.state.addressType === 2 ? this.selectionButtonView(briefcase, 'Office', true) : this.selectionButtonView(briefcase, 'Office', false)}
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => {

                            if (this.state.editMode) {
                                this.setState({ addressType: 0 })
                            }
                        }}>
                        {this.state.addressType === 0 ? this.selectionButtonView(placeIcon, 'Other', true) : this.selectionButtonView(placeIcon, 'Other', false)}
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
                <Header navigation={navigation} title='Address' />
                <this.contentView />
            </View>
        );
    }
}
export default AddAddress;
