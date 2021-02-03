import React, { Component } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import { PostApiCall, PostApiRequest, GetApiRequest } from '../util/ApiCall';
import { GetUser } from '../util/LocalStorage';
import { BASE_URL_API, WISH_LIST, IMG_BASE_URL, WISH_LIST_DELETE, ADD_TO_CART } from '../config/api_config';
import ProductCard from '../component/card/ProductCard';
import ProductDataManager from '../util/ProductDataManager';
import RetryView from '../component/RetryView';



import SnackBar from 'react-native-snackbar-component';


class WishList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            user: null,
            data: null,
            retryVisible: false,
            isVisibleSnackBar: false,
            snackBarMsg: '',

        };
        this.contentView = this.contentView.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }
    componentDidMount() {
        GetUser().then((userData) => {
            if (userData != null) {
                this.setState({ user: userData });
                console.log(`user ${JSON.stringify(this.state.user)}`);
                this.getData();
                return 'App';
            } else {
                return 'Auth';
            }
        });
    }
    getData() {
        const bodyObj = {
            customer_id: this.state.user.customer_id
        }
        PostApiRequest(`${BASE_URL_API}${WISH_LIST}`, bodyObj)
            .then(response => {
                console.log(`response ${JSON.stringify(response)}`);
                if (response.status === '1') {

                    this.setState({ isLoading: false, data: response.data });
                }
            })
            .catch(error => {
                console.log(`error ${error}`);
                this.setState({ isLoading: false, isLoadingMore: false, retryVisible: true });
            })
    }
    handleWishList = (value, id) => {
        if (ProductDataManager.getInstance().getUser() !== null) {
            const customerId = ProductDataManager.getInstance().getUser().customer_id;
            const bodyObj = {
                customer_id: customerId
            }
            PostApiRequest(`${BASE_URL_API}${value === 0 || value === null ? WISH_LIST_ADD : WISH_LIST_DELETE}/${id}`, bodyObj)
                .then((response) => {
                    console.log(`response ${JSON.stringify(response)}`);
                    this.getData();
                    this.setState({ isVisibleSnackBar: true, isActionButton:false, snackBarMsg: value === 0 || value === null ? 'Product added to Wishlist!' : 'Product removed from Wishlist' });
                    setTimeout(() => {
                        this.setState({ isVisibleSnackBar: false });
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
    addToCart(productId) {
        
        console.log(`user obj: ${JSON.stringify(ProductDataManager.getInstance().getUser())}`);
        const customerId = ProductDataManager.getInstance().getUser().customer_id;
        const bodyObj = {
            data: {
                userid: customerId ? customerId : '',
                qty: 1,
                itemid: productId,
            }
        }
        PostApiRequest(`${BASE_URL_API}${ADD_TO_CART}`, bodyObj)
            .then(response => {
                console.log(`addToCart response ${JSON.stringify(response)}`);
                if (response.status === '1') {
                    ProductDataManager.getInstance().setCartCount(response.cart_count);
                    this.setState({ isVisibleSnackBar: true, isActionButton: true, snackBarMsg: 'Product added to Cart!' });
                    setTimeout(() => {
                        this.setState({ isVisibleSnackBar: false, isActionButton: false });
                    }, 3000)
                    console.log(`response count: ${response.cart_count}`);
                }
            })
            .catch(error => {
                console.log(`error ${error}`);
            })
    }
    contentView() {
        const { isLoading, data } = this.state;
        if (this.state.retryVisible) {
            return <RetryView onPress={() => this.reloadData()} />
        }
        if (isLoading) {
            return this.loadingView();
        }
        if (data !== null) {
            if (data.length > 0) {
                return this.productList();
            } else {
                return this.emptyView();
            }

        } else {
            return (this.errorView());
        }
    }

    errorView() {
        return (
            <View>
                <Text>Somthing went wrong</Text>
                <Text>Retry</Text>
            </View>
        );
    }

    emptyView() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Text>There are no products in your Wishlist yet.</Text>
        </View>
    }
    productList() {
        console.log(`data length ${this.state.data.length}`)
        return (
            <FlatList
                data={this.state.data}
                renderItem={({ item, index }) => {
                    const { name, imageUrl, price, final_price, min_price, sku, short_description, wishlist, special_price, id } = item.product;
                    return (
                        <TouchableOpacity onPress={() => {
                            console.log(`goto product page`);
                            this.props.navigation.navigate('ProductScreen', { sku: sku, productName: name, productId: id });
                        }}>
                            <ProductCard
                                imgUrl={`${IMG_BASE_URL}${imageUrl}`}
                                productTitle={name}
                                shortDescription={short_description}
                                price={Number(price)}
                                finalPrice={Number(final_price)}
                                specialPrice={Number(special_price)}
                                gridMargin={index % 2 == 0 ? 0 : 2}
                                inWishList={1}
                                item={item.product}
                                handleWishList={this.handleWishList.bind(this)}
                                cardFor='wishlist'
                                addToCart={this.addToCart}
                            />
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />
        );
    }
    loadingView() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating size="large" />
            </View>
        );
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={AppStyle.pageContainer}>
                <Header title='Wish List' navigation={navigation} />
                <this.contentView />
                <SnackBar
                    visible={this.state.isVisibleSnackBar}
                    textMessage={this.state.snackBarMsg}
                    actionHandler={() => {
                        console.log("snackbar button clicked!");
                        if (this.state.isActionButton) {
                            this.props.navigation.navigate('CartScreen');
                        }
                    }}
                    actionText={this.state.isActionButton ? "Goto Cart" : ''}
                    containerStyle={
                        AppStyle.containerStyle
                    } />
            </View>
        );
    }
}

export default WishList;
