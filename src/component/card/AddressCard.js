import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import AppColors from '../../values/AppColors';

import addressIcon from '../../../assets/images/icons/group-4.png';
import shippedIcon from '../../../assets/images/icons/shipped.png';

import infoIcon from '../../../assets/images/icons/info.png';
import editIcon from '../../../assets/images/icons/edit-2.png';
import deleteIcon from '../../../assets/images/icons/delete.png';

import homeIcon from '../../../assets/images/icons/homeIcon.png';
import officeIcon from '../../../assets/images/icons/briefcase.png';
import otherAddressIcon from '../../../assets/images/icons/placeholder-4.png';

import selectedIcon from '../../../assets/images/icons/selected.png';
import unselected from '../../../assets/images/icons/unselected.png';





export default AddressCard = (props) => {
    const OTHER_ADDRESS = '0';
    const HOME_ADDRESS = '1';
    const OFFICE_ADDRESS = '2';
    var addSelectIcon = props.data.default === 1 ? selectedIcon : unselected;
    var addressTypeIcon = otherAddressIcon;
    switch (props.data.address_type) {
        case OTHER_ADDRESS:
            addressTypeIcon = otherAddressIcon;
            break;
        case HOME_ADDRESS:
            addressTypeIcon = homeIcon;
            break;
        case OFFICE_ADDRESS:
            addressTypeIcon = officeIcon;
            break;
        default:
            addressTypeIcon = otherAddressIcon;
    }

    return (

        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <TouchableWithoutFeedback
                onPress={() => {

                    props.selectAddress(props.data);
                    console.log(`clicked select address`);
                }}>
                <View style={{ backgroundColor: AppColors.pageBackground, marginTop: 0, padding: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={addressTypeIcon} />
                            <Text style={{ marginLeft: 10 }}>{`${props.data.firstname} ${props.data.lastname}`}</Text>
                        </View>
                        {/*<Image source={addSelectIcon} />*/}

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <TouchableOpacity
                                onPress={() => {
                                    props.editAddress(props.data);
                                }}>
                                <Image source={editIcon} />
                            </TouchableOpacity>



                            {
                               
                                //props.listType === 'selection' ? <View /> :
                                    <View style={{marginLeft:20}}>
                                        
                                        <TouchableOpacity
                                            onPress={() => {
                                                props.deleteAddress(props.data.entity_id);
                                            }}>
                                            <Image source={deleteIcon} />
                                        </TouchableOpacity>
                                    </View>
                            }

                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 7, alignItems: 'center' }}>
                        <Text style={styles.selectionText}>Phone</Text>
                        <View style={{ height: 10, width: 1, backgroundColor: '#999999', marginLeft: 15, marginRight: 15 }} />
                        <Text style={styles.selectionText}>{props.data.telephone}</Text>
                    </View>
                    <Text style={[styles.selectionText, { marginTop: 7 }]}>
                        {`${props.data.street[0]}, ${props.data.city}, ${props.data.country_id}, ${props.data.postcode}`}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 15,
        backgroundColor: '#fff',
        padding: 15,
    },
    selectionText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        color: AppColors.appGray,
    }
});