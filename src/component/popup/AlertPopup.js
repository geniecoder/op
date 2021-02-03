import React from 'react';
import { Text, View, StyleSheet, Dimensions, Modal, TouchableOpacity, Image, FlatList } from 'react-native';
import ButtonRect from '../../component/ButtonRect';
import AppStyles from '../../style/AppStyle';
import AppStyle from '../../style/AppStyle';
const AlertPopup = (props) => (
  <Modal
    visible={props.isVisible}
    transparent animationType='none'
    onRequestClose={() => props.closeModal}>
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      activeOpacity={1}
      onPress={() => {
        console.log(`this should close popup`);
        props.closeModal()
      }}
    >
      <TouchableOpacity activeOpacity={1} style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>{props.title}</Text>
        </View>
        <View style={styles.modalBody}>
          <View style={{ marginTop: 60 }}>
            <Text style={styles.bigTextStyle}>{props.text1}</Text>
            <Text style={[AppStyle.bodyText, { marginTop: 10 }]}>{props.text2}</Text>
          </View>

          <View style={{ height:35, backgroundColor:'gray', marginVertical:30, alignItems:'stretch', alignSelf:'stretch', marginHorizontal:50}}>
            
            <ButtonBlue text={props.btnText} onPress={props.onPress} />
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modal: {
    height: Dimensions.get('window').height * 0.35,
    width: Dimensions.get('window').width * 0.85,
  },
  modalHeader: {
    // flex: 1,
    height: Dimensions.get('window').width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d447a',
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  modalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'space-between'
  },
  modalHeaderText: {
    fontSize: 18,
    color: '#ffffff',

  },
  modalIconImage: {
    flex: 2,
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
    margin: '15%',
    marginBottom: -5
  },
  modalIconText: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: 14,
    color: 'black',
    textAlign: 'center'
  },
  bigTextStyle: {
    fontFamily: 'Roboto',
    fontSize: 17,
    color: 'black',
    textAlign: 'center'
  }
});

export default AlertPopup;
