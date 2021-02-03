import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import AppColors from '../../values/AppColors';
import AppStyle from '../../style/AppStyle';
import ButtonOutline from '../../component/ButtonOutline';
import HTML from 'react-native-render-html';

export default SubProductList = (props) => {
    const desHeight = 70;
    const [numberOfLinesDescription, setNumOfLine] = useState(desHeight);
    return (
        <View style={AppStyle.sectionContainer}>
            <Text style={[AppStyle.bodyText, { fontWeight: 'bold' }]}>Description</Text>
            {/*<Text style={AppStyle.bodyText} numberOfLines={numberOfLinesDescription}>
                {props.productInfo.custom_attributes[0].value}
    </Text>*/}
            <View style={{ height: numberOfLinesDescription, overflow: 'hidden' }}>
                <HTML html={props.productInfo.custom_attributes[0].value} imagesMaxWidth={Dimensions.get('window').width} />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', marginTop: 10 }}>
                <ButtonOutline text={numberOfLinesDescription === desHeight ? 'see more' : 'see less'} onPress={() => {
                    console.log(`see more description`);
                    if (numberOfLinesDescription === desHeight) {
                        setNumOfLine(null);
                    } else {
                        setNumOfLine(desHeight);
                    }
                }} />
            </View>
        </View >
    );
}