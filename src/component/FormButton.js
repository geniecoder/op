import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import AppColors from '../values/AppColors';

export default class FormButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

   childView(){
    if(this.props.isLoading){
      return (<ActivityIndicator size="small" color="#ffffff"/>);
    }else{
      return (<Text style={btnText}>{this.props.text}</Text>);
    }
  }
 
  // <Text style={btnText}>{this.props.text}</Text>
  render() {
  const {btnStyle, btnText} = styles;
   //const txtView = <Text style={btnText}>{this.props.text}</Text>;
   //const indicatorView = <ActivityIndicator size="small" color="#ffffff"/>
   var childView;
   if(this.props.isLoading == true){
    //console.log('is loading true');
    childView = <ActivityIndicator size="small" color="#ffffff"/>;
   }else{
     //console.log('is loading false');
     childView = <Text style={btnText}>{this.props.text}</Text>;
   }
    return (
      <View>
        <TouchableOpacity
            style={btnStyle}
            onPress={() => this.props.onPress()}
            underlayColor='#fff'>
            {childView}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
    btnStyle:{
        marginTop:35,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor: AppColors.appBlue,
        borderRadius:4,
        borderWidth: 1,
        borderColor: '#fff',
        height: 50,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
      },
      btnText:{
          color:'#fff',
          fontSize: 16,
          fontWeight: '500',
          fontFamily: 'Roboto'
      },
});


