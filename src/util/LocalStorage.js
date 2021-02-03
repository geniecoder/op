//import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ProductDataMangaer from './ProductDataManager';

export const SetItem = (key, value) => {
    return AsyncStorage.setItem(key, value)
    .then((response) => {
        console.log(`setItem success: ${response}`);
        return 'success';
    })
    .catch ((error) => {
        console.error(error);
        return 'failed';
    });
    
}
export const GetItem = (key) => {
    return AsyncStorage.getItem(key)
    .then((response) => {
        return response;
    })
    .catch((error) => {
        console.error(error);
    });
}
export const RemoveItem = (key) => {
    AsyncStorage.removeItem(key);
    /*.then((response) => {
        console.log(`RemoveItem: ${response}`);
        return 'success';
    })
    .catch((error) => {
        console.error(error);
        return 'failed';
    });*/
}
export const SaveUser = (data) => {
    return SetItem('userData', JSON.stringify(data))
    .then((response) => {
        console.log(`SaveUser success and response: ${response}`);
        return response;
    })
    .catch((error) => {
        console.error(error);
    });
}
export const GetUser = () => {
    return GetItem('userData')
    .then((response) => JSON.parse(response))
    .then((userData) => {
        return userData;
    })
    .catch((error) => {
        console.error(error);
    });
}
export const Logout = () => {
    ProductDataMangaer.getInstance().setUser(null);
    RemoveItem('userData');
    /*return RemoveItem('userData')
    .then((response) => {
        return response;
    })
    .error((error) => {
        console.error(error);
    });*/
}
export const SaveCity = (data) => {
    return SetItem('city', JSON.stringify(data))
    .then((response) => {
        console.log(`SaveCity success and response: ${response}`);
        return response;
    })
    .catch((error) => {
        console.error(error);
    });
}
export const GetCity = () => {
    return GetItem('city')
    .then((response) => JSON.parse(response))
    .then((cityData) => {
        return cityData;
    })
    .catch((error) => {
        console.error(error);
    });
}