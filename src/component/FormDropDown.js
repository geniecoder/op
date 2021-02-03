import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppColors from '../values/AppColors';
import RNPickerSelect from 'react-native-picker-select';


export default FormDropDown = (props) => {
    return (
        <View style={{ paddingLeft: 2, paddingRight: 2 }}>
            <Text style={styles.inputLable}>
                {props.lable}
            </Text>
            <View style={{ height:40, alignItems:'center', justifyContent:'center' }}>
                <RNPickerSelect
                    onValueChange={(value, index) => console.log(props.onChange(value, index))}
                    value={props.regionId}
                    placeholder={{
                        label: 'Select State',
                        value: null,
                    }}
                    items={
                        props.regionDataMap
                    }
                />
            </View>
            <View
                style={{
                    borderBottomColor: '#9C9C9C',
                    borderBottomWidth: 1,
                }}
            />
            <Text style={styles.errorStyle}>{props.errorMsg}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    inputs: {
        height: 40,
        fontSize: 16,
        fontFamily: 'Roboto'
    },
    inputLable: {
        fontSize: 13,
        color: AppColors.appGray,
        fontFamily: 'Roboto'
    },
    errorStyle: {
        fontSize: 12,
        marginTop: 5,
        color: AppColors.errorRed
    }
});