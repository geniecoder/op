import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, StatusBar, Platform, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';

import logoWhite from '../../assets/images/brand/ola-pharmacy-white.png'
import backIcon from '../../assets/images/icons/left-arrow.png'
import notiIcon from '../../assets/images/icons/notifications-button.png'
import cartIcon from '../../assets/images/icons/cart-icon.png'


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 30 : StatusBar.currentHeight;

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

class HeaderSearchP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  goBack() {
    //const {goBack} = this.props.navigation;
    //this.props.navigate.goBack();
    console.log(`value is ${this.props.value}`);
    // this.props.goBack();
  }

  loadingView() {
    return <ActivityIndicator size="small" color="#fff" />;
  }

  render() {
    const { navigation, title, onChangeText, isLoading } = this.props;
    return (
      <View>
        <GeneralStatusBarColor backgroundColor={AppColors.appBlue} barStyle="light-content" />
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image style={{ margin: 10 }} source={backIcon} />
            </TouchableOpacity>
            <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
              <TextInput
                autoFocus
                autoCorrect={false}
                style={styles.textInput}
                underlineColorAndroid="transparent"
                placeholder="Search Medicine By Name"
                placeholderTextColor="#ffffffbb"
                selectionColor='white'
                returnKeyType='search'
                onChangeText={(searchText) => {
                  onChangeText(searchText);
                  //this.searchingProduct(searchText);
                  //this.setState({ text: searchText });
                }}
              />
              
            </View>
            {isLoading ? <this.loadingView/> : <View/>}
            
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    alignSelf: 'stretch',
    backgroundColor: AppColors.appBlue,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 5
  },
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
  textInput: {
    height: 35,
    paddingLeft: 8,
    marginRight: 20,
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
    fontSize: 14,
    color: '#ffffff',
  },
});

export default HeaderSearchP;
