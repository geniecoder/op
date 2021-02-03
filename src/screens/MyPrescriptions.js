import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Header from '../component/Header';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import { PostApiRequest, GetApiRequest, DeleteApiRequest } from '../util/ApiCall';
import { BASE_URL_API, GET_PRES, DELETE_PRES } from '../config/api_config';
import { GetUser } from '../util/LocalStorage';
import CardMyPres from '../component/card/CardMyPres';
import ButtonRect from '../component/ButtonRect';

import PrescItem from '../component/card/PrescItem';
import RetryView from '../component/RetryView';

import PrescriptionDataManager from '../util/PrescriptionDataManager';

import AlertPopup2 from '../component/popup/AlertPopup2';
import binImg from '../../assets/images/graphic/rubbish-bin.png';




class MyPrescriptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: null,
            user: null,
            selectedPresArray: [],
            retryVisible: false,
            showAlert: false,
            alertLine1: 'Want to delete',
            alertLine2: 'Do you want to delete the prescription',
            alertBtnText1: 'Cancel',
            alertBtnText2: 'Delete',
            alertTitle: 'Alert',
        };
        this.contentView = this.contentView.bind(this);
        this.removePrescriptionIndex = this.removePrescriptionIndex.bind(this);
        this.addPrescription = this.addPrescription.bind(this);
        this.removePrescription = this.removePrescription.bind(this);
    }
    componentDidMount() {
        //console.log(`user: ${this.state.user}`);
        GetUser().then((userData) => {
            if (userData != null) {
                this.setState({ user: userData });
                //console.log(`user ${JSON.stringify(this.state.user)}`);
                this.getData();
                return 'App';
            } else {
                return 'Auth';
            }
        });
    }
    getData() {
        GetApiRequest(`${BASE_URL_API}${GET_PRES}/${this.state.user.customer_id}`)
            .then((response) => {
                this.setState({ isLoading: false, data: response.data });
                console.log(`data: ${JSON.stringify(this.state.data)}`);
            }).catch(error => {
                console.log(`error: ${error}`);
                this.setState({ isLoading: false, retryVisible: true });
            })
    }

    addPrescription(prescriptionObj) {
        //console.log(`selectedPresArray b: ${this.state.selectedPresArray.length}`);
        //const checkArrayValue = this.state.selectedPresArray;

        this.setState({
            selectedPresArray: [...this.state.selectedPresArray, prescriptionObj]
        });

        //const checkArrayValue1 = this.state.selectedPresArray;
        //console.log(`selectedPresArray a: ${this.state.selectedPresArray.length}`);


    }
    removePrescription(id) {
        var index = this.state.selectedPresArray.findIndex(
            function (item, i) {
                return item.id === id;
            }
        );
        //console.log(`remove from index ${index}`);
        var array = [...this.state.selectedPresArray];
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ selectedPresArray: array });
        }

    }

    askToRemovePrescription = (index, presId) => {
        this.setState({ showAlert: true, alertValue: { index: index, presId: presId } });
    }

    removePrescriptionIndex(index, presId) {
        //console.log(`remove from index ${index}`);
        var array = [...this.state.data];
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ data: array });
            this.removePrescription(presId);
        }

        DeleteApiRequest(`${BASE_URL_API}${DELETE_PRES}/${presId}/customer/${this.state.user.customer_id}`)
            .then((response) => {
                console.log(`del response: ${response}`);
            });
    }

    reloadData() {
        console.log(`data reload`)
        this.setState({ isLoading: true, retryVisible: false }, this.getData());

    }

    contentView() {
        const { navigation } = this.props;
        const prevSelectedPresArray = navigation.getParam('prevSelectedPresArray', []);

        if (this.state.retryVisible) {
            return <RetryView onPress={() => this.reloadData()} />
        }
        if (this.state.isLoading) {
            return this.loadingView();
        }
        if (this.state.data == null) {
            return <Text>--</Text>
        }
        //console.log(`data length:${this.state.data.length}`);
        if (this.state.data.length !== 0) {
            var selectedArray = PrescriptionDataManager.getInstance().selectedPescriptionArray;
            return (

                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) => {
                        //return <CardMyPres data={item} index={index} removePrescriptionIndex={this.removePrescriptionIndex} />
                        //return <PrescItem data={item} prevSelectedPresArray={prevSelectedPresArray} index={index} removePrescriptionIndex={this.removePrescriptionIndex} addPrescription={this.addPrescription} removePrescription={this.removePrescription} />
                        return <PrescItem data={item} index={index} removePrescriptionIndex={this.askToRemovePrescription} selectedArray={selectedArray} />
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            );
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={AppStyle.bodyText}>You have not uploaded any prescriptions yet</Text>
                </View>
            );
        }

    }
    loadingView() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#000" /></View>;
    }
    gotoNext() {
        const { navigation } = this.props;
        const { selectedPresArray } = this.state;
        /*if (selectedPresArray.length > 0) {
            this.props.navigation.state.params.margePresArray(selectedPresArray);
            this.props.navigation.navigate('UploadPresScreen', { selectedPresArray: selectedPresArray });
        }*/
        this.props.navigation.navigate('UploadPresScreen');
        //console.log(`click continue`);
        //console.log(`selectedPresArray length:${this.state.selectedPresArray.length}`);
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Header navigation={navigation} title='My Prescriptions' />
                <this.contentView />
                <ButtonRect text='Continue' onPress={() => this.gotoNext()} />
                <AlertPopup2 isVisible={this.state.showAlert}
                    closeModal={() => { this.setState({ showAlert: false }) }}
                    text1={this.state.alertLine1}
                    text2={this.state.alertLine2}
                    btnText1={this.state.alertBtnText1}
                    btnText2={this.state.alertBtnText2}
                    title={this.state.alertTitle}
                    img={binImg}
                    onPress1={() => {
                        this.setState({ showAlert: false });
                    }}
                    onPress2={() => {
                        //this.addressDeleteRequest();
                        const { index, presId } = this.state.alertValue;
                        this.removePrescriptionIndex(index, presId);
                        this.setState({ showAlert: false });
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F7'
    }
});

export default MyPrescriptions;
