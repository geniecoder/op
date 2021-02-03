import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';
import gpsIcon from '../../assets/images/icons/gps.png';
import { PostApiRequest } from '../util/ApiCall';
import { BASE_URL_API, GET_CITY, CITY_MATCH } from '../config/api_config';
import ProductDataManager from '../util/ProductDataManager';
import Geolocation from '@react-native-community/geolocation';
import AlertPopup from '../component/popup/AlertPopup';

class CitySelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            city: '',
            isLoading: false,
            isLoadingLocation: false,
            showAlert: false
        };

        this.contentView = this.contentView.bind(this);
        this.cityListView = this.cityListView.bind(this);
    }
    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({ isLoading: true });
        PostApiRequest(`${BASE_URL_API}${GET_CITY}`).
            then(response => {
                console.log(`response ${JSON.stringify(response)}`);
                if (response.status === '1') {
                    this.setState({ isLoading: false, data: response.data });
                }
            }).catch(error => {
                console.log(`error ${error}`);
            })
    }

    findCoordinates = () => {
        this.setState({ isLoadingLocation: true });
        // https://maps.googleapis.com/maps/api/geocode/json?latlng=28.704060,77.102493&key=AIzaSyAmJrssSd-btiYXrtA4NIhyei9QJusQ5x4
        Geolocation.getCurrentPosition(info => {
            console.log(`info: ${JSON.stringify(info)}`);
            const bodyObj = {
                latlng: info.coords.latitude,
                long: info.coords.longitude
            }
            PostApiRequest(`${BASE_URL_API}${CITY_MATCH}`, bodyObj).
                then(response => {
                    console.log(`response: ${JSON.stringify(response)}`);
                    if (response.status === '1') {
                        this.setState({ isLoadingLocation: false });
                        const { city, currentcity } = response.data;
                        const cityObj = {
                            id: '',
                            city: city
                        }
                        if (city !== '') {
                            ProductDataManager.getInstance().setCity(cityObj);
                            this.props.navigation.navigate('Home');
                        } else {
                            console.log(`we are not deliver to ${currentcity}`);
                            this.setState({
                                alertTitle: 'Alert',
                                alertLine1: `We are not deliver to ${currentcity}`,
                                alertLine2: ``,
                                alertBtnText: 'Ok',
                                showAlert: true
                            });
                        }

                        //this.setState({ postalCode: pin_code, addressLine1: address1, addressLine2: address2, state: state, regionId: region_id, city: city });
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

    cityListView() {
        const { data } = this.state;

        if (data !== null) {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{ width: "100%" }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {data.map((item, index) => {
                            console.log(`ciry: ${index} ${item.ci}`)
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        ProductDataManager.getInstance().setCity(item);
                                        this.props.navigation.navigate('Home');
                                    }}>
                                    <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center', backgroundColor: 'white', borderColor: AppColors.appGrayLight, borderTopWidth: 1, }}>
                                        <Text style={AppStyle.textSmallBold, { marginLeft: 15 }}>{item.city}</Text>
                                    </View>
                                </TouchableOpacity>

                            )
                        })}
                    </ScrollView>
                </View>
            );
        } else {
            return <View />
        }
    }

    loadingView() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    contentView() {
        if (this.state.isLoading) {
            return this.loadingView();
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.findCoordinates();
                        }}>
                        <View style={{ flexDirection: 'row', height: 60, paddingHorizontal: 20, marginTop: 10, alignItems: 'center', backgroundColor: 'white', borderColor: AppColors.appGrayLight, borderTopWidth: 1, borderBottomWidth: 1, justifyContent: 'space-between', }}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <Image source={gpsIcon} />
                                <Text style={AppStyle.textSmallBold, { marginLeft: 15 }}>Auto Detect Current Location</Text>
                            </View>
                            {this.state.isLoadingLocation ?
                                <ActivityIndicator size="small" color="#000" /> :
                                <View />
                            }

                        </View>
                    </TouchableOpacity>

                    <View style={{ height: 10 }} />
                    <this.cityListView />
                    <AlertPopup isVisible={this.state.showAlert}
                        closeModal={() => this.closeAlert()}
                        text1={this.state.alertLine1}
                        text2={this.state.alertLine2}
                        title={this.state.alerttitle}
                        btnText={this.state.alertBtnText}
                        title={this.state.alertTitle}
                        onPress={() => {
                            this.setState({ showAlert: false });
                        }}
                    />
                </View>
            );
        }

    }



    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
                <Header navigation={navigation} title='Select City' />
                <this.contentView />
            </View>
        );
    }
}

export default CitySelection;
