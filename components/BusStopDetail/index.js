import React, { PureComponent } from 'react';
//import UI from react-native
import { View, ScrollView, Text, Image, FlatList,TouchableOpacity } from 'react-native';
//import styles for component.
import styles from './styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
class BusStopDetail extends PureComponent {
	state = {
		services : [],
		loading : true
	}
    //Define your navigationOptions as a functino to have access to navigation properties, since it is static.
    static navigationOptions = ({navigation}) => ({
        //Use getParam function to get a value, also set a default value if it undefined.
        title: `${navigation.getParam('item').BusStopCode} Info`
    })
	async componentDidMount() {
        //Have a try and catch block for catching errors.
        try {
			const { navigation } = this.props;
            const data = require('../../assets/data/stopServiceData.json');
			var busStopCode = navigation.getParam('item').BusStopCode;
			var services = data[busStopCode];
			var loading = false;
			this.setState({services, loading});
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
    //Define your class component
    render() {
		const { navigation } = this.props;
		
		
        var region={
		  latitude: navigation.getParam('item').Latitude,
		  longitude: navigation.getParam('item').Longitude,
		  latitudeDelta: 0.0922,
		  longitudeDelta: 0.0421,
		};
		var itemHolder = {};
		
        return (
            <ScrollView style={{flex: 1}}>
                <Text>{navigation.getParam('item').Description}</Text>
				
				<View style={{height: 400}}>
					<MapView 
						initialRegion={region}
						showsUserLocation={true}
						followsUserLocation={true}
						showsTraffic={true}
						style={{flex: 1}}
						>
						<Marker coordinate={region}/>
					</MapView>
				  </View>
				  
				  {this.state.loading ? <Text>Loading...</Text> : <FlatList 
                    data={this.state.services}
                    renderItem={(data) => 
					<TouchableOpacity style={{backgroundColor: 'transparent'}} onPress={() => navigation.navigate('ViewBusServiceDetail',{item:data.item,busStop:navigation.getParam('item')})}>
					<View>
						<Text>Service No: {data.item.ServiceNo}</Text>
					</View>
					</TouchableOpacity>}
                    keyExtractor={(item) => item.ServiceNo} 
				  />}
            </ScrollView>
        );
    }
}

export default BusStopDetail;