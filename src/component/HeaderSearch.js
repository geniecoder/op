import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TextComponent, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import locationIcon from '../../assets/images/icons/maps-and-flags-2.png'
import searchIcon from '../../assets/images/icons/magnifying-glass.png'
import ProductDataManager from '../util/ProductDataManager';

const HeaderSearch = (props) => {
  const cityObj = ProductDataManager.getInstance().getCity();
  console.log(`cityObj: ${ProductDataManager.getInstance().getCity()}`);
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            console.log(`goto city selection`);
            props.navigation.navigate('CityScreen');
          }}>
          <View style={{alignItems:'center'}} >
            <Image style={{ height: 20, resizeMode: 'contain' }} source={locationIcon} />
            <Text style={[AppStyle.tinyGrayText, {color: 'white', marginTop:5}]}>{cityObj !== null ? cityObj.city : 'Select City'}</Text>
          </View>

        </TouchableOpacity>

        <View style={{ width: 16 }} />
        <TouchableWithoutFeedback
          onPress={() => {
            console.log(`goto Search product`)
            props.navigation.navigate('HomeProductSearch');
          }}>
          <View style={styles.searchBox}>
            <View style={AppStyle.rowStyle}>
              <Image source={searchIcon} />
              <View style={{ width: 10 }} />
              <Text style={{ color: AppColors.appGray }}>
                Search
                </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ alignSelf: 'stretch', backgroundColor: AppColors.appBlue, height: 10 }} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: AppColors.appBlue,
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 15
  },
  searchBox: {
    flex: 1,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10
  },
});

export default HeaderSearch;
