import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppColors from '../../values/AppColors';
import checkedImg from '../../../assets/images/icons/checkboxChecked.png';
import uncheckedImg from '../../../assets/images/icons/checkboxUnchecked.png';
import delectIcon from '../../../assets/images/icons/delete.png';

export default CardMyPres = (props) => {
    const selected = false;
    return (
        <View style={styles.cardContainer}>
            <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                   /*if (selected) {
                        console.log(`selected true`);
                        selected = false;
                    } else {
                        selected = true;
                        const prescriptionObj = {
                            id: props.data.id,
                            name: props.data.name,
                            url: props.data.placeholder,
                            type: props.data.file_type,
                        };
                        props.addPrescription(prescriptionObj);
                        console.log(`selected false`);
                    }*/
                    console.log(`checkbox clicked ${props.data.id}`);
                }}>
                    <Image style={{ marginRight: 12, tintColor: '#56ccf2' }} source={uncheckedImg} />
                </TouchableOpacity>
                <Image
                    source={{ uri: props.data.placeholder }}
                    style={{
                        alignSelf: 'stretch',
                        height: 75,
                        width: 75
                    }}
                />
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.textName}>{props.data.name}</Text>
                    <View style={{ height: 10 }} />
                    <Text style={styles.textDate}>Uploaded on 10th July</Text>
                </View>
            </View>
            <View style={{ marginRight: 10 }}>
                <TouchableOpacity onPress={() => {
                    console.log(`delete clicked ${props.data.id}`);
                    props.removePrescriptionIndex(props.index, props.data.id);
                }}>
                    <Image style={{ marginRight: 12 }} source={delectIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
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