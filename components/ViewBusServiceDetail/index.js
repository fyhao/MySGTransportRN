import React, { PureComponent } from 'react';
//import UI from react-native
import { View, ScrollView, Text, Image, FlatList } from 'react-native';
//import styles for component.
import styles from './styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
class ViewBusServiceDetail extends PureComponent {
	state = {
		busService : null,
		busStop : null,
		busLocation : null,
		busRegion : null,
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
            //console.log(navigation.getParam('item'))
		    //console.log(navigation.getParam('busStop'))
		    var busService = navigation.getParam('item');
			var busStop = navigation.getParam('busStop');
			await this.fetchBusLocation();
			var busLocation = this.state.busLocation;
			var busRegion = {
				latitude : busLocation.Latitude,
				longitude: busLocation.Longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			};
			console.log(busRegion)
			var loading = false;
			this.setState({busService, busStop, busRegion, loading});
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
	async fetchBusLocation() {
		const { navigation } = this.props;
		var busLocation = {};
		// mock data
		// TODO to get real bus location data
		busLocation = {
			Latitude : navigation.getParam('busStop').Latitude + 0.0001,
			Longitude : navigation.getParam('busStop').Longitude + 0.0005
		};
		this.setState({busLocation})
	}
    //Define your class component
    render() {
		const { navigation } = this.props;
		var region={
		  latitude: navigation.getParam('busStop').Latitude,
		  longitude: navigation.getParam('busStop').Longitude,
		  latitudeDelta: 0.0922,
		  longitudeDelta: 0.0421,
		};
        return (
            <ScrollView style={{flex: 1}}>
                <Text>{navigation.getParam('item').ServiceNo}</Text>
				<View style={{height: 400}}>
					{this.state.loading ? <Text>Loading</Text> : <MapView 
						initialRegion={region}
						showsUserLocation={true}
						followsUserLocation={true}
						showsTraffic={true}
						style={{flex: 1}}
						>
						<Marker coordinate={region}>
							<View style={{backgroundColor: "red", padding: 10}}>
							   <Image source={require('../../assets/images/busStop.png')} />
							 </View>
						</Marker>
						{this.state.busRegion != null ? <Marker coordinate={this.state.busRegion}/> : ''}
					</MapView>}
				  </View>
            </ScrollView>
        );
    }
}

export default ViewBusServiceDetail;