import React, { Component } from 'react';
import { View, Text, TextComponent, TouchableOpacity } from 'react-native';

import ProductCard from '../card/ProductCard';
import ButtonRound from '../ButtonRound';

import AppColors from '../../values/AppColors';

import { GetApiCall, GetApiRequest, PostApiRequest } from '../../util/ApiCall';
import { BASE_URL_API, HOME_FEED_API, WISH_LIST_ADD, WISH_LIST_DELETE } from '../../config/api_config';
import ProductDataManager from '../../util/ProductDataManager';

export default ProductView = (props) => {

 



  const productData = props.data[0].product_data;
  const priceData = props.data[0].product_data.price;
  const inWishList = props.data[0].wishlist;
  const item = {
    id: props.data[0].product_id
  };

  const productData1 = props.data[1].product_data;
  const priceData1 = props.data[1].product_data.price;
  const inWishList1 = props.data[1].wishlist;
  const item1 = {
    id: props.data[1].product_id
  };

  

  const handleWishList = (value, id) => {
    if (ProductDataManager.getInstance().getUser() !== null) {
      const customerId = ProductDataManager.getInstance().getUser().customer_id;
      const bodyObj = {
        customer_id: customerId
      }
      PostApiRequest(`${BASE_URL_API}${value === 0 || value === null ? WISH_LIST_ADD : WISH_LIST_DELETE}/${id}`, bodyObj)
        .then((response) => {
          const msg = value === 0 || value === null ? 'Product added to Wishlist!' : 'Product removed from Wishlist';
          props.showSnakBar(msg);
          console.log(`response ${JSON.stringify(response)}`);
        })
        .catch(error => {
          console.log(`error ${error}`);
        })
    }else{
      this.props.navigation.navigate('Auth');
    }
  }



  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 16, marginRight: 16, marginBottom: 10 }}>
        <Text>{props.title}</Text>
        <ButtonRound text='View All' onPress={() => {
          props.navigation.navigate('ProductList', { pageTitle: props.title, url: `${BASE_URL_API}${props.endPoint}` });
        }} />
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'stretch', marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => {
            // console.log(`productData: ${JSON.stringify(productData)}`);
            props.navigation.navigate('ProductScreen', { sku: productData.sku, productName: productData.product_title });
          }}>
          <ProductCard
            imgUrl={productData.image}
            productTitle={productData.product_title}
            shortDescription={productData.short_description}
            price={Number(priceData.price)}
            finalPrice={Number(priceData.final_price)}
            specialPrice={Number(priceData.special_price)}
            handleWishList={handleWishList}
            inWishList={inWishList}
            item = {item} />
          <View style={{ width: 3 }} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {

            props.navigation.navigate('ProductScreen', { sku: productData1.sku, productName: productData1.product_title });
          }}>
          <ProductCard
            imgUrl={productData1.image}
            productTitle={productData1.product_title}
            shortDescription={productData1.short_description}
            price={Number(priceData1.price)}
            finalPrice={Number(priceData1.final_price)}
            specialPrice={Number(priceData1.special_price)}
            handleWishList={handleWishList}
            inWishList={inWishList1}
            item = {item1} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
