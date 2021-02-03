import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import AppStyle from '../../style/AppStyle';
export default SearchItem = (props) => {
    return (
        <View style={{ paddingVertical: 17, paddingHorizontal: 12, marginBottom: 1, backgroundColor: '#fff' }}>
            <Text>{props.item.name}</Text>
            <Text style={[AppStyle.bodySmall, { marginTop: 4 }]}>{props.item.description}</Text>
        </View>
    );
}