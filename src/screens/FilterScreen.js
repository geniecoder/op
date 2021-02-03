import React, { Component, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Button, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { PostApiCall, PostApiRequest } from '../util/ApiCall';

import { BASE_URL_API, PRODUCT_LIST_CAT, WISH_LIST_ADD, WISH_LIST_DELETE } from '../config/api_config';

import Header from '../component/Header';
import ProductCard from '../component/card/ProductCard'
import AppColors from '../values/AppColors';
import ProductDataManager from '../util/ProductDataManager';
import AppStyle from '../style/AppStyle';
import TabButton from '../component/TabButton';

import RangeSlider from 'rn-range-slider';
import ButtonWide from '../component/ButtonWide';



import CardFilterSelection from '../component/card/CardFilterSelection';

class FilterScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'Brand',
            rangeLow: 0,
            rangeHigh: 8000,
            selectedRangeLow: 0,
            selectedRangeHigh: 8000,
            selectedBrand: [],
            brandList: [{ id: 1, brand: 'Cipla' }, { id: 2, brand: 'Himalaya' }, { id: 1, brand: 'Cipla' }, { id: 2, brand: 'Himalaya' }, { id: 1, brand: 'Cipla' }, { id: 2, brand: 'Himalaya' }],
            selectedBrandList: []
        };
        this.contentView = this.contentView.bind(this);
        this.filterView = this.filterView.bind(this);
        this.priceFilterView = this.priceFilterView.bind(this);
        this.brandFilterView = this.brandFilterView.bind(this);


    }



    tabPress(tabName) {
        this.setState({ selectedTab: tabName });
    }
    priceFilterView() {
        const { rangeLow, rangeHigh, selectedRangeLow, selectedRangeHigh } = this.state;
        return (
            <View style={{ alignItems: 'center', marginTop: 15 }}>
                <Text style={[AppStyle.textSmallBlue, { fontSize: 16 }]}>Price Range</Text>
                <RangeSlider
                    style={{ width: 200, height: 70 }}
                    gravity={'center'}
                    min={rangeLow}
                    max={rangeHigh}
                    step={100}
                    selectionColor={AppColors.appBlue}
                    blankColor={AppColors.appGray}
                    onValueChanged={(low, high, fromUser) => {
                        this.setState({ selectedRangeLow: low, selectedRangeHigh: high })
                    }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: 20, marginTop: 15 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={AppStyle.textSmallGray}>Min</Text>
                        <Text style={{ backgroundColor: AppColors.appGrayLight, padding: 10, textAlign: 'center' }}>{selectedRangeLow}</Text>
                    </View>

                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={AppStyle.textSmallGray}>Max</Text>
                        <Text style={{ backgroundColor: AppColors.appGrayLight, padding: 10, textAlign: 'center' }}>{selectedRangeHigh}</Text>
                    </View>

                </View>

            </View>
        );
    }


    addBrandToArray = (item) => {
        this.setState({ selectedBrandList: [...this.state.selectedBrandList, item] }, (
            console.log(`selectedBrandArray: ${JSON.stringify(this.state.selectedBrandList)}`)
        ));

    }
    removeBrandFromArray = (obj) => {

        var index = this.state.selectedBrandList.findIndex(
            function (item, i) {
                return item.id === obj.id;
            }
        );
        //console.log(`remove from index ${index}`);

        var array = [...this.state.selectedBrandList];
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ selectedBrandList: array });
        }
    }
    brandFilterView() {
        const { brandList } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={brandList}
                    renderItem={({ item, index }) => {

                        return (
                            <CardFilterSelection item={item} addBrandToArray={this.addBrandToArray} removeBrandFromArray={this.removeBrandFromArray} />
                        );
                    }
                    }

                    keyExtractor={(item, index) => index.toString()}
                />

            </View>
        );
    }

    filterView() {
        const { selectedTab } = this.state;
        switch (selectedTab) {
            case 'Categories':
                return <View />
                break;
            case 'Brand':
                return <this.brandFilterView />
                break;
            case 'Price':
                return <this.priceFilterView />
                break;
            case 'Compatible Unit':
                return <View />
                break;
            case 'Product Form':
                return <View />
                break;
            case 'Conditions':
                return <View />
                break;

            default:
                return <View />
                break;
        }
    }
    contentView() {
        return (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 3, backgroundColor: AppColors.backgroundColor }}>
                    <TabButton text='Categories' onPress={this.tabPress.bind(this)} selectedTab={this.state.selectedTab} />
                    <TabButton text='Brand' onPress={this.tabPress.bind(this)} selectedTab={this.state.selectedTab} />
                    <TabButton text='Price' onPress={this.tabPress.bind(this)} selectedTab={this.state.selectedTab} />
                    <TabButton text='Compatible Unit' onPress={this.tabPress.bind(this)} selectedTab={this.state.selectedTab} />
                    <TabButton text='Product Form' onPress={this.tabPress.bind(this)} selectedTab={this.state.selectedTab} />
                    <TabButton text='Conditions' onPress={this.tabPress.bind(this)} selectedTab={this.state.selectedTab} />
                </View>
                <View style={{ flex: 4, backgroundColor: 'white' }}>
                    <this.filterView />
                </View>

            </View>
        );
    }

    applyFilters() {
        const { navigation } = this.props;
        const { selectedRangeLow, selectedRangeHigh, brand } = this.state;
        const filterObj = {
            price: {
                low: selectedRangeLow,
                high: selectedRangeHigh
            },
            brand: this.state.selectedBrandList
        }
        navigation.navigate('ProductList', { filters: filterObj });
    }
    render() {
        const { navigation } = this.props;
        //console.log(`page title is  ${this.state.pageTitle}`);
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
                <Header navigation={navigation} title='Filter' />
                <this.contentView />
                <View style={{ flexDirection: 'row', backgroundColor: 'gray' }}>
                    <ButtonWide text='Cancel' backgroundColor={AppColors.appGray} onPress={() => { console.log(`cancel filter`) }} />
                    <ButtonWide text='Apply' backgroundColor={AppColors.appBlue}
                        onPress={() => {
                            //this.updateProfile();
                            console.log(`Apply filters`);
                            //console.log(`selectedBrandArray: ${JSON.stringify(this.state.selectedBrandList)}`)
                            this.applyFilters();
                            //this.setState({ editMode: false })
                        }} />
                </View>
            </View>
        );
    }
}

export default FilterScreen;
