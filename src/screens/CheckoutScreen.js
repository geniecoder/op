import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Platform } from 'react-native';

import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import RadioButton from "react-native-radio-button";

import Header from '../component/Header';
import addressIcon from '../../assets/images/icons/group-4.png'
import shippedIcon from '../../assets/images/icons/shipped.png'
import infoIcon from '../../assets/images/icons/info.png'
import editIcon from '../../assets/images/icons/edit-2.png'
import listIcon from '../../assets/images/icons/shape-copy.png'

import { BASE_URL_API, ADDRESS_LIST, PRES_ORDER, CUSTOM_BILLING, CUSTOM_BILLING_PAYTM, CHECK_STATUS_PAYTM } from '../config/api_config';
import { GetUser } from '../util/LocalStorage';
import { PostApiRequest, GetApiRequest, DeleteApiRequest } from '../util/ApiCall';
import PrescriptionDataManager from '../util/PrescriptionDataManager';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProductDataManager from '../util/ProductDataManager';
import RetryView from '../component/RetryView';

import Paytm from '@philly25/react-native-paytm';

class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      user: null,
      isLoading: true,
      isLoading1: false,
      selectedAddress: null,
      orderFlow: '',
      paymentOption: 'online',
      retryVisible: false,
      canGoToAddFoorm: true
    };

    this.state.orderFlow = this.props.navigation.getParam('orderFlow');

    this.props.navigation.addListener(
      'didFocus',
      payload => {
        let newAddress = this.props.navigation.getParam('selectedAddress', '');
        if (newAddress === '') {
          GetUser().then((userData) => {
            if (userData != null) {
              this.setState({ user: userData, isLoading: true });
              console.log(`user ${JSON.stringify(this.state.user)}`);
              if (this.state.selectedAddress == null) {
                this.getData();
              }
              return 'App';
            } else {
              return 'Auth';
            }
          });

        } else {
          this.setState({ selectedAddress: newAddress });
          console.log(`new Address ${JSON.stringify(newAddress)}`);
        }
      }
    );

    this.addressView = this.addressView.bind(this);
    this.contentView = this.contentView.bind(this);
    this.paymentOptionView = this.paymentOptionView.bind(this);
  }


  // ---------- paytm code--
  componentDidMount() {
    Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  }

  componentWillUnmount() {
    Paytm.removeListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  }

  onPayTmResponse = (resp) => {
    const { STATUS, status, response } = resp;

    //TXN_FAILURE
    if (Platform.OS === 'ios') {
      console.log(`resp: ${JSON.stringify(resp)}`);
      if (status === 'Success') {
        const jsonResponse = JSON.parse(response);
        const { STATUS } = jsonResponse;

        if (STATUS && STATUS === 'TXN_SUCCESS') {
          console.log(`resp: ${JSON.stringify(jsonResponse)}`);
          this.checkPaymentStatus();
          // Payment succeed!
          console.log(`Payment succeed!`);
        } else {
          this.setState({ isLoading1: false });
          this.props.navigation.navigate('MyOrders');
        }
      }
    } else {
      console.log(`resp: ${JSON.stringify(resp)}`);
      if (STATUS && STATUS === 'TXN_SUCCESS') {
        // Payment succeed!
        console.log(`resp: ${JSON.stringify(resp)}`);
        console.log(`Payment succeed!`);
        this.checkPaymentStatus();
      } else {
        this.setState({ isLoading1: false });
        this.props.navigation.navigate('MyOrders');
      }
    }
  };

  runTransaction(data) {
    //const callbackUrl = `${paytmConfig.CALLBACK_URL}${orderId}`;
    const details = {
      mode: 'Production', // 'Staging' or 'Production'
      MID: data.MID,
      INDUSTRY_TYPE_ID: data.INDUSTRY_TYPE_ID,
      WEBSITE: data.WEBSITE,
      CHANNEL_ID: data.CHANNEL_ID,
      TXN_AMOUNT: data.TXN_AMOUNT, // String
      ORDER_ID: data.ORDER_ID, // String
      EMAIL: data.EMAIL, // String
      MOBILE_NO: data.MOBILE_NO, // String
      CUST_ID: data.CUST_ID, // String
      CHECKSUMHASH: data.CHECKSUMHASH, //From your server using PayTM Checksum Utility 
      CALLBACK_URL: data.CALLBACK_URL,
      //MERC_UNQ_REF: mercUnqRef, // optional
    };
    Paytm.startPayment(details);
  }



  getData() {
    GetApiRequest(`${BASE_URL_API}${ADDRESS_LIST}/${this.state.user.customer_id}`)
      .then((response) => {
        //this.setState({ isLoading: false, data: response.data });
        if (response.status === '1') {
          this.setState({ isLoading: false, data: response.data }
          );
        }
        if (this.state.data !== null) {
          this.getDefaultAddress()
        } else {
          console.log(`state data is null`);
        }

      }).catch(error => {
        console.log(`error: ${error}`)
        this.setState({ isLoading: false, isLoadingMore: false, retryVisible: true });
      })
  }

  getDefaultAddress() {
    var index = this.state.data.findIndex(
      function (item, i) {
        return item.default === 1;
      }
    );
    console.log(`default index: ${index}`);
    if (index !== -1) {
      this.setState({ selectedAddress: this.state.data[index] });
    } else {
      if (this.state.data.length > 0) {
        this.setState({ selectedAddress: this.state.data[0] });
      } else {

      }
    }
    //console.log(`default address index ${JSON.stringify(this.state.data[index])}`);
  }

  reloadData() {
    console.log(`data reload`)
    this.setState({ isLoading: true, retryVisible: false }, this.getData());

  }

  contentView() {
    if (this.state.retryVisible) {
      return <RetryView onPress={() => this.reloadData()} />
    }
    if (this.state.isLoading !== true) {
      if (this.state.data.length > 0 || this.state.selectedAddress !== null) {
        return (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <this.addressView />
              {this.state.orderFlow === 'product' ? <this.paymentOptionView /> : <View />}
              {/*<this.shippingMethodView />*/}
              {/* <this.deliveryTimeView />*/}
            </ScrollView>
            <ButtonRect isLoading={this.state.isLoading1} text='Continue' onPress={() => {
              if (this.state.orderFlow === 'product') {
                console.log(`This is product order flow`);
                this.placeOrderCartItems();
              } else {
                console.log(`This is prescription order flow`);
                this.placeOrder();
              }
            }} />
          </View>
        );
      } else {
        //this.state.isLoading = true;
        if (this.state.canGoToAddFoorm) {
          this.props.navigation.navigate('AddAddress', { comeFrom: 'checkout' });
          this.state.canGoToAddFoorm = false;
        }

        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddAddress', { comeFrom: 'checkout' });
                //this.props.navigation.navigate('AddressList', { listType: 'selection' });
              }}
            >
              <Text>Tap to Add Address</Text>
            </TouchableOpacity>

          </View>
        )
      }
    } else {
      return (
        <this.loadingView />
      )
    }
  }
  loadingView() {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#000" /></View>
  }

  addressView() {
    if (this.state.selectedAddress != null) {
      ProductDataManager.getInstance().setSelectedAddress(this.state.selectedAddress);
      return (
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={addressIcon} />
              <Text style={{ marginLeft: 10 }}>Delivery Address</Text>
            </View>


            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  console.log(`edit address`);
                  //this.props.navigation.navigate('AddAddress', { comeFrom: 'checkout' });
                  this.props.navigation.navigate('AddAddress', { addressItem: this.state.selectedAddress, comeFrom: 'checkout' });
                }}>
                <Image source={editIcon} />
              </TouchableOpacity>
              <View style={{ width: 20 }} />
              <TouchableOpacity
                onPress={() => {
                  console.log(`edit address`);
                  this.props.navigation.navigate('AddressList', { listType: 'selection' });
                }}>
                <Image source={listIcon} />
              </TouchableOpacity>
            </View>


          </View>
          <View style={{ backgroundColor: AppColors.pageBackground, marginTop: 14, padding: 12 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={addressIcon} />
              <Text style={{ marginLeft: 10 }}>{`${this.state.selectedAddress.firstname} ${this.state.selectedAddress.lastname}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 7, alignItems: 'center' }}>
              <Text style={styles.selectionText}>Phone</Text>
              <View style={{ height: 10, width: 1, backgroundColor: '#999999', marginLeft: 15, marginRight: 15 }} />
              <Text style={styles.selectionText}>{this.state.selectedAddress.telephone}</Text>
            </View>
            <Text style={[styles.selectionText, { marginTop: 7 }]}>
              {`${this.state.selectedAddress.city}, ${this.state.selectedAddress.street}, ${this.state.selectedAddress.country_id}, ${this.state.selectedAddress.postcode},`}
            </Text>
          </View>
        </View>
      );
    } else {
      return (<View><Text>address is loadiong...</Text></View>);
    }
  }

  paymentOptionView() {
    const { paymentOption } = this.state;
    return (
      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={shippedIcon} />
          <Text style={{ marginLeft: 10 }}>Payment Option</Text>
        </View>
        <View style={{ marginTop: 15, marginLeft: 5 }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ paymentOption: 'online' });
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                innerColor="#2f80ed"
                outerColor="#2f80ed"
                animation="bounceIn"
                size={8}
                isSelected={paymentOption === 'online'}
                onPress={() => {
                  this.setState({ paymentOption: 'online' });
                  // eslint-disable-next-line react/no-this-in-sfc
                }}
              />
              <Text style={[styles.selectionText, { marginLeft: 15 }]}>
                Pay with Paytm
            </Text>
            </View>
          </TouchableOpacity>
          <View style={{ height: 15 }} />
          <TouchableOpacity
            onPress={() => {
              this.setState({ paymentOption: 'cash' });
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                innerColor="#2f80ed"
                outerColor="#2f80ed"
                animation="bounceIn"
                size={8}
                isSelected={paymentOption === 'cash'}
                onPress={() => {
                  this.setState({ paymentOption: 'cash' });
                  // eslint-disable-next-line react/no-this-in-sfc

                }}
              />
              <Text style={[styles.selectionText, { marginLeft: 15 }]}>
                Cash on delivery
            </Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  shippingMethodView() {
    return (
      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={shippedIcon} />
          <Text style={{ marginLeft: 10 }}>Select Shipping Method</Text>
        </View>
        <View style={{ marginTop: 15, marginLeft: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              innerColor="#2f80ed"
              outerColor="#2f80ed"
              animation="bounceIn"
              size={8}
              isSelected={true}
              onPress={() => {
                // eslint-disable-next-line react/no-this-in-sfc
              }}
            />
            <Text style={[styles.selectionText, { marginLeft: 15 }]}>
              Free Shipping upto 50kms
            </Text>
          </View>
          <View style={{ height: 15 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              innerColor="#2f80ed"
              outerColor="#2f80ed"
              animation="bounceIn"
              size={8}
              isSelected={false}
              onPress={() => {
                // eslint-disable-next-line react/no-this-in-sfc

              }}
            />
            <Text style={[styles.selectionText, { marginLeft: 15 }]}>
              Flat Rs. 100 off on purchase of Rs.1,000
            </Text>
          </View>
        </View>
      </View>
    );
  }

  deliveryTimeView() {
    return (
      <View style={styles.sectionContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={shippedIcon} />
          <Text style={{ marginLeft: 10 }}>Select Delivery Time</Text>
        </View>
        <View style={{ marginTop: 15, marginLeft: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              innerColor="#2f80ed"
              outerColor="#2f80ed"
              animation="bounceIn"
              size={8}
              isSelected={true}
              onPress={() => {
                // eslint-disable-next-line react/no-this-in-sfc

              }}
            />
            <Text style={[styles.selectionText, { marginLeft: 15 }]}>
              2-3 Business days-Free Delivery
            </Text>
          </View>
          <View style={{ height: 15 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              innerColor="#2f80ed"
              outerColor="#2f80ed"
              animation="bounceIn"
              size={8}
              isSelected={false}
              onPress={() => {
                // eslint-disable-next-line react/no-this-in-sfc

              }}
            />
            <Text style={[styles.selectionText, { marginLeft: 15 }]}>
              Immediately- Delivery charges Rs.200
            </Text>
          </View>
          <View style={{ height: 15 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              innerColor="#2f80ed"
              outerColor="#2f80ed"
              animation="bounceIn"
              size={8}
              isSelected={false}
              onPress={() => {
                // eslint-disable-next-line react/no-this-in-sfc

              }}
            />
            <Text style={[styles.selectionText, { marginLeft: 15 }]}>
              Tomorrow by 9PM-Delivery charges Rs.100
            </Text>
          </View>

          <View style={{ height: 20 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={infoIcon} />
            <Text style={[AppStyle.tinyGrayText, { marginLeft: 7 }]}>
              Delivery is subjected to the avalibality of the product Term &amp; Conditions
            </Text>
          </View>
        </View>
      </View>
    );
  }


  render() {
    const { navigation } = this.props;
    return (
      <View style={AppStyle.pageContainer}>
        <Header navigation={navigation} title='Checkout' />
        <this.contentView />
      </View>
    );
  }


  checkPaymentStatus() {
    this.setState({ isLoading: true });
    const sendObj = {
      orderdetails: this.state.checksumObj
    }
    PostApiRequest(`${BASE_URL_API}${CHECK_STATUS_PAYTM}`, sendObj).
      then(response => {
        console.log(`response: ${JSON.stringify(response)}`);
        if (response.code == 'SUCCESS') {
          this.setState({ isLoading1: false, isLoading: false });
          this.gotoNext(response.data.ORDERID);
        }
      }).
      catch(error => {
        console.log(`error ${error}`);
      });
  }



  placeOrderCartItems() {
    this.setState({ isLoading1: true });
    const { paymentOption } = this.state;
    const sendObj = {
      quoteid: ProductDataManager.getInstance().getQuoteId(),
      userid: ProductDataManager.getInstance().getUser().customer_id,
      address: ProductDataManager.getInstance().getSelectedAddress(),
      email: ProductDataManager.getInstance().getUser().email
    }

    //PostApiRequest(`${BASE_URL_API}${CUSTOM_BILLING}`, sendObj)
    PostApiRequest(`${BASE_URL_API}${paymentOption === 'online' ? CUSTOM_BILLING_PAYTM : CUSTOM_BILLING}`, sendObj)
      .then(response => {
        console.log(`response ${JSON.stringify(response)}`);
        if (response.status === '1') {
          if (paymentOption === 'online') {
            this.state.checksumObj = response.data;
            this.runTransaction(response.data);
          } else {
            ProductDataManager.getInstance().setEmptyCartData();
            this.setState({ isLoading1: false });
            this.gotoNext(response.order_id);
          }
          console.log(`response: ${JSON.stringify(response)}`);

          //PrescriptionDataManager.getInstance().setEmptyCartData();

          //ProductDataManager.getInstance().setCartCount(response.cart_count);
          //this.setState({});
          //console.log(`response count: ${response.cart_count}`);
        }
      })
      .catch(error => {
        console.warn(`error: ${error}`);
      })
  }



  placeOrder() {

    let prescriptionData = PrescriptionDataManager.getInstance();
    const { prescriptionValidity, selectedProductArray, selectedPescriptionArray, orderState, callTime, medicineValidity } = prescriptionData;

    const prescriptionIds = {};
    const productIds = {};
    const sendObj = {
      data: {
        customer_id: this.state.user.customer_id,
        customer_email: this.state.user.email,
        order_state: orderState,
        address_id: this.state.selectedAddress.entity_id
      }
    }


    if (selectedPescriptionArray && selectedPescriptionArray.length) {
      for (let i = 0; i < selectedPescriptionArray.length; i += 1) {
        prescriptionIds[`${i + 1}`] = selectedPescriptionArray[i].id;
      }
      sendObj.data.prescription_ids = prescriptionIds;
      sendObj.data.prescription_validity = prescriptionValidity;
      // console.log(`call_time singleton:  ${prescriptionData.callTime}`);
    }

    if (selectedProductArray && selectedProductArray.length && orderState == 'medication') {
      for (let i = 0; i < selectedProductArray.length; i += 1) {
        productIds[`${i + 1}`] = parseInt(selectedProductArray[i].add_to_cart.productId); //id
      }
      sendObj.data.product_ids = productIds;
      sendObj.data.medicine_validity = medicineValidity;
      //this.setState({ orderState: "medication" }); // eslint-disable-line react/no-this-in-sfc
    }

    if (callTime) {
      sendObj.data.call_time = callTime;
    }

    this.setState({ isLoading1: true });

    PostApiRequest(`${BASE_URL_API}${PRES_ORDER}`, sendObj)
      .then((response) => {
        this.setState({ isLoading1: false });
        PrescriptionDataManager.getInstance().resetPrescriptionOrderData();
        this.gotoNext(response.data.order_id);

        console.log(`reponse: ${JSON.stringify(response.data)}`);
      }).catch((error) => {
        console.log(`error ${error}`);
      });











    console.log(`sendObj: ${JSON.stringify(sendObj)}`);
  }
  gotoNext(orderId) {

    const { navigation } = this.props;
    navigation.navigate('ThankYou', { orderId: orderId });

  }
}

export default CheckoutScreen;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 15,
  },
  selectionText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: AppColors.appGray,
  }
});
