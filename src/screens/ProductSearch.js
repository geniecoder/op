import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';

import HeaderSearchP from '../component/HeaderSearchP';
import SearchItem from '../component/card/SearchItem';

import { SEARCH_API, BASE_URL_API } from '../config/api_config';

import { PostApiRequest, GetApiRequest, DeleteApiRequest } from '../util/ApiCall';


import PrescriptionDataManager from '../util/PrescriptionDataManager';

class ProductSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            data: null
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.contentView = this.contentView.bind(this);
    }

    onChangeText(value) {

        if (value.length > 2) {
            this.setState({ isLoading: true });
            this.getData(value);
            console.log(`search value: ${value}`);
        }
        if (value.length == 0) {
            this.setState({ data: null });
        }
    }

    getData(searchKey) {
        GetApiRequest(`${SEARCH_API}/?q=${searchKey}`)
            .then((response) => {
                console.log(`response data ${response.result[0].data}`);
                this.setState({ isLoading: false, data: response.result[0].data });
                //this.state.isLoading = false;
                //this.state.data = response.data;
                //this.getDefaultAddress();
                //console.log(`data: ${this.state.data}`);
            })
    }

    contentView() {

        if (this.state.data == null) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[AppStyle.bodyText, { textAlign: 'center' }]}>Start typing medicine name {"\n"}to see matching result</Text>
                </View>
            );
        }
        if (this.state.data.length == 0) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>No result found</Text>
                </View>
            );
        }
        return (
            <FlatList
                data={this.state.data}
                renderItem={({ item, index }) => {
                    return <TouchableOpacity onPress={() => {
                        console.log(`clicked on search result ${index}`);
                        let prescriptionData = PrescriptionDataManager.getInstance();
                        prescriptionData.addToProductArray(item);
                        this.props.navigation.state.params.updateParentState();
                        this.props.navigation.goBack();
                    }}>
                        <SearchItem item={item} index={index} />
                    </TouchableOpacity>
                }}
            />
        );
    }


    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
                <HeaderSearchP navigation={navigation} title={this.state.pageTitle} onChangeText={this.onChangeText} isLoading={this.state.isLoading} />
                <this.contentView />
            </View>
        );
    }
}

export default ProductSearch;
