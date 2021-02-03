import React, { Component } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import AppColors from '../values/AppColors';
import Header from '../component/Header';
import { PostApiRequest, GetApiRequest } from '../util/ApiCall';
import { BASE_URL_API, PRODUCT_DETAILS, ADD_TO_CART } from '../config/api_config';

import ProductImageSlider from '../component/details/ProductImageSlider';
import ProductInfo from '../component/details/ProductInfo';
import SubProductList from '../component/details/SubProductList';
import DescriptionCard from '../component/details/DescriptionCard';
import ButtonRect from '../component/ButtonRect';
import ProductDataManager from '../util/ProductDataManager';

import SnackBar from 'react-native-snackbar-component';
import AppStyle from '../style/AppStyle';
import RetryView from '../component/RetryView';

class ProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null,
      pageTitle: '',
      sku: '',
      sliderArray: [],
      productInfo: {},
      substituteArray: [],
      numberOfLinesDescription: 100,
      productQty: 1,
      isAddedToCard: false,
      retryVisible: false
    };
    this.state.sku = this.props.navigation.getParam('sku', '');
    this.state.productId = this.props.navigation.getParam('productId', '');
    this.state.pageTitle = this.props.navigation.getParam('productName', 'Product Details');
    this.contentView = this.contentView.bind(this);
    this.loadNewProduct = this.loadNewProduct.bind(this);
    //----add focust listener to refresh screen---
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({ is_updated: true });
      }
    );
  }

  componentDidMount() {
    this.getData();
  }

  loadNewProduct(item) {
    //console.log(`navigate to new product`);
    //this.props.navigation.navigate('ProductScreen', { sku: item.product_data.sku, productId: item.product_id, pageTitle: item.product_data.product_title, isLoading: false });
    /*this.setState({ sku: item.product_data.sku, productId: item.product_id, pageTitle: item.product_data.product_title, isLoading: true }, (
      this.getData()
    ));*/

    this.state.sku = item.product_data.sku;
    this.getData();
    this.setState({isLoading: true, pageTitle: item.product_data.product_title, productId: item.product_id});

  }

  getData() {
    const checkSKU = this.state.sku;
    GetApiRequest(`${BASE_URL_API}${PRODUCT_DETAILS}/${this.state.sku}`)
      .then((response) => {
        console.log(`response ${JSON.stringify(response)}`);
        this.setState({
          data: response.data,
          sliderArray: response.data[0].data[0].product.media_gallery_entries,
          productInfo: response.data[0].data[0].product,
          substituteArray: response.data[1].data,
          isLoading: false
        });
        console.log(`sku: ${this.state.sku}`);
      })
      .catch((error) => {
        console.log(`error ${error}`);
        this.setState({ isLoading: false, isLoadingMore: false, retryVisible: true });
      });
  }

  addToCart() {
    this.state.isAddedToCard = false;
    console.log(`user obj: ${JSON.stringify(ProductDataManager.getInstance().getUser())}`);
    const customerId = ProductDataManager.getInstance().getUser().customer_id;
    const bodyObj = {
      data: {
        userid: customerId ? customerId : '',
        qty: this.state.productQty,
        itemid: this.state.productInfo.id,
      }
    }
    PostApiRequest(`${BASE_URL_API}${ADD_TO_CART}`, bodyObj)
      .then(response => {
        console.log(`addToCart response ${JSON.stringify(response)}`);
        if (response.status === '1') {
          ProductDataManager.getInstance().setCartCount(response.cart_count);
          this.setState({ isAddedToCard: true });
          setTimeout(() => {
            this.setState({ isAddedToCard: false });
          }, 3000)
          console.log(`response count: ${response.cart_count}`);
        }
      })
      .catch(error => {
        console.log(`error ${error}`);
      })
  }

  onChangeQty(qty) {
    this.state.productQty = qty;
  }
  loadingView() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#000" /></View>
  }
  reloadData() {
    console.log(`data reload`)
    this.setState({ isLoading: true, retryVisible: false }, this.getData());

  }
  contentView() {
    if (this.state.retryVisible) {
      return <RetryView onPress={() => this.reloadData()} />
    }
    if (this.state.isLoading === true) {
      return (
        <this.loadingView />
      );
    }
    if (this.state.data !== null) {
      console.log(`substitueArray: ${this.state.substituteArray.length}`)
      return (
        <View style={{ flex: 1 }}>
          <ScrollView>
            <ProductImageSlider data={this.state.sliderArray} />
            <ProductInfo productInfo={this.state.productInfo} onChangeQty={this.onChangeQty.bind(this)} productQty={this.state.productQty} />
            {this.state.substituteArray.length !== 0 ? <SubProductList substituteArray={this.state.substituteArray} productInfo={this.state.productInfo} loadNewProduct={this.loadNewProduct} navigation={this.props.navigation} /> : <View />}

            <DescriptionCard productInfo={this.state.productInfo} />
            <View style={{ height: 20 }} />
          </ScrollView>
          <ButtonRect text={`Add to Cart`} onPress={() => {
            if (this.state.productQty === '') {
              this.setState({ productQty: 1 });
            }
            if (ProductDataManager.getInstance().getUser() !== null) {
              this.addToCart();
            } else {
              this.props.navigation.navigate('Auth');
            }

            console.log(`Add to Cart`);
          }} />
          <SnackBar
            visible={this.state.isAddedToCard}
            textMessage="Product Added To Cart!"
            actionHandler={() => {
              console.log("snackbar button clicked!");
              this.props.navigation.navigate('CartScreen');
            }}
            actionText="Goto Cart"
            containerStyle={
              AppStyle.containerStyle
            } />
        </View>
      );
    } else {
      return (
        <Text>Please try again.</Text>
      )
    }
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
        <Header navigation={navigation} title={this.state.pageTitle} />
        <this.contentView />

      </View>
    );
  }
}
export default ProductScreen;
