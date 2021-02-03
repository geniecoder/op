
import React, { Component } from 'react';

import { View, Text, Image, StyleSheet } from 'react-native';
export default SingleImageView = (props) => {
  return (
      <View style={{alignSelf: 'stretch', marginBottom:10,  alignSelf: 'stretch', alignItems:'center', }}>
          <Image source={{uri: props.value}} style={{height:150,  alignSelf: 'stretch'}} />
          
      </View>
  );
}
