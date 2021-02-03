export default class PrescriptionDataManager {
    static myInstance = null;

    selectedProductArray = [];

    selectedPescriptionArray = [];

    orderState = '';
    prescriptionValidity = 0;
    callTime = 'here will be the call time';
    addressId = '';


    //---medication--
    medicineValidity = '';
    static getInstance() {
        if (PrescriptionDataManager.myInstance == null) {
            PrescriptionDataManager.myInstance = new PrescriptionDataManager();
        }
        return this.myInstance;
    }
    //---------function for prescrition------
    setPrescriptionArray(newArray) {
        this.selectedPescriptionArray = newArray;
    }

    addPrescription(prescriptionObj) {
        this.selectedPescriptionArray = [...this.selectedPescriptionArray, prescriptionObj];
    }

    removePrescriptionById(id) {
        var index = this.selectedPescriptionArray.findIndex(
            function (item, i) {
                return item.id === id;
            }
        );
        //console.log(`remove from index ${index}`);
        var array = [...this.selectedPescriptionArray];
        if (index !== -1) {
            array.splice(index, 1);
            this.selectedPescriptionArray = array;
        }
    }

    removePrescriptionByIndex(index) {
        console.log(`remove from index ${index}`);
        var array = [...this.selectedPescriptionArray];
        if (index !== -1) {
            array.splice(index, 1);
            this.selectedPescriptionArray = array;
        }
    }

    //---------functions for product-------
    getProductArray() {
        return this.selectedProductArray;
    }

    setProductArray(newArray) {
        this.selectedProductArray = newArray;
    }

    appendProductArray(newArray) {
        this.selectedProductArray = [...this.selectedProductArray, ...newArray];
    }
    addToProductArray(arrayItem) {
        var index = this.selectedProductArray.findIndex(
            function (item, i) {
                return item.add_to_cart.productId === arrayItem.add_to_cart.productId;
            }
        );
        if (index === -1) {
            this.selectedProductArray = [...this.selectedProductArray, arrayItem];
        } else {
            console.warn(`product allready added`);
        }

    }

    removeProductFromArray(id) {
        var index = this.selectedProductArray.findIndex(
            function (item, i) {
                return item.add_to_cart.productId === id;
            }
        );
        console.log(`remove from index ${index}`);

        var array = this.selectedProductArray;
        if (index !== -1) {
            array.splice(index, 1);
            this.selectedProductArray = array;
        }
    }

    resetPrescriptionOrderData() {
        this.selectedProductArray = [];

        this.selectedPescriptionArray = [];
    }
}