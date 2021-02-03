import React, { Component } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

const treamentImageColor = ['#ffdbd9', '#ecf7ce', '#c6f4f8', '#fcf0c0'];
export default CatIconList = (props) => {
    console.log(`iconLIst: ${JSON.stringify(props.data[0].image_url)}`);
  return (
    <View style={{marginTop:5, marginBottom:5, backgroundColor:'#fff'}}>
        <FlatList
            showsHorizontalScrollIndicator = {false}
            data={props.data}
            horizontal={true}
            renderItem={({item, index}) => {
                return (
                    <View style={{margin:10, width:70, alignItems: 'center'}}>
                      <TouchableWithoutFeedback onPress={ () =>
                      {
                      console.log(`item no. ${index} catId: ${item.id} name:${item.name}`);
                       /*props.navigation.navigate(
                          {routeName: 'ProductList',  
                          params: {pageTitle: item.name, catId: item.id},
                          key: item.id,
                        });*/
                        props.navigation.navigate('ProductList', {pageTitle: item.name, id: item.id});
                      }}>
                      <View>
                         <View
                          style={[
                            styles.roundView,
                            {backgroundColor: treamentImageColor[index % 4]},
                          ]}
                        >
                          <Image
                            source={{ uri: item.thumbnail }}
                            style={{
                              flex: 1,
                              alignSelf: 'stretch',
                              resizeMode: 'contain',
                              margin: Dimensions.get('window').width * 0.025,
                            }}
                          />
                       </View>
                    <Text style={styles.caresText}>{item.name}</Text>
                </View>
                </TouchableWithoutFeedback>
                </View>
                );
            }}
            keyExtractor={(item, index) => index.toString()}
        />
    </View>
  );
}


const styles = StyleSheet.create({
    roundView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: 60,
        borderRadius: 60/2,
        marginBottom: Dimensions.get('window').height * 0.01,
        margin: 5,
        padding: 5
      },
      caresText: {
        color: '#4c4c4c',
        fontSize: 10,
        fontWeight: 'normal',
        textAlign: 'center',
      },
});
