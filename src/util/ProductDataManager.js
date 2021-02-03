import { SaveCity, GetCity } from '../util/LocalStorage';
export default class ProductDataManager {
    static myInstance = null;

    quoteId = '';
    cartCount = 0;
    user = null;
    selectedAddress = {};
    city = null;

    static getInstance() {
        if (ProductDataManager.myInstance == null) {
            ProductDataManager.myInstance = new ProductDataManager();
        }
        return this.myInstance;
    }

    setEmptyCartData() {
        this.quoteId = '';
        this.cartCount = 0;
        this.selectedAddress = {};
    }

    setUser(userData) {
        this.user = userData;
        console.log(`userData is set`);
    }

    getUser() {
        return this.user;
    }

    getQuoteId() {
        return this.quoteId;
    }

    setQuoteId(newQuoteId) {
        this.quoteId = newQuoteId;
    }

    getCartCount() {
        return this.cartCount;
    }

    setCartCount(newCartCount) {
        this.cartCount = newCartCount;
    }

    getSelectedAddress() {
        return this.selectedAddress;
    }

    setSelectedAddress(newAddress) {
        this.selectedAddress = newAddress;
    }
    setCity(value) {
        this.city = value;
        SaveCity(value);

    }
    getCity() {
        if (this.city === null) {
            GetCity().then(cityData => {
                if (cityData !== null) {
                    this.city = cityData;
                } else {
                    this.city = { "id": "1", "city": "New Delhi" }
                }
            })
        }
        return this.city;
    }
}