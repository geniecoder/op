import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';

export default class InputMultiline extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={{ paddingLeft: 2, paddingRight: 2 }}>
        <Text style={styles.inputLable}>
          {this.props.lable}
        </Text>
        <TextInput style={[styles.inputs, AppStyle.bodyText]}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor={Colors.gray}
          underlineColorAndroid="transparent"
          value={this.props.initValue}
          autoCorrect={false}
          maxLength={this.props.maxLength}
          editable={this.props.editable}
          autoCapitalize={this.props.autoCapitalize}
          onChangeText={(value) => this.props.onChangeText(value)}
          keyboardType={this.props.keyboardType} 
          multiline={true}/>
        <Text style={styles.errorStyle}>{this.props.errorMsg}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputs: {
    height: 90,
    fontFamily: 'Roboto',
    borderColor:AppColors.appGray,
    borderWidth:1,
    padding:10
  },
  inputLable: {
    fontSize: 13,
    color: AppColors.appGray,
    fontFamily: 'Roboto'
  },
  errorStyle: {
    fontSize: 12,
    marginTop: 5,
    color: AppColors.errorRed
  }
});
