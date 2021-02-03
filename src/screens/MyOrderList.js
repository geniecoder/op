import React, { Component, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import CardMyOrder from '../component/card/CardMyOrder';
import { PostApiRequest, GetApiRequest } from '../util/ApiCall';
import { BASE_URL_API, MY_ORDERS, REORDER, RETRY_PAYMENT, CANCEL_ORDER } from '../config/api_config';
import ProductDataManager from '../util/ProductDataManager'

/*export default MyOrderList = (props) => {
    console.log(`routes: ${props.tabName}`);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data === null) {
            getData();
        }
    }, []);
    const getData = () => {
        const bodyObj = {
            data: {
                customer_id: '440',
                page_size: 30,
                page: 1,
                tab_name: 'complete'
            }
        }
        PostApiRequest(`${BASE_URL_API}${MY_ORDERS}`, bodyObj)
            .then(response => {
                if (response.status === '1') {
                    setData(response.data);
                    console.log(`responseData: ${JSON.stringify(data)} `);
                }
                //console.log(`MyOrders response ${JSON.stringify(response.data)}`);
                //this.setState({ isLoading: false, cList: response.data });
                //this.setState({ isLoading: false, data: response });
            }).catch(error => {
                console.log(`error ${error}`);
            })
    }
    return (
        <View>
            <CardMyOrder />
        </View>
    );
}*/

export default class MyOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: null,
        };
        this.contentView = this.contentView.bind(this);
        console.log(`routes: ${this.props.tabName}`);
    }

    componentDidMount() {
        if (this.props.tabName !== '') {
            this.getData(this.props.tabName);
        }

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.getData(this.props.tabName);
            }
        );
    }
    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }
    loadingView() {
        return <ActivityIndicator size="large" color="#000" />;
    }

    reorder(orderId) {
        console.log(`reorder: ${orderId}`);
        const bodyObj = {
            customerId: ProductDataManager.getInstance().getUser().customer_id,
            orderId: orderId
        }
        PostApiRequest(`${BASE_URL_API}${REORDER}`, bodyObj).then(response => {
            console.log(`response: ${JSON.stringify(response)}`)
            if (response.status === '1') {
                this.props.navigation.navigate('CartScreen');
            }
        }).catch(error => {
            console.log(`error ${error}`);
        })
    }

    retryPayment(orderId) {
        const bodyObj = {
            customerId: ProductDataManager.getInstance().getUser().customer_id,
            orderId: orderId
        }
        PostApiRequest(`${BASE_URL_API}${RETRY_PAYMENT}`, bodyObj).then(response => {
            console.log(`response: ${JSON.stringify(response)}`)
            if (response.status === '1') {
                this.props.navigation.navigate('CartScreen');
            }
        }).catch(error => {
            console.log(`error ${error}`);
        })
    }

    cancelOrder(orderId) {
        GetApiRequest(`${BASE_URL_API}${CANCEL_ORDER}/${orderId}`).then(response => {
            console.log(`response: ${JSON.stringify(response)}`);
            if (response.code === 'SUCCESS') {
                this.getData(this.props.tabName);
            }
        }).catch(error => {
            console.log(`error ${error}`)
        })
        console.log(`cancelorder: ${orderId}`);
    }



    contentView() {
        if (this.state.isLoading === true) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {this.loadingView()}
                </View>
            );
        }
        if (this.state.data !== null) {
            return <FlatList
                data={this.state.data}
                renderItem={({ item, index }) => {
                    return <CardMyOrder
                        item={item}
                        index={index}
                        navigation={this.props.navigation}
                        reorder={this.reorder.bind(this)}
                        cancelOrder={this.cancelOrder.bind(this)}
                        retryPayment={this.retryPayment.bind(this)} />;
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        } else {
            return (<Text>Retry</Text>);
        }
    }

    getData(tabName) {
        const bodyObj = {
            data: {
                customer_id: ProductDataManager.getInstance().getUser().customer_id,
                page_size: 30,
                page: 1,
                tab_name: tabName
            }
        }
        PostApiRequest(`${BASE_URL_API}${MY_ORDERS}`, bodyObj)
            .then(response => {
                if (response.status === '1') {
                    this.setState({ isLoading: false, data: response.data });
                    //console.log(`responseData: ${JSON.stringify(this.state.data)} `);
                }
            }).catch(error => {
                console.log(`error ${error}`);
            })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <this.contentView />
            </View>
        );
    }
}
