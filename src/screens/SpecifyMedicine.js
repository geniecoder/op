import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    FlatList
} from "react-native";
import RadioButton from "react-native-radio-button";
import DateTimePicker from 'react-native-modal-datetime-picker';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import specifyMedicine from "../../assets/images/icons/medicines-1.png";
import calender from '../../assets/images/icons/calendar-2.png';
import attachImg from '../../assets/images/icons/attachment.png';

import PrescItem1 from '../component/card/PrescItem1';
import ButtonRect from '../component/ButtonRect';
import ProductItemSM from '../component/card/ProductItemSM';

import PrescriptionDataManager from '../util/PrescriptionDataManager';
import addIcon from '../../assets/images/icons/plus-button-small.png';
//import { FlatList } from 'react-native-gesture-handler';

import AlertPopup from '../component/popup/AlertPopup';
import AlertPopup2 from '../component/popup/AlertPopup2';

class SpecifyMedicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageTitle: 'Specify Medicine',
            orderState: '',
            prescriptionValidity: '',
            medicineValidity: '',
            prescriptionValidityCallTime: '',
            disableCheckout: true,
            callMeDate: '',
            showDatePicker: false,
            dateObject: new Date(),
            selectedPrescriptions: [],
            alertTitle: '',
            alertLine1: '',
            alertLine2: '',
            alertBtnText: '',
            showAlert: false,
            showAlert2: false
        };
        this.removePrescriptionIndex = this.removePrescriptionIndex.bind(this);
        this.showRemovePresAlert = this.showRemovePresAlert.bind(this);
        const presArray = this.props.navigation.getParam('selectedPresArray', []);
        console.log(`presArray list: ${presArray.length}`);
        this.state.selectedPrescriptions = presArray;
        //this.setState({ selectedPrescriptions: presArray });
        this.productSectionView = this.productSectionView.bind(this);
        this.removeProductFromArray = this.removeProductFromArray.bind(this);

        //auto select first redio button--

    }

    componentDidMount() {
        this.selectPrescriptionOption();
    }

    attachedPrescriptionView() {
        return (
            <View style={{ height: 200, backgroundColor: '#fff', marginTop: 15 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={attachImg} style={[{ marginLeft: 5, marginRight: 10 }, styles.imgIcons1]} />
                    <Text> Attached Prescriptions</Text>
                </View>
            </View>
        );
    }
    removePrescriptionIndex() {
        console.log(`remove from index ${this.state.presDelArrayIndex}`);
        var array = [...this.state.selectedPrescriptions];
        if (this.state.presDelArrayIndex !== -1) {
            /*array.splice(this.state.presDelArrayIndex, 1);
            this.setState({ selectedPrescriptions: array });
            this.props.navigation.state.params.margePresArray(array);*/
            PrescriptionDataManager.getInstance().removePrescriptionByIndex(this.state.presDelArrayIndex);
            this.setState({});
           // console.log(`array length: ${array.length}`);
            if (PrescriptionDataManager.getInstance().selectedPescriptionArray.length === 0) {
                this.props.navigation.goBack();
                console.log(`not prescription should go back`);

            }
        }
    }

    showRemovePresAlert(index) {

        this.setState({
            showAlert2: true,
            alert2Line1: 'Do You want to delete prescription',
            alert2Line2: '',
            alert2BtnText1: 'Cancel',
            alert2BtnText2: 'Delete',
            alertTitle2: 'Alert',
            presDelArrayIndex: index
        })
    }

    removeProductFromArray(id) {
        let prescriptionData = PrescriptionDataManager.getInstance();
        prescriptionData.removeProductFromArray(id);
        console.log(`removeProductFromArray id: ${id}`);
        this.setState({});
    }
    showAlertPopup(title, line1, line2, btnText) {
        this.setState({
            alertTitle: title,
            alertLine1: line1,
            alertLine2: line2,
            alertBtnText: btnText,
            showAlert: true
        });
    }
    /*setDate = (params) => {
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
    }*/
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
        const callMeDate = `${date.getHours() % 12 || 12}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'} - ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        const prescriptionValidityCallTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours() % 12 || 12}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
        this.setState({
            callMeDate,
            prescriptionValidityCallTime,
            dateObject: date,
            showDatePicker: false,
            disableCheckout: false,
        });
        console.log(`here is the callMeDate: ${callMeDate}`);
    };

    gotoNext() {
        const { navigation } = this.props;
        navigation.navigate('CheckoutScreen', { orderFlow: 'prescription' });
        //console.log(`clicked upload btn`);
    }

    updateState() {
        this.setState({});
    }

    navigateToProductSearch() {
        const { navigation } = this.props;
        navigation.navigate('ProductSearch', { updateParentState: this.updateState.bind(this) });
    }

    productSectionView() {
        const { navigation } = this.props;
        let prescriptionData = PrescriptionDataManager.getInstance();
        console.log(`product array singleton1: ${prescriptionData.getProductArray()}`);
        if (prescriptionData.getProductArray().length !== 0) {
            return (
                <View style={{ marginTop: 15 }}>
                    <View style={{ padding: 15, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between' }}>
                        <Text>
                            Selected Item
                        </Text>
                        <TouchableOpacity onPress={() => {
                            //navigation.navigate("ProductSearch");
                            this.navigateToProductSearch();
                        }}>
                            <Image source={addIcon} />
                        </TouchableOpacity>
                    </View>
                    {prescriptionData.getProductArray().map((item, index) => {
                        return (
                            <ProductItemSM item={item} index={index} removeProductFromArray={this.removeProductFromArray} />
                        );
                    })}
                </View>
            );
        } else {
            return <View></View>
        }
    }

    selectPrescriptionOption() {
        this.setState({
            orderState: "prescription",
            prescriptionValidity: "0",
            disableCheckout: true
        });
    }
    selectCallMeOption() {
        this.setState({
            orderState: "call_me",
            // prescriptionValidityCallTime: "0",
            disableCheckout: this.state.callMeDate ? false : true,
            showDatePicker: this.state.callMeDate ? this.state.showDatePicker : !this.state.showDatePicker,
        });
        //-- sendObj.data.call_time = prescriptionValidityCallTime;
    }
    selectMedicationOption() {
        this.navigateToProductSearch();
        this.setState({
            orderState: "medication",
            medicineValidity: "0",
            disableCheckout: this.state.orderState == 'medication' ? this.state.disableCheckout : true,
        });
        console.log(`it should option search screen`);
    }
    setPrescriptionData() {
        let prescriptionData = PrescriptionDataManager.getInstance();

        //--prescriptionData.setPrescriptionArray(this.state.selectedPrescriptions);
        prescriptionData.orderState = this.state.orderState;
        prescriptionData.prescriptionValidity = this.state.prescriptionValidity;
        prescriptionData.callTime = this.state.prescriptionValidityCallTime;
        prescriptionData.medicineValidity = this.state.medicineValidity;
    }
    render() {
        const { navigation } = this.props;
        const { selectedPrescriptions } = this.state;
        return (
            <View style={AppStyle.pageContainer}>
                <Header navigation={navigation} title={this.state.pageTitle} />
                <ScrollView
                    style={{ width: "100%" }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.specifyOptionView}>
                        <View style={styles.optionsView}>
                            <View style={styles.optionsSubViewSmall}>
                                <Image source={specifyMedicine} style={styles.specifyMedicine} />
                            </View>
                            <View style={styles.optionsSubViewLarge}>
                                <Text style={styles.specifyText}>Specify Medicines </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            // eslint-disable-next-line react/no-this-in-sfc
                            onPress={() => {
                                this.selectPrescriptionOption();
                            }}
                            style={styles.optionsView}
                        >
                            <View style={styles.optionsSubViewSmall}>
                                <RadioButton
                                    innerColor="#2f80ed"
                                    outerColor="#2f80ed"
                                    animation="bounceIn"
                                    size={8}
                                    isSelected={this.state.orderState === "prescription"}
                                    onPress={() => {
                                        this.selectPrescriptionOption();
                                    }}
                                />
                            </View>
                            <View style={styles.optionsSubViewLarge}>
                                <Text style={styles.optionText}>
                                    Order all the medicines according to the prescription
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.orderState === "prescription" ? (
                            <View style={styles.optionsView}>
                                <View style={styles.optionsSubViewSmall} />
                                <View style={styles.optionsSubViewLarge}>
                                    <TextInput
                                        style={styles.textInput}
                                        underlineColorAndroid="transparent"
                                        placeholder="Specify no. of days"
                                        placeholderTextColor="#d8d8d8"
                                        returnKeyType="done"
                                        keyboardType="numeric"
                                        selectionColor="#0d447a"
                                        maxLength={3}
                                        onChangeText={num => {
                                            // eslint-disable-next-line react/no-this-in-sfc
                                            this.setState({ prescriptionValidity: num });
                                            if (num && /^\d*$/.test(num) && parseInt(num, 10) !== 0 && parseInt(num, 10) < 1000) {
                                                // eslint-disable-next-line react/no-this-in-sfc
                                                this.setState({ disableCheckout: false });
                                            } else {
                                                // eslint-disable-next-line react/no-this-in-sfc
                                                this.setState({ disableCheckout: true });
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        ) : (
                                <View />
                            )}
                        <TouchableOpacity
                            onPress={() => {
                                this.selectCallMeOption();
                            }}
                            style={styles.optionsView}
                        >
                            <View style={styles.optionsSubViewSmall}>
                                <RadioButton
                                    innerColor="#2f80ed"
                                    outerColor="#2f80ed"
                                    animation="bounceIn"
                                    size={8}
                                    isSelected={this.state.orderState === "call_me"}
                                    onPress={() => {
                                        this.selectCallMeOption();

                                    }}
                                />
                            </View>
                            <View style={styles.optionsSubViewLarge}>
                                <Text style={styles.optionText}>Call me for more information</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.orderState === "call_me" ? (
                            <View style={styles.optionsView}>
                                <View style={styles.optionsSubViewSmall} />
                                <TouchableOpacity
                                    style={styles.optionsSubViewLarge}
                                    onPress={() => {
                                        this.setState({ showDatePicker: true });
                                    }}
                                >
                                    <TextInput
                                        style={styles.textInput}
                                        underlineColorAndroid="transparent"
                                        placeholder="Specify call date"
                                        placeholderTextColor="#d8d8d8"
                                        returnKeyType="done"
                                        keyboardType="numeric"
                                        selectionColor="#0d447a"
                                        editable={false}
                                        value={this.state.callMeDate}
                                    //-- value={'8-11'}
                                    // onChangeText={num => {
                                    //   // eslint-disable-next-line react/no-this-in-sfc
                                    //   this.setState({ prescriptionValidityCallTime: num });
                                    //   if (num && /^\d*$/.test(num) && parseInt(num, 10) !== 0 && parseInt(num, 10) <1000) {
                                    //     // eslint-disable-next-line react/no-this-in-sfc
                                    //     this.setState({ disableCheckout: false });
                                    //   } else {
                                    //     // eslint-disable-next-line react/no-this-in-sfc
                                    //     this.setState({ disableCheckout: true });
                                    //   }
                                    // }}
                                    />
                                    <Image source={calender} style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        height: Dimensions.get("window").height * 0.055,
                                        width: Dimensions.get("window").height * 0.055,
                                        resizeMode: 'center',
                                        marginRight: 5
                                    }} />
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.showDatePicker}
                                    onConfirm={this.handleConfirm}
                                    onCancel={() => this.setState({ showDatePicker: false })}
                                    mode="datetime"
                                    date={this.state.dateObject}
                                    minimumDate={new Date()}
                                    is24Hour={false}
                                />
                            </View>
                        ) : (
                                <View />
                            )}
                        <TouchableOpacity
                            onPress={() => {
                                this.selectMedicationOption();
                            }}
                            style={styles.optionsView}
                        >
                            <View style={styles.optionsSubViewSmall}>
                                <RadioButton
                                    innerColor="#2f80ed"
                                    outerColor="#2f80ed"
                                    animation="bounceIn"
                                    size={8}
                                    isSelected={this.state.orderState === "medication"}
                                    onPress={() => {
                                        this.selectMedicationOption();
                                    }}
                                />
                            </View>
                            <View style={styles.optionsSubViewLarge}>
                                <Text style={styles.optionText}>
                                    Let me specify the medicines and Duration
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.orderState === "medication" ? (
                            <View style={styles.optionsView}>
                                <View style={styles.optionsSubViewSmall} />
                                <View style={styles.optionsSubViewLarge}>
                                    <TextInput
                                        style={styles.textInput}
                                        underlineColorAndroid="transparent"
                                        placeholder="Specify no. of days"
                                        placeholderTextColor="#d8d8d8"
                                        returnKeyType="done"
                                        keyboardType="numeric"
                                        selectionColor="#0d447a"
                                        maxLength={3}
                                        onChangeText={num => {
                                            // eslint-disable-next-line react/no-this-in-sfc
                                            this.setState({ medicineValidity: num });
                                            if (num && /^\d*$/.test(num) && parseInt(num, 10) !== 0 && parseInt(num, 10) < 1000) {
                                                // eslint-disable-next-line react/no-this-in-sfc
                                                this.setState({ disableCheckout: false });
                                            } else {
                                                // eslint-disable-next-line react/no-this-in-sfc
                                                this.setState({ disableCheckout: true });
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        ) : (
                                <View />
                            )}
                        <View style={{ height: Dimensions.get("window").height * 0.01 }} />
                    </View>

                    {PrescriptionDataManager.getInstance().selectedPescriptionArray.length ? (
                        <View style={styles.uploadOptionsView}>
                            <View style={styles.chooseOptionView}>
                                <Image
                                    source={attachImg}
                                    style={{ flex: 1, height: 18, width: 16, resizeMode: 'contain' }}
                                />
                                <Text style={styles.chooseText}>Attached Prescriptions</Text>
                            </View>
                            <View style={styles.uploadingView}>
                                {PrescriptionDataManager.getInstance().selectedPescriptionArray.map((item, index = 0) => (
                                    /*<PrescriptionItem
                                        prescriptionDetails={prescData}
                                        inSpecifyMed
                                        number={(index += 1)}
                                    />*/
                                    <PrescItem1
                                        data={item}
                                        index={index}
                                        removePrescriptionIndex={this.showRemovePresAlert}
                                    />
                                ))}
                            </View>
                        </View>
                    ) : (
                            <View>

                            </View>
                        )}

                    {/*this.state.orderState === "medication" && searchProductsList.length ? (
                        <View style={styles.itemView}>
                            <View style={styles.title}>
                                <Text style={styles.chooseText}> Selected Items </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("SearchScreen")}
                                >
                                    <Image source={add} style={{ tintColor: "#589AF5" }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.selectedItemView}>
                                {searchProductsList.map(itemData => (
                                    <SearchItem
                                        thumbnail={itemData.image} //this.getCustomAttributes(itemData, "thumbnail")
                                        name={itemData.name}
                                        shortDescription={itemData.short_des} //this.getCustomAttributes(itemData,"short_description")
                                        price={itemData.price}
                                        sku={itemData.sku}
                                        fullUrl={true}
                                    />
                                ))}
                            </View>
                        </View>
                    ) : (
                            <View />
                    )*/}
                    <this.productSectionView />
                </ScrollView>
                <ButtonRect text='Continue' onPress={() => {

                    //console.log(`product array singleton: ${prescriptionData.getProductArray()}`);
                    console.log(`orderState: ${this.state.orderState} 
                    \n prescription_validity: ${this.state.prescriptionValidity} 
                    \n medicineValidity: ${this.state.medicineValidity} 
                    \n prescriptionValidityCallTime: ${this.state.prescriptionValidityCallTime} 
                    \n callMeDate: ${this.state.callMeDate}
                    \n disableCheckout: ${this.state.disableCheckout} `);




                    //--PrescriptionDataManager.getInstance().setPrescriptionArray(this.state.selectedPrescriptions);

                    if (PrescriptionDataManager.getInstance().selectedPescriptionArray.length === 0) {
                        this.showAlertPopup('Alert', '', 'Go back and add atleast one prescription', 'Ok');
                    } else {
                        if (!this.state.disableCheckout) {
                            this.setPrescriptionData();
                            this.gotoNext();
                        } else {
                            if (this.state.orderState === 'prescription') {
                                this.showAlertPopup('Alert', 'Please fill all fields', 'Specify the number of days for medicines', 'Ok');
                            }
                            if (this.state.orderState === 'call_me') {
                                this.showAlertPopup('Alert', 'Please fill all fields 1', 'Specify the number of days for medicines', 'Ok');
                            }
                            if (this.state.orderState === 'medication') {
                                this.showAlertPopup('Alert', 'Please fill all fields 2', 'Specify the number of days for medicines', 'Ok');
                            }
                            if (this.state.orderState === '') {
                                this.showAlertPopup('Alert', 'Specify Medicines', 'Please select the option', 'Ok');
                            }
                        }
                    }

                }} />
                <AlertPopup isVisible={this.state.showAlert}
                    closeModal={() => { this.setState({ showAlert: false }) }}
                    text1={this.state.alertLine1}
                    text2={this.state.alertLine2}
                    title={this.state.alerttitle}
                    btnText={this.state.alertBtnText}
                    title={this.state.alertTitle}
                    onPress={() => {
                        this.setState({ showAlert: false });
                        if (PrescriptionDataManager.getInstance().selectedPescriptionArray.length === 0) {
                            this.props.navigation.goBack();
                            console.log(`not prescription should go back`);
            
                        }
                    }}
                />
                <AlertPopup2 isVisible={this.state.showAlert2}
                    closeModal={() => { this.setState({ showAlert2: false }) }}
                    text1={this.state.alert2Line1}
                    text2={this.state.alert2Line2}
                    btnText1={this.state.alert2BtnText1}
                    btnText2={this.state.alert2BtnText2}
                    title={this.state.alertTitle2}
                    onPress1={() => {
                        this.setState({ showAlert2: false });
                    }}
                    onPress2={() => {
                        this.setState({ showAlert2: false });
                        this.removePrescriptionIndex();
                        //this.addressDeleteRequest();
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7"
    },
    sectionContainer: {
        marginTop: 15,
        backgroundColor: '#fff',
        padding: 15,
    },
    specifyOptionView: {
        height: Dimensions.get("window").height * 0.3,
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Dimensions.get("window").width * 0.05,
        backgroundColor: "#ffffff",
        marginTop: Dimensions.get("window").height * 0.018
    },
    specifyMedicineView: {
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Dimensions.get("window").width * 0.05,
        backgroundColor: "#ffffff",
        position: "relative"
    },
    optionsView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    optionsSubViewSmall: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
    },
    optionsSubViewLarge: {
        flex: 12,
        backgroundColor: "#ffffff",
        justifyContent: "flex-end",
        alignItems: "flex-start"
    },
    specifyMedicine: {
        height: 18,
        width: 18
    },
    specifyText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#212121"
    },
    textInput: {
        width: "98%",
        height: Dimensions.get("window").height * 0.055,
        paddingLeft: 15,
        borderColor: "#e0e0e0",
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 11,
        justifyContent: "flex-end",
        margin: 1,
        color: 'black',
    },
    optionText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#757575"
    },
    continueButton: {
        height: Dimensions.get("window").height * 0.08,
        width: Dimensions.get("window").width,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d447a"
    },
    buttonText: {
        fontSize: 15,
        color: "#ffffff",
        fontWeight: "bold"
    },
    uploadOptionsView: {
        width: Dimensions.get("window").width,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#ffffff",
        marginTop: Dimensions.get("window").height * 0.018,
        paddingBottom: Dimensions.get("window").height * 0.015,
    },
    chooseOptionView: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        height: Dimensions.get("window").height * 0.05,
        marginVertical: Dimensions.get("window").height * 0.01,
        paddingHorizontal: Dimensions.get("window").width * 0.04
    },
    chooseText: {
        flex: 11,
        fontSize: 14,
        color: "#212121",
        fontWeight: "500",
    },
    uploadingView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        alignSelf: 'stretch',
    },
    itemView: {
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#ffffff",
        marginTop: Dimensions.get("window").height * 0.02,
        paddingTop: Dimensions.get("window").height * 0.02
    },
    title: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        paddingHorizontal: Dimensions.get("window").width * 0.02,
        paddingBottom: Dimensions.get("window").height * 0.02
    }
});

export default SpecifyMedicine;
