import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import Header from '../component/Header';
import AppColors from '../values/AppColors';
import AppStyle from '../style/AppStyle';
import camImg from '../../assets/images/icons/photo-camera.png';
import galleryImg from '../../assets/images/icons/gallery.png';
import presImg from '../../assets/images/icons/exam.png';
import uploadImg from '../../assets/images/icons/cloud-computing.png';
import attachImg from '../../assets/images/icons/attachment.png';
import validPresImg from '../../assets/images/icons/checklist-1.png';
import presPreview from '../../assets/images/graphic/group-21.png';
import cancelIcon from '../../assets/images/icons/close.png';

import OptionsPopup from '../component/popup/OptionsPopup';
import AlertPopup from '../component/popup/AlertPopup';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from "react-native-image-resizer";
import { UploadImage } from '../util/ApiCall';
import DocumentPicker from 'react-native-document-picker';

import ButtonRect from '../component/ButtonRect';

import { CameraPermission, ReadExternalStorage } from '../util/RequestAndroidPermission';
import { FlatList } from 'react-native-gesture-handler';

import HTML from 'react-native-render-html';

import ProductDataManager from '../util/ProductDataManager';
import PrescriptionDataManager from '../util/PrescriptionDataManager';

const htmlContent = `
<ul style="list-style-type:disc">
<li>Don’t crop out any part of the image.</li>
<li>Avoid using a blurred image.</li>
<li>Ensure the prescription includes details of doctor and patient + clinic visit date.</li>
<li>Medicines will be dispensed as per prescription.</li>
</ul>
`;


class UploadPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: 'Upload Prescription',
      showGalleryOptions: false,
      showAlert: false,
      filepath: {
        data: '',
        uri: ''
      },
      fileData: '',
      fileUri: '',
      selectedPresArray: [],
      userData: null,
      alertTitle: '',
      alertLine1: '',
      alertLine2: '',
      alertBtnText: '',
    };
    this.uploadOptionView = this.uploadOptionView.bind(this);
    this.prescriptionView = this.prescriptionView.bind(this);
  }

  /*componentDidMount() {
    const { navigation } = this.props;
    console.log(`call the function without listener`);
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      const array = navigation.getParam('selectedPresArray', null);
      console.log(`call the function ${array.length}`);
      if (array != null) {
        console.log(`selectedPresArray from list: ${array.length} arr: ${array}`);
        //this.state.selectedPresArray = array;
        this.setState({ selectedPresArray: [...this.state.selectedPresArray, ...array] });
      }
      //Put your Data loading function here instead of my this.LoadData()
    });
  }*/

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.setState({});
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  margePresArray(newPresArray) {
    console.log(`margePresArray ${newPresArray.length}`);
    //this.setState({ selectedPresArray: [...this.state.selectedPresArray, ...newPresArray] });
    this.setState({ selectedPresArray: newPresArray });
  }

  removeAllPrescriptions() {
    this.setState({ selectedPresArray: [] });
  }

  //----------Camera and gallery--------------------------------
  chooseImage = () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // alert(JSON.stringify(response));
        //console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });
      }
    });
  }

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));
        this.resizeImage(response);
        /*this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });*/
      }
    });
  }

  launchImageLibrary = () => {

    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        //console.log('response', JSON.stringify(response));
        this.resizeImage(response);
        /*this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri
        });*/
      }
    });
  }


  resizeImage = (res) => {
    console.log(`call resizeImage uri: ${res.uri}`);
    ImageResizer.createResizedImage(res.uri, 800, 600, 'JPEG', 70)
      .then(({ uri }) => {
        console.log(`resized uri: ${uri}`);
        const name = 'myprescription01.jpg';
        const imgToSend = {
          uri,
          type: "image/jpeg",
          name
        };
        const fd = new FormData(); // eslint-disable-line no-undef
        fd.append("customer_email", ProductDataManager.getInstance().getUser().email);
        fd.append("customer_id", ProductDataManager.getInstance().getUser().customer_id);
        fd.append("prescription_file", imgToSend);
        console.log(`json body to send : ${JSON.stringify(fd)}`);
        const Path1 = `http://13.127.86.151/ola-web/prescription/ajax/mobileupload`;
        this.makeFetchCall(Path1, "POST", fd);
        this.setState({
          resizedImageUri: uri,
        });
      })
      .catch(err => {
        console.log(err);
        return Alert.alert(
          'Unable to resize the photo',
          'Check the console for full the error message',
        );
      });
  }

  async getDocumentFromLibrary() {
    // iPhone/Android
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      const response = {
        uri: res.uri,
        type: res.type,
        name: res.name,
      };

      const fd = new FormData(); // eslint-disable-line no-undef
      fd.append("customer_email", ProductDataManager.getInstance().getUser().email);
      fd.append("customer_id", ProductDataManager.getInstance().getUser().customer_id);
      fd.append("prescription_file", response);
      console.log(`json body to send : ${JSON.stringify(fd)}`);
      const Path1 = `http://13.127.86.151/ola-web/prescription/ajax/mobileupload`;
      this.makeFetchCall(Path1, "POST", fd);
      this.setState({
        resizedImageUri: res.uri,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }


  chooseDocumentFromLibrary() {
    //const { dispatch, userDetails } = this.props;
    //const { customerId, email } = userDetails;
    this.setState({ showGalleryOptions: false });
    setTimeout(() => {
      DocumentPicker.show(
        {
          filetype: [DocumentPickerUtil.pdf()]
        },
        (error, res) => {
          if (res && res.uri && res.fileName) {
            if (res.type === "application/pdf" || res.fileName.split('.')[res.fileName.split('.').length - 1] === 'pdf') {
              const response = {
                uri: res.uri,
                type: res.type,
                name: res.fileName,
              };
              const fd = new FormData(); // eslint-disable-line no-undef
              fd.append("customer_id", ProductDataManager.getInstance().getUser().customer_id);
              fd.append("customer_email", ProductDataManager.getInstance().getUser().email);
              fd.append("prescription_file", response);
              this.makeFetchCall(Path, "POST", fd);
            } else {
              dispatch(
                alert({
                  header: "Error",
                  title: 'Invalid file type',
                  message:
                    "Only PDF documents are accepted. Try uploading any other file."
                })
              )
            }
          }
        }
      );
    }, 100);
  }

  showAlertPopup(title, line1, line2, btnText) {
    this.setState({
      alertTitle: title,
      alertLine1: line1,
      alertLine2: line2,
      alertBtnText: btnText,
      showAlert: true
    });
  }

  renderFileData() {
    if (this.state.fileData) {
      return <Image source={{ uri: 'data:image/jpeg;base64,' + this.state.fileData }}
        style={styles.images}
      />
    } else {
      return <Image source={camImg}
        style={styles.images}
      />
    }
  }

  renderFileUri() {
    if (this.state.fileUri) {
      return <Image
        source={{ uri: this.state.fileUri }}
        style={styles.images}
      />
    } else {
      return <Image
        source={galleryImg}
        style={styles.images}
      />
    }
  }

  addPrescription(prescriptionObj) {
    this.setState({
      selectedPresArray: [...this.state.selectedPresArray, prescriptionObj]
    });
    console.log(`selectedPresArray length:${this.state.selectedPresArray.length}`);
  }

  makeFetchCall(path, method, body) {
    //console.log(`path = ${path}, method = ${method}, body = ${body}`)
    UploadImage(path, body)
      .then((reponse) => {
        //----add object to prescription object--

        if (reponse.file_id && reponse.name && reponse.url) {
          const prescriptionObj = {
            id: reponse.file_id,
            name: reponse.name,
            url: reponse.url,
            type: reponse.type,
            date: reponse.created_at
          };
          console.log(`prescriptionObj ${JSON.stringify(prescriptionObj)}`);
          PrescriptionDataManager.getInstance().addPrescription(prescriptionObj);
          this.setState({});
          //--this.addPrescription(prescriptionObj);
        }
        //-----------end-------------------------
        console.log(`response img: ${JSON.stringify(reponse)}`);
      });
  }


  //----------------end--
  validPrescriptionView() {
    return (
      <View>
        <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
            <Image source={validPresImg} style={[{ marginLeft: 5, marginRight: 10 }, styles.imgIcons1]} />
            <Text style={AppStyle.smallHeading}>Valid Prescription Guide</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Image source={presPreview} style={{ margin: 20 }} />
          </View>
          <View style={{ marginHorizontal: 20, heigh: 300 }}>
            <HTML html={htmlContent} imagesMaxWidth={Dimensions.get('window').width} />
          </View>
        </View>
      </View>
    );
  }

  removePrescriptionIndex(index) {
    console.log(`remove from index ${index}`);
    var array = [...this.state.selectedPresArray];
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ selectedPresArray: array });
    }
  }

  prescriptionView() {
    if (PrescriptionDataManager.getInstance().selectedPescriptionArray.length > 0) {
      return (
        <View>
          <View style={{ backgroundColor: '#fff', marginTop: 10, }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
              <Image source={attachImg} style={[{ marginLeft: 5, marginRight: 10 }, styles.imgIcons1]} />
              <Text style={AppStyle.smallHeading}>Attached Prescriptions</Text>
            </View>
            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                //--data={this.state.selectedPresArray}
                data={PrescriptionDataManager.getInstance().selectedPescriptionArray}
                horizontal={true}
                renderItem={({ item, index }) => {
                  console.log(`image url ${JSON.stringify(item.url.split('.').pop())}`)
                  return <View style={{ marginBottom: 10 }}>
                    <Image source={{ uri: item.url.split('.').pop() !== 'pdf' ? item.url : 'http://13.127.86.151/ola-web/pub/media/prescription/resized/placeholder.png' }} style={{ margin: 5, width: 100, height: 100, marginLeft: 10 }} />
                    <TouchableOpacity
                      style={{ position: 'absolute', alignSelf: 'flex-end' }}
                      onPress={() => {
                        //--this.removePrescriptionIndex(index);
                        PrescriptionDataManager.getInstance().removePrescriptionByIndex(index);
                        this.setState({});
                        // this.setState({selectedPresArray: });
                      }}
                    >
                      <Image source={cancelIcon} />
                    </TouchableOpacity>
                  </View>
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </View>
      );
    } else {
      return <View />
    }

  }
  uploadOptionView() {
    return (
      <View>
        <View style={{ backgroundColor: '#fff', marginTop: 10 }}>
          <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15, marginBottom: 5 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Image source={uploadImg} style={[{ marginLeft: 5, marginRight: 10 }, styles.imgIcons1]} />
                <Text style={AppStyle.smallHeading}>Choose an option to upload</Text>
              </View>
              <View style={AppStyle.rowStyle}>
                <View style={styles.btnBox}>
                  <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={() => {
                    console.log(`camera clicked`);
                    if (Platform.OS === 'android') {
                      CameraPermission().then((res) => {
                        console.log(`res is ${res}`);
                        if (res === 'granted') {
                          ReadExternalStorage().then((res) => {
                            if (res === 'granted') {
                              this.launchCamera();
                            }
                          });
                        }
                      });
                    } else {
                      this.launchCamera();
                    }
                  }}>
                    <View style={styles.box}>
                      <Image source={camImg} style={styles.imgIcons} />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.textStyle1}>Camera</Text>
                </View>
                <View style={styles.btnBox}>
                  <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={() => {
                    console.log(`gallery clicked`);
                    this.setState({ showGalleryOptions: true });
                  }}>
                    <View style={styles.box}>
                      <Image source={galleryImg} style={styles.imgIcons} />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.textStyle1}>Gallery</Text>
                </View>
                <View style={styles.btnBox}>
                  <TouchableOpacity style={{ alignSelf: 'stretch' }} onPress={() => {
                    console.log(`My Prescriptions clicked`);
                    //this.props.navigation.navigate('MyPrescriptions', { margePresArray: this.margePresArray.bind(this), prevSelectedPresArray: this.state.selectedPresArray });
                    this.props.navigation.navigate('MyPrescriptions');
                  }}>
                    <View style={styles.box}>
                      <Image source={presImg} style={styles.imgIcons} />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.textStyle1}>My Prescriptions</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  closeModal() {
    console.log(`try to close here`);
    this.setState({ showGalleryOptions: false });
  }
  closeAlert() {
    console.log(`try to close here`);
    this.setState({ showAlert: false });
  }
  gotoNext() {
    const { navigation } = this.props;
    if (PrescriptionDataManager.getInstance().selectedPescriptionArray.length > 0) {
      navigation.navigate('SpecifyMedicine', { selectedPresArray: this.state.selectedPresArray, removeAllPrescriptions: this.removeAllPrescriptions.bind(this), margePresArray: this.margePresArray.bind(this) });
    } else {
      this.showAlertPopup('Alert', 'Prescription', 'Please add atleast one prescription', 'Ok');
    }
    console.log(`clicked upload btn`);
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={AppStyle.pageContainer}>
        <Header navigation={navigation} title={this.state.pageTitle} />
        <ScrollView>
          <this.uploadOptionView />
          <this.prescriptionView />
          <this.validPrescriptionView />
        </ScrollView>
        <ButtonRect text='Upload' onPress={() => this.gotoNext()} />
        <OptionsPopup isVisible={this.state.showGalleryOptions}
          closeModal={() => this.closeModal()}
          image1={galleryImg}
          image2={presImg}
          text1='Image'
          text2='PDF'
          title='Choose File Type'
          onPress1={() => {
            console.log(`clicked on press1`);
            this.setState({ showGalleryOptions: false });
            setTimeout(() => { this.launchImageLibrary() }, 50);
            //this.launchImageLibrary();
          }}
          onPress2={() => {
            console.log(`clicked on press2`);
            //this.chooseDocumentFromLibrary();
            this.setState({ showGalleryOptions: false });
            setTimeout(() => {
              this.getDocumentFromLibrary().then(() => { });
            }, 50);
          }}
        />
        <AlertPopup isVisible={this.state.showAlert}
          closeModal={() => this.closeAlert()}
          text1={this.state.alertLine1}
          text2={this.state.alertLine2}
          title={this.state.alerttitle}
          btnText={this.state.alertBtnText}
          title={this.state.alertTitle}
          onPress={() => {
            this.setState({ showAlert: false });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  box: {
    height: 90,
    marginBottom: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  imgIcons: {
    height: 45,
    width: 45,
    resizeMode: 'contain'
  },
  imgIcons1: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  },
  textStyle1: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: AppColors.appGrayDark1,
    fontWeight: '400'
  },

});



export default UploadPrescription;
