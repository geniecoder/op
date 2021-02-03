import strings from '../values/LangStrings';
export const emailValidator = (value) => {
    const reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (reg.test(value) && value != '') {
        return '';
    }
    return strings.errorEmail;
}
export const mobileValidator = (value) => {
    const reg = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (reg.test(value)) {
        return '';
    }
    return strings.errorMobile;
}
export const userIdValidator = (value) => {
    if (value == '') {
        return strings.emptyFieldUser;
    }
    if (emailValidator(value) == '') {
        return '';
    }
    if (mobileValidator(value) == '') {
        return '';
    }
    return strings.errorUserId;
}
export const firstNameValidator = (value) => {
    const reg = /^[a-zA-Z]+$/;
    if (reg.test(value)) {
        return '';
    }
    return strings.errorFirstName;
}
export const lastNameValidator = (value) => {
    const reg = /^[a-zA-Z]+$/;
    if (reg.test(value)) {
        return '';
    }
    return strings.errorLastName;
}
export const addressValidator = (value) => {
    const reg = /^[a-zA-Z]+$/;
    if (value !== '') {
        return '';
    }
    return strings.errorAddress;
}
export const cityValidator = (value) => {
    const reg = /^[a-zA-Z]+$/;
    if (value !== '') {
        return '';
    }
    return strings.errorCity;
}
export const pinCodeValidator = (value) => {
    const reg = /^[a-zA-Z]+$/;
    if (value !== '') {
        return '';
    }
    return strings.errorPinCode;
}
export const stateValidator = (value) => {
    const reg = /^[a-zA-Z]+$/;
    if (value !== '') {
        return '';
    }
    return strings.errorState;
}