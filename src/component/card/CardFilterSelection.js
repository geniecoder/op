import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import AppStyle from '../../style/AppStyle';
import AppColors from '../../values/AppColors';

import checkedImg from '../../../assets/images/icons/checkboxChecked.png';
import uncheckedImg from '../../../assets/images/icons/checkboxUnchecked.png';

const componentName = (props) => {
    const [selected, setSelection] = useState(false);
    return (
        <View style={{ marginHorizontal: 15, marginVertical: 7, }}>
            <View style={{ flexDirection: 'row', marginVertical: 0, alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={AppStyle.bodyText}>{props.item.brand}</Text>
                <TouchableOpacity onPress={() => {
                    //this.toggleCheckBox();
                    setSelection(!selected);
                    if(!selected){
                        props.addBrandToArray(props.item);
                    }else{
                        props.removeBrandFromArray(props.item);
                    }
                    //console.log(`checkbox clicked ${data.id}`);
                }}>
                    <Image style={{ marginRight: 12, tintColor: '#56ccf2' }} source={selected ? checkedImg : uncheckedImg} />
                </TouchableOpacity>
            </View>
            <View style={{ height: .5, marginTop: 15, backgroundColor: AppColors.appGrayLight }} />
        </View>
    );
}

export default componentName;
