import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Header from '../component/Header';
import AppStyle from '../style/AppStyle';
import AppColors from '../values/AppColors';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CardMyOrder from '../component/card/CardMyOrder';
import MyOrderList from '../screens/MyOrderList';
import { PreviousRouteName } from '../util/Methods';
import SnackBar from 'react-native-snackbar-component';

const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673a00' }]} />
);

const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };


export default MyOrders = (props) => {
    const [index, setIndex] = React.useState(0);
    const [isSnackBarVisible, setVisible] = React.useState(false);
    const [routes] = React.useState([
        { key: 'first', title: 'All Order' },
        { key: 'second', title: 'Open' },
        { key: 'third', title: 'Completed' },
        { key: 'fourth', title: 'Cancelled' },
    ]);
    /*const renderScene = SceneMap({
        first: () => <MyOrderList tabName={'allOrders'} />,
        second: () => <MyOrderList tabName={'open'} />,
        third: () => <MyOrderList tabName={'completed'} />,
        fourth: () => <MyOrderList tabName={'cancelled'} />,
    });*/
   /* const cancelResponse = props.navigation.getParam('cancelResponse', null)
    if (cancelResponse !== null) {
        //console.log(`order canceled ${JSON.stringify(cancelResponse)}`);
        //setVisible(true)
        console.log(`show snak bar for cancel order`);
        setTimeout(() => {
            setVisible(true);
            setTimeout(() => {
                setVisible(false);
            }, 3000)
        }, 3000)
    }*/

    console.log(`PreviousRouteName ${PreviousRouteName(props.navigation)}`);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <MyOrderList tabName={'all'} navigation={props.navigation} />;
            case 'second':
                return <MyOrderList tabName={'open'} navigation={props.navigation} />;
            case 'third':
                return <MyOrderList tabName={'completed'} navigation={props.navigation} />;
            case 'fourth':
                return <MyOrderList tabName={'canceled'} navigation={props.navigation} />;
            default:
                return null;
        }
    };


    const renderTabBar = props => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white' }}
            style={{ backgroundColor: AppColors.appBlue }}
            scrollEnabled={true}
        />
    );
    return (
        <View style={AppStyle.pageContainer}>
            <Header navigation={props.navigation} title='My Orders' onPressEdit={() => {
                this.setState({ editMode: true });
            }} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={renderTabBar}
            />
            <SnackBar
                visible={isSnackBarVisible}
                textMessage="Successfully cancelled"
                actionHandler={() => {
                    console.log("snackbar button clicked!");
                    this.props.navigation.navigate('Home');
                }}
                actionText="Goto Home"
                containerStyle={
                    AppStyle.containerStyle
                } />
        </View>

    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});


