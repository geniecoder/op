import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import AppColors from '../../values/AppColors';
import AppStyle from '../../style/AppStyle';
import checkedImg from '../../../assets/images/icons/checkboxChecked.png';
import uncheckedImg from '../../../assets/images/icons/checkboxUnchecked.png';
import delectIcon from '../../../assets/images/icons/delete.png';


import PrescriptionDataManager from '../../util/PrescriptionDataManager';

class PrescItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
            //-- prevSelectedPresArray: []
        };
        //console.log(`prevSelectedPresArray ${JSON.stringify(this.props.prevSelectedPresArray)}`);
        //--this.state.prevSelectedPresArray = this.props.prevSelectedPresArray;

        //this.checkIfSelected = this.checkIfSelected.bind(this);
    }

    componentDidMount() {
        if (this.props.selectedArray !== undefined) {
            this.checkIfSelected(this.props.data.id);
        }else{
            console.log(`selectedArray is undefined`);
        }

    }

    checkIfSelected(id) {
        var index = this.props.selectedArray.findIndex(
            function (item, i) {
                return item.id === id;
            }
        );
        if (index !== -1) {
            //this.toggleCheckBox();
            this.setState(() => ({ selected: !this.state.selected }));
        }
        //console.log(`found index: ${index}`);
        /* getDefaultAddress() {
             var index = this.state.data.findIndex(
                 function (item, i) {
                     return item.default === 1;
                 }
             );
             this.setState({ selectedAddress: this.state.data[index] });
             //console.log(`default address index ${JSON.stringify(this.state.data[index])}`);
         }*/
    }

    toggleCheckBox = () => {
        const { selected } = this.state;
        const { addPrescription, data, removePrescription, index } = this.props;
        const prescriptionObj = {
            id: data.id,
            name: data.name,
            url: data.placeholder,
            type: data.file_type,
            date: data.created_at
        };
        if (selected) {
            //--removePrescription(data.id);
            PrescriptionDataManager.getInstance().removePrescriptionById(data.id);
        } else {
            //--addPrescription(prescriptionObj);
            PrescriptionDataManager.getInstance().addPrescription(prescriptionObj);
        }
        this.setState(() => ({ selected: !selected }));
    }

    StView = (status) => {
        if (status === '0') {
            return (
                <View style={{ backgroundColor: '#F7BA3E', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Pending</Text>
                </View>
            );
        }
        if (status === '1') {
            return (
                <View style={{ backgroundColor: '#3FBE4F', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Approved</Text>
                </View>
            );
        }
        if (status === '3') {
            return (
                <View style={{ backgroundColor: '#ED4459', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 2 }}>
                    <Text style={[AppStyle.textSmall, { color: 'white' }]}>Declined</Text>
                </View>
            );
        }
        return <View />

    }

    render() {
        const { data, removePrescriptionIndex, index } = this.props;
        return (
            <View style={styles.cardContainer}>
                <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        this.toggleCheckBox();
                        //console.log(`checkbox clicked ${data.id}`);
                    }}>
                        <Image style={{ marginRight: 12, tintColor: '#56ccf2' }} source={this.state.selected ? checkedImg : uncheckedImg} />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: data.placeholder }}
                        style={{
                            alignSelf: 'stretch',
                            height: 75,
                            width: 75
                        }}
                    />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.textName}>{data.name}</Text>
                        <View style={{ height: 10 }} />
                        <Text style={styles.textDate}>{data.created_at}</Text>
                    </View>

                </View>

                <View style={{ marginRight: 10, alignItems: 'center' }}>
                    {this.StView(data.status)}
                    <View style={{ height: 1 }} />
                    <TouchableOpacity onPress={() => {
                        //console.log(`delete clicked ${data.id}`);
                        if (this.state.selected) {
                            this.setState({ selected: false });
                        }
                        //--------remove prescription from server and selectedPrescription array;
                        removePrescriptionIndex(index, data.id);
                        PrescriptionDataManager.getInstance().removePrescriptionById(data.id);
                        //-----------------------------------------------------------------------
                    }}>
                        <Image style={{ marginTop: 8 }} source={delectIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        height: 75,
        marginTop: 20,
        marginLeft: 17,
        marginRight: 17,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textName: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: AppColors.appGrayDark1,
    },
    textDate: {
        fontFamily: 'Roboto',
        fontSize: 10,
        color: AppColors.appGray,
    },
});

export default PrescItem;
