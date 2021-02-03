import { StyleSheet, Dimensions } from 'react-native';
import AppColors from '../values/AppColors';

const AppStyle = StyleSheet.create({
  formContainer: {
    marginRight: 25,
    marginLeft: 25,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: AppColors.pageDarkBackground
  },
  errorStyle: {
    fontSize: 12,
    marginTop: 5,
    color: AppColors.errorRed
  },
  imgContainer: {
    height: Dimensions.get('window').height / 3,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginTop: 80
  },
  imgContainer1: {
    height: Dimensions.get('window').height / 3.5,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginTop: 40
  },
  imgStyle: {
    height: '100%', width: '100%', resizeMode: 'contain', backgroundColor: 'white'
  },
  formTextLable: {

  },
  scrollStyle: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  skipText: {
    color: '#0d447a',
    margin: 10,
    marginRight: 5,
    fontFamily: "Roboto",
    fontWeight: '600'
  },
  signupText: {
    fontFamily: 'Roboto',
    color: AppColors.appBlue,
    fontWeight: '600'
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowSBStyle: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  inputSpacing: {
    marginBottom: 14,
  },
  inputLable: {
    fontSize: 13,
    color: AppColors.appGray,
    fontFamily: 'Roboto'
  },
  inputSpacingH: {
    marginRight: 10
  },
  bodyText: {
    fontFamily: 'Roboto',
    color: AppColors.appGray,
  },
  textSmall: {
    fontFamily: 'Roboto',
    color: AppColors.appGray,
    fontSize: 12
  },
  textSmallBold: {
    fontFamily: 'Roboto',
    color: AppColors.appGrayDark1,
    fontWeight: '500',
    fontSize:13
  },
  bodySmall: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: AppColors.appGray,
  },
  bodySmallBlue: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: AppColors.appBlue,
  },
  productTitleSmall: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: AppColors.appGrayDark,
  },
  textSmallBlue: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: AppColors.appBlue,
  },
  textSmallGray: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: AppColors.appGray,
  },
  textBigBlue: {
    fontFamily: 'Roboto',
    fontSize: 22,
    color: AppColors.appBlue,
  },
  tinyGrayText: {
    fontFamily: 'Roboto',
    fontSize: 9,
    color: AppColors.appGray,
  },
 
  tinyGrayDark: {
    fontFamily: 'Roboto',
    fontSize: 9,
    fontWeight: 'bold',
    color: AppColors.appGrayDark,
  },
  pageTitle: {
    fontFamily: 'Roboto',
    fontSize: 18,
    color: '#fff',
  },
  smallHeading: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: AppColors.appGrayDark1,
    fontWeight: '400'
  },
  sectionContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 15,
  },
  lineFullWidth: {
    height: 1,
    flex: 1,
    backgroundColor: AppColors.appGrayLight
  },
  containerStyle: {
    height: 80
  }
});

export default AppStyle;