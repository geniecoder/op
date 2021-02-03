import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet, SafeAreaView, TextComponent, ActivityIndicator } from 'react-native';
import HeaderHome from '../component/HeaderHome';
import HeaderSearch from '../component/HeaderSearch';
import AppColors from '../values/AppColors';

import { GetApiCall, GetApiRequest, PostApiRequest } from '../util/ApiCall';
import { BASE_URL_API, HOME_FEED_API, WISH_LIST_ADD, WISH_LIST_DELETE } from '../config/api_config';

import SingleImageView from '../component/home/SingleImageView';
import CatIconList from '../component/home/CatIconList';
import UploadPres from '../component/home/UploadPres';
import ImageSlider from '../component/home/ImageSlider';
import ProductView from '../component/home/ProductView';
import AppFlow from '../component/home/AppFlow';
import ProductDataManager from '../util/ProductDataManager';
import SnackBar from 'react-native-snackbar-component';
import AppStyle from '../style/AppStyle';

import { GetUser } from '../util/LocalStorage';


import RetryView from '../component/RetryView';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];


class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: null,
      retryVisible: false,
      isSnackBarVisible: false,
      snackBarMsg: ''
    }
    this.getHomeFeed();
    this.checkLoggedIn();


    //----add focust listener to refresh screen---
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({ is_updated: true });
      }
    );
  }
  getHomeFeed() {
    console.log(`getHomeFeed called`);
    this.state.isLoading = true;
    PostApiRequest(`${BASE_URL_API}${HOME_FEED_API}`)
      .then(data => {
        if (data.status === '1') {
          ProductDataManager.getInstance().setCartCount(data.quoteInfo.cartCount);
          ProductDataManager.getInstance().setQuoteId(data.quoteInfo.quoteId);
          this.setState({ isLoading: false, data: data });
        }
        //console.log(`response: ${JSON.stringify(data)}`);
      })
      .catch(error => {
        console.log(`error2 ${error}`);
        this.setState({ isLoading: false, retryVisible: true });
      });
  }


  showSnakBar(msg) {
    this.setState({ isSnackBarVisible: true, snackBarMsg: msg});
    setTimeout(() => {
      this.setState({ isSnackBarVisible: false });
    }, 3000)
  }



  checkLoggedIn() {
    GetUser().then((userData) => {
      if (userData != null) {
        console.log(`GetUser: ${userData.token}`);
        ProductDataManager.getInstance().setUser(userData);
        //this.props.navigation.navigate('App');

        return 'App';
      } else {
        console.log(`user is not avilable`);
        //this.props.navigation.navigate('Auth');
        return 'Auth';
      }
    });
  }

  reloadData() {
    console.log(`data reload`)
    this.setState({ isLoading: true, retryVisible: false }, this.getHomeFeed());

  }
  contentView() {
    const { navigation } = this.props;
    if (this.state.retryVisible) {
      return <RetryView onPress={() => this.reloadData()} />
    }
    if (this.state.isLoading) {
      return this.loadingView();
    }
    if (this.state.data == null) {
      return <Text>--</Text>
    }
    console.log(`array data: ${JSON.stringify(this.state.data.data[0].view_type)}`);
    return <FlatList
      data={this.state.data.data}
      renderItem={({ item, index }) => {
        console.log(`view type: ${item.view_type}`);
        if (item.view_type == 'catIconList') {
          return <CatIconList data={item.data} navigation={navigation} />
        }
        if (item.view_type == 'uploadPres') {
          return <UploadPres navigation={navigation} />
        }
        if (item.view_type == 'imageSlider') {
          return <ImageSlider data={item.data} />
        }
        if (item.view_type == 'productView') {
          return <ProductView showSnakBar={this.showSnakBar.bind(this)} data={item.data} endPoint={item.end_point} navigation={navigation} title={item.title} />
        }
        if (item.view_type == 'singleImage') {
          return <SingleImageView value={item.data[0].img} />
        }
        if (item.view_type == 'singleImage') {
          return <SingleImageView value={item.data[0].img} />
        }
        if (item.view_type == 'appFlow') {
          return <AppFlow />
        }
        return <View />;
      }}
      // keyExtractor={item => item.id}
      keyExtractor={(item, index) => index.toString()}
    />;
  }
  loadingView() {
    return <ActivityIndicator size="large" color="#000" />;
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <HeaderHome navigation={navigation} />
        <HeaderSearch navigation={navigation} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F6F6' }}>
          {this.contentView()}
        </View>
        <SnackBar
          visible={this.state.isSnackBarVisible}
          textMessage={this.state.snackBarMsg}
          actionHandler={() => {
            console.log("snackbar button clicked!");
            // this.props.navigation.navigate('CartScreen');
          }}
          // actionText="Goto Cart"
          containerStyle={
            AppStyle.containerStyle
          } />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7'
  }
});
export default HomeScreen;
