import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import Header from '../component/Header';
import ButtonRect from '../component/ButtonRect';
import { PostApiRequest, GetApiRequest } from '../util/ApiCall';
import { BASE_URL_API, CART_DETAIL, UPDATE_POST, CART_DELETE, POST_COUPON } from '../config/api_config';
import { GetUser } from '../util/LocalStorage';
import ProductDataManager from '../util/ProductDataManager'
import CartItem from '../component/card/CartItem';
import SnackBar from 'react-native-snackbar-component';
import RetryView from '../component/RetryView';
import removeIcon from '../../assets/images/icons/delete.png';

class CartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            priceInfo: null,
            couponInfo: null,
            items: null,
            user: null,
            error: null,
            isVisibleSnackBar: false,
            snackBarMsg: '',
            retryVisible: false
        };
        this.cartItemSection = this.cartItemSection.bind(this);
        this.contentView = this.contentView.bind(this);
        this.amountView = this.amountView.bind(this);
        this.couponView = this.couponView.bind(this);
        this.couponViewContent = this.couponViewContent.bind(this);
    }
    componentDidMount() {
        GetUser().then((userData) => {
            if (userData != null) {
                this.setState({ user: userData });
                console.log(`user ${JSON.stringify(this.state.user)}`);
                //this.getData();
                this.getCartDetails();
                return 'App';
            } else {
                return 'Auth';
            }
        });
    }
    couponAppliedSuccess() {
        this.state.isVisibleSnackBar = true;
        this.getCartDetails();
    }
    getCartDetails() {
        this.setState({ isLoading: true })
        const bodyObj = {
            data: {
                userid: this.state.user.customer_id
            }
        }
        PostApiRequest(`${BASE_URL_API}${CART_DETAIL}`, bodyObj)
            .then((response) => {
                console.log(`response:-- (getCartDetails) ${JSON.stringify(response)}`);
                if (response.status === '1') {
                    //console.log(`response:-- ${JSON.stringify(response)}`);
                    if (response.data.items.length > 0) {
                        this.updateDataManager(response.data.priceInfo.quoteId, response.data.priceInfo.cart_count);
                    }
                    if (this.state.isVisibleSnackBar === true) {
                        //couponInfo.couponCode
                        //${response.data.couponInfo.couponCode} 
                        const snackMsg = `Coupon applied successfully`;
                        this.setState({ error: null, isLoading: false, priceInfo: response.data.priceInfo, items: response.data.items, couponInfo: response.data.couponInfo, snackBarMsg: snackMsg });
                        setTimeout(() => {
                            this.setState({ isVisibleSnackBar: false });
                        }, 3000)
                    } else {
                        this.setState({ error: null, isLoading: false, priceInfo: response.data.priceInfo, items: response.data.items, couponInfo: response.data.couponInfo });
                    }
                    this.setState({ error: null, isLoading: false, priceInfo: response.data.priceInfo, items: response.data.items, couponInfo: response.data.couponInfo });

                }
            })
            .catch(error => {
                this.setState({ isLoading: false, error: error, isLoadingMore: false, retryVisible: true });
                console.log(`error:- ${error}`);
            });
    }
    updatePost(item, AddQTY) {
        console.log(`item:- ${JSON.stringify(item)}`);
        const bodyObj = {
            data: {
                qty: Number(item.qty) + AddQTY,
                productid: item.productId,
                userid: this.state.user.customer_id,
                quoteid: this.state.priceInfo.quoteId
            }
        }
        PostApiRequest(`${BASE_URL_API}${UPDATE_POST}`, bodyObj)
            .then(response => {
                console.log(`updatePst response: ${JSON.stringify(response)}`);
                if (response.status === '1') {
                    this.updateDataManager(null, response.data.priceInfo.cart_count);
                    this.setState({ priceInfo: response.data.priceInfo, items: response.data.items, couponInfo: response.data.couponInfo });
                }
            })
            .catch(error => {
                console.log(`error:- ${error}`);
            });
    }
    cartItemDelete(item) {
        const bodyObj = {
            data: {
                productid: item.productId,
                userid: this.state.user.customer_id,
            }
        }
        PostApiRequest(`${BASE_URL_API}${CART_DELETE}`, bodyObj)
            .then(response => {
                console.log(`delete item response: ${JSON.stringify(response)}`);
                if (response.status === '1') {
                    this.updateDataManager(null, response.data.priceInfo.cart_count);
                    this.setState({ priceInfo: response.data.priceInfo, items: response.data.items, couponInfo: response.data.couponInfo });
                }
            })
            .catch(error => {
                console.log(`error:- ${error}`);
            });
    }

    removeCoupon() {
        //console.log(`applyCoupon quoteId: ${ProductDataManager.getInstance().getQuoteId()}`);

        //this.setState({ isCouponAdding: true });

        const bodyObj = {
            data: {
                action: "remove",
                quoteid: ProductDataManager.getInstance().getQuoteId(),
                couponcode: this.state.couponInfo.couponCode,
            }
        }
        PostApiRequest(`${BASE_URL_API}${POST_COUPON}`, bodyObj)
            .then(response => {
                this.setState({ isCouponAdding: false });
                console.log(`PostCoupon response: ${JSON.stringify(response)}`);
                if (response.status === '1') {
                    //this.props.navigation.navigate('CartScreen');
                    this.setState({ couponInfo: response.data.couponInfo, priceInfo: response.data.priceInfo, isVisibleSnackBar: true, snackBarMsg: 'Coupon removed' });
                    setTimeout(() => {
                        this.setState({ isVisibleSnackBar: false });
                    }, 3000)
                }
            })
            .catch(error => {
                console.log(`error ${error}`);
            });

    }

    updateDataManager(quoteId, cartCount) {
        if (quoteId !== null) {
            ProductDataManager.getInstance().setQuoteId(quoteId);
        }
        if (cartCount !== null) {
            ProductDataManager.getInstance().setCartCount(cartCount);
        }

    }


    cartItemSection() {
        console.log(`items array length: ${this.state.items.length}`);
        return (
            <View style={{ marginTop: 10, backgroundColor: '#c3c3c3' }}>
                {this.state.items.map((item, index) => {
                    return (
                        <CartItem index={index} item={item} updatePost={this.updatePost.bind(this)} cartItemDelete={this.cartItemDelete.bind(this)} />
                    );
                })}
            </View>
        );
    }
    couponView() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('CouponScreen', { couponAppliedSuccess: this.couponAppliedSuccess.bind(this) });
                }}
            >
                <View style={{ marginTop: 10, backgroundColor: '#fff', padding: 10 }}>
                    <this.couponViewContent />
                </View>
            </TouchableOpacity>
        );
    }

    couponViewContent() {
        const couponInfo = this.state.couponInfo;

        console.log(`couponApplied: ${couponInfo.couponApplied}`);

        if (couponInfo.couponApplied === false) {
            return (<Text>Apply Coupon</Text>);
        } else {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View>
                        <Text>Coupon Applied</Text>
                        <Text style={[AppStyle.textSmallBlue, { fontWeight: 'bold', marginTop: 5 }]}>{couponInfo.couponCode}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            console.log(`remove coupon`);
                            this.removeCoupon();
                        }
                        }
                    >
                        <Image source={removeIcon} />
                    </TouchableOpacity>
                </View>
            )
        }

    }
    amountView() {
        const { priceInfo } = this.state;
        console.log(`priceInfo: ${JSON.stringify(priceInfo)}`);
        return (
            <View style={{ marginTop: 10, backgroundColor: '#fff', padding: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={AppStyle.bodyText}>
                        Subtotal
                    </Text>
                    <Text style={AppStyle.bodyText}>{`₹ ${priceInfo.sub_total}`}</Text>
                </View>
                {this.state.priceInfo.discount === '0' ? <View /> :
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={AppStyle.bodyText}>
                            Discount
                </Text>
                        <Text style={AppStyle.bodyText}>{`₹ ${priceInfo.discount}`}</Text>
                    </View>
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={AppStyle.bodyText}>
                        Delivery Charges
                    </Text>
                    <Text style={AppStyle.bodyText}>{`₹ ${priceInfo.delivery_charge}`}</Text>
                </View>
                <View style={AppStyle.lineFullWidth} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>
                    <Text style={[AppStyle.title, { fontWeight: 'bold' }]}>
                        Grand Total
                    </Text>
                    <Text style={[AppStyle.title, { fontWeight: 'bold' }]}>{`₹ ${priceInfo.grand_total}`}</Text>
                </View>
            </View>
        );
    }
    loadingView() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#000" /></View>
    }
    reloadData() {
        console.log(`data reload`)
        this.setState({ isLoading: true, retryVisible: false }, this.getCartDetails());

    }
    contentView() {
        const { navigation } = this.props;
        if (this.state.retryVisible) {
            return <RetryView onPress={() => this.reloadData()} />
        }
        if (this.state.isLoading) {
            return (<this.loadingView />);
        }
        if (this.state.items == null) {
            return (<View/>);
        }
        if (this.state.items.length > 0) {
            return (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={{ width: "100%" }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <this.cartItemSection />
                        <this.couponView />
                        <this.amountView />
                    </ScrollView>
                    <ButtonRect text='Proceed to Checkout' onPress={() => {
                        console.log('Proceed to Check');
                        navigation.navigate('CheckoutScreen', { orderFlow: 'product' });
                    }} />
                    <SnackBar
                        visible={this.state.isVisibleSnackBar}
                        textMessage={this.state.snackBarMsg}
                        actionHandler={() => {
                            console.log("snackbar button clicked!");
                            this.props.navigation.navigate('CartScreen');
                        }}
                        actionText=""
                        containerStyle={
                            AppStyle.containerStyle
                        } />
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={AppStyle.bodyText}>
                    There are no items in your cart right now
                    </Text>
                </View>
            );
        }

    }

    loadingView() {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#000" /></View>;
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={AppStyle.pageContainer}>
                <Header navigation={navigation} title='Cart' />
                <this.contentView />
            </View>
        );
    }
}

export default CartScreen;
