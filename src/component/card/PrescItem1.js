import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppColors from '../../values/AppColors';
import checkedImg from '../../../assets/images/icons/checkboxChecked.png';
import uncheckedImg from '../../../assets/images/icons/checkboxUnchecked.png';
import delectIcon from '../../../assets/images/icons/delete.png';
import PrescriptionDataManager from '../../util/PrescriptionDataManager';

class PrescItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: false,
        };
    }

    toggleCheckBox = () => {
        const { selected } = this.state;
        const { addPrescription, data, removePrescription, index } = this.props;
        const prescriptionObj = {
            id: data.id,
            name: data.name,
            url: data.placeholder,
            type: data.file_type,
        };
        if (selected) {
            removePrescription(data.id);
        } else {
            addPrescription(prescriptionObj);
        }
        this.setState(() => ({ selected: !selected }));
    }

    render() {
        const { data, removePrescriptionIndex, index } = this.props;
        return (
            <View style={styles.cardContainer}>
                <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                    <Image
                        source={{ uri: data.url }}
                        style={{
                            alignSelf: 'stretch',
                            height: 75,
                            width: 75
                        }}
                    />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.textName}>{data.name}</Text>
                        <View style={{ height: 10 }} />
                        <Text style={styles.textDate}>{data.date}</Text>
                    </View>
                </View>
                <View style={{ marginRight: 10 }}>
                    <TouchableOpacity onPress={() => {
                        console.log(`delete clicked ${data.id}`);
                        if (this.state.selected) {
                            this.setState({ selected: false });
                        }
                        removePrescriptionIndex(index);

                        //----------remove priscription from selected array and refresh screen
                        //PrescriptionDataManager.getInstance().removePrescriptionByIndex(index);
                        //this.setState({});
                        //-------------------------------------------------------------------
                    }}>
                        <Image style={{ marginRight: 12 }} source={delectIcon} />
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
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 3,
        shadowOpacity: 0.2
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
