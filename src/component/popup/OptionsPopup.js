import React from 'react';
import { Text, View, StyleSheet, Dimensions, Modal, TouchableOpacity, Image, FlatList } from 'react-native';
const OptionsPopup = (props) => (
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
              props.closeModal()}}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>{props.title}</Text>
              </View>
              <View style={styles.modalBody}>
                <View style={{ flex: 0.5 }}/>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => props.onPress1()}
                >
                  <Image source={props.image1} style={styles.modalIconImage}/>
                  <Text style={styles.modalIconText}>{props.text1}</Text>
                </TouchableOpacity>
                <View style={{ flex: .5 }}/>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => props.onPress2()}
                >
                  <Image source={props.image2} style={styles.modalIconImage} />
                  <Text style={styles.modalIconText}>{props.text2}</Text>
                </TouchableOpacity>
                <View style={{ flex: 0.5 }}/>
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
        flex: 3.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
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
      }
});
export default OptionsPopup;
