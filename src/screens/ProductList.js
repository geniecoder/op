import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { PostApiCall, PostApiRequest } from '../util/ApiCall';

import { BASE_URL_API, PRODUCT_LIST_CAT, WISH_LIST_ADD, WISH_LIST_DELETE } from '../config/api_config';

import SnackBar from 'react-native-snackbar-component';

import Header from '../component/Header';
import ProductCard from '../component/card/ProductCard'
import AppColors from '../values/AppColors';
import ProductDataManager from '../util/ProductDataManager';
import AppStyle from '../style/AppStyle';
import RetryView from '../component/RetryView';
import PopupSortBy from '../component/popup/PopupSortBy';
import { ThemeColors } from 'react-navigation';

class ProductList extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      isLoading: true,
      isLoadingMore: false,
      pageTitle: navigation.getParam('pageTitle', ''),
      id: navigation.getParam('id', ''),
      data: [],
      url: navigation.getParam('url', `${BASE_URL_API}${PRODUCT_LIST_CAT}`),
      apiName: navigation.getParam('apiName', 'category'),
      currentPage: 1,
      pageSize: navigation.getParam('pageSize', 20),
      retryVisible: false,
      isAddRemoveWishlist: false,
      snackBarMsg: '',
      filters: null,
      showSortBy: false,
      sortByValue: ''

    };
    //----add focust listener to refresh screen---
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({ is_updated: true });
      }
    );

    this.filterView = this.filterView.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    const filters = nextProps.navigation.state.params.filters;
    console.log(`receiveProps: ${JSON.stringify(nextProps.navigation.state.params.filters)}`);
    this.state.filters = filters;
    this.setState({ isLoading: true });
    this.getData();
  }

  getData() {
    this.setState({ isLoadingMore: true });
    const { id, pageSize, currentPage, filters } = this.state;
    //const {price, brand} = filters;

    const blankFilterObj = {
      "price": {
        "low": '',
        "high": ''
      }
    }

    PostApiRequest(this.state.url, {
      "category":
      {
        "id": this.state.id,
        "pagesize": this.state.pageSize,
        "curpage": this.state.currentPage,
        //"fprice": filters ? filters.price !== null ? filters.price.low : '' : '',
        // "tprice": filters ? filters.price !== null ? filters.price.high : '' : '',
        "filters": filters !== null ? filters : blankFilterObj,
        "sort": {
          "currentprice": this.state.sortByValue
        }
      }
    }).then(data => {
      if (data.status == '1') {
        const dataList = Array.from(data.productList);
        if (dataList != 0) {
          this.setState((prevState, nextProps) => ({
            data: this.state.currentPage === 1 ? dataList : [...this.state.data, ...dataList],
            isLoading: false,
          }));
        } else {
          this.setState({
            isLoadingMore: false
          });
        }
        console.log(`response: ${JSON.stringify(data)}`);
        //this.props.navigation.navigate('OtpVerifyS', {firstName: this.state.firstName, lastName: this.lastName });
      } else {
        console.log('Product list loading failed');
      }
    }).catch(error => {
      console.log(`error: ${error}`);
      this.setState({ isLoading: false, isLoadingMore: false, retryVisible: true });
    });
  }
  loadingView() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#000" /></View>;
  }
  ItemSeparatorLine = () => {
    return (
      <View
        style={{
          height: .5,
          width: "100%",
          backgroundColor: "#111a0b",
        }}
      />
    );
  }

  renderFooter = () => {
    if (!this.state.isLoadingMore) return null;
    return (
      <View>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };



  handleLoadMore = () => {
    this.setState(
      (prevState, nextProps) => ({
        currentPage: prevState.currentPage + 1,
        isLoadingMore: true
      }),
      () => {
        this.getData();
      }
    );
  };

  handleWishList = (value, id) => {

    if (ProductDataManager.getInstance().getUser() !== null) {
      const customerId = ProductDataManager.getInstance().getUser().customer_id;
      const bodyObj = {
        customer_id: customerId
      }
      PostApiRequest(`${BASE_URL_API}${value === 0 || value === null ? WISH_LIST_ADD : WISH_LIST_DELETE}/${id}`, bodyObj)
        .then((response) => {
          console.log(`response ${JSON.stringify(response)}`);
          this.setState({ isAddRemoveWishlist: true, snackBarMsg: value === 0 || value === null ? 'Product added to Wishlist!' : 'Product removed from Wishlist' });
          setTimeout(() => {
            this.setState({ isAddRemoveWishlist: false });
          }, 3000)
        })
        .catch(error => {
          console.log(`error ${error}`);
        })
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  reloadData() {
    console.log(`data reload`)
    this.setState({ isLoading: true, retryVisible: false }, this.getData());

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
    return <FlatList
      data={this.state.data}

      renderItem={({ item, index }) => {
        // console.log(`item data: ${JSON.stringify(item) }`);
        //console.log(`before number specialPrice ${item.special_price}`)
        return <TouchableOpacity onPress={() => {
          //console.log(`goto product page`);
          navigation.navigate('ProductScreen', { sku: item.sku, productName: item.name, productId: item.id });
        }}>
          <ProductCard
            imgUrl={item.imageUrl}
            productTitle={item.name}
            shortDescription={item.short_description}
            price={Number(item.price)}
            finalPrice={Number(item.final_price)}
            specialPrice={Number(item.special_price)}
            gridMargin={index % 2 == 0 ? 0 : 2}
            inWishList={item.wishlist}
            item={item}
            handleWishList={this.handleWishList.bind(this)}
          />
        </TouchableOpacity>
      }
      }
      numColumns={2}
      columnWrapperStyle={style.row}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={this.renderFooter.bind(this)}
      onEndReachedThreshold={1}
      onEndReached={({ distanceFromEnd }) => {
        if (distanceFromEnd > 0) {
          //console.log(`onEndReaded ${distanceFromEnd} isLoading:${this.state.isLoading}`);
          this.handleLoadMore();
          //this.state.isLoading = true;
        }
      }}
    />
  }

  priceToggel() {

  }
  filterView() {
    const { navigation } = this.props;
    return (
      <View style={{ paddingBottom: 15, flexDirection: 'row', backgroundColor: AppColors.appBlue }}>

        <View style={{ flex: 1, marginLeft: 20 }}>
          <TouchableOpacity onPress={() =>
            this.setState({ showSortBy: true })
          }>
            <View>
              <Text style={[AppStyle.bodyText, { color: 'white' }]}>Sort</Text>
              <Text style={[AppStyle.textSmall, { color: AppColors.appGrayLight }]}>Price low to high</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() =>
            navigation.navigate('FilterScreen')
          }>
            <View>
              <Text style={[AppStyle.bodyText, { color: 'white' }]}>Filter</Text>
              <Text numberOfLines={1} style={[AppStyle.textSmall, { color: AppColors.appGrayLight, width: 180 }]}>Categories, Brand, Price range</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  setSortBy = (value) => {
    console.log(`updated value: ${this.state.sortByValue}`);
    this.setState({ sortByValue: value.toString(), isLoading: true, showSortBy: false, currentPage: 1 }, () => {
      //TODO: Do something with this.state here
      console.log(`updated value1: ${this.state.sortByValue}`);
      this.getData();
    });

  }
  render() {
    //const { goBack } = this.props.navigation;
    const { navigation } = this.props;
    //console.log(`page title is  ${this.state.pageTitle}`);
    return (
      <View style={{ flex: 1, backgroundColor: AppColors.pageDarkBackground }}>
        <Header navigation={navigation} title={this.state.pageTitle} />
        <this.filterView />
        {this.contentView()}
        <PopupSortBy isVisible={this.state.showSortBy}
          closeModal={() => { this.setState({ showSortBy: false }) }}
          text1={this.state.alert2Line1}
          text2={this.state.alert2Line2}
          btnText1={this.state.alert2BtnText1}
          btnText2={this.state.alert2BtnText2}
          title={this.state.alertTitle2}
          setSortBy={this.setSortBy}
          onPress1={() => {
            this.setState({ showAlert2: false });
          }}
          onPress2={() => {
            this.setState({ showAlert2: false });
            this.removePrescriptionIndex();
            //this.addressDeleteRequest();
          }}
        />
        <SnackBar
          visible={this.state.isAddRemoveWishlist}
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
const style = StyleSheet.create({
  row: {

    justifyContent: 'flex-start',
    marginLeft: 2,

  }
});
export default ProductList;
