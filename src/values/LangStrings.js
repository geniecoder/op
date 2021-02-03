import LocalizedStrings from 'react-native-localization';

const strings = new LocalizedStrings({
    en:{
        loginLable: 'Enter Mobile Number',
        errorUserId: 'Please provide valid mobile or email',
        errorEmail: 'Please enter a valid email ID (for eg. john@abc.com)',
        errorMobile: 'Please enter you 10-digit mobile number',
        errorFirstName: 'Please enter your first name',
        errorLastName: 'Please enter your last name',
        emptyFieldUser: 'Please enter you 10-digit mobile number',
        errorAddress: 'Invalid address',
        errorCity: 'Invalid city',
        errorState: 'Select State',
        errorPinCode: 'Invalid Postal Code',
        loginBtn: 'Next',
        skipLogin: 'Skip',
        inputHintLogin: '9876543210',
        signupAsk: "Don't have an account yet?",
        signupLink: 'Signup here',
        changeME: 'Change Mobile Number',
        resendOtp: 'Resend OTP',

        signingTC: 'By signing up, you agree to our',
        terms: 'Terms and Conditions',
        pp: 'Privacy Policy.'
    }
});
export default strings;