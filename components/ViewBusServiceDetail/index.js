import React, { PureComponent } from 'react';
//import UI from react-native
import { View, ScrollView, Text, Image, FlatList,ProgressViewIOS } from 'react-native';
//import styles for component.
import styles from './styles';
import MapView, { Marker, Polyline, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
class ViewBusServiceDetail extends PureComponent {
	state = {
		busService : null,
		busStop : null,
		busRegion : null,
		routes : null, // entire routes
		stops : null, // entire stops
		busRoutes : null, // only this bus routes
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
			
			var loading = false;
			this.setState({busService, busStop, loading});
			
			await this.fetchBusLocation();
			await this.calculateBusRoutes();
			
			/*
			setInterval(() => {
				this.fetchBusLocation();
			}, 1000);
			*/
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
	async fetchBusLocation() {
		const { navigation } = this.props;
		var busLocation = {};
		// mock data
		// TODO to get real bus location data
		/*
		var rands = [1,2,3,4,5]
		busLocation = {
			Latitude : navigation.getParam('busStop').Latitude + 0.0001 * rands[Math.floor(Math.random()*rands.length)] ,
			Longitude : navigation.getParam('busStop').Longitude + 0.0005 * rands[Math.floor(Math.random()*rands.length)]
		};
		*/
		var busService = navigation.getParam('item');
		busLocation = {
			Latitude : parseFloat(busService.NextBusLocation.latitude),
			Longitude: parseFloat(busService.NextBusLocation.longitude)
		};
		var busRegion = {
			latitude : busLocation.Latitude,
			longitude: busLocation.Longitude,
			latitudeDelta: 9.0922,
			longitudeDelta: 9.0421,
		};
		this.setState({busRegion})
	}
	async calculateBusRoutes() {
		var routes = null;
		if(this.state.routes == null) {
			routes = require('../../assets/data/routes.json');
			this.setState({routes})
		}
		else {
			routes = this.state.routes;
		}
		routes = this.cloneObj(routes);
		var stops = null;
		if(this.state.stops == null) {
			stops = require('../../assets/data/stops.json');
			this.setState({stops})
		}
		else {
			stops = this.state.stops;
		}
		stops = this.cloneObj(stops);
		var serviceNo = this.state.busService.ServiceNo;
		var busStopCode = this.state.busStop.BusStopCode;
		var busRoutes = [];
		for(var i = 0; i < routes.length; i++) {
			var r = routes[i];
			r.key = i;
			if(r.ServiceNo == serviceNo) {
				for(var j = 0; j < stops.length; j++) {
					var s = stops[j];
					if(s.BusStopCode == r.BusStopCode) {
						r.latitude = s.Latitude;
						r.longitude = s.Longitude;
						r.Description = s.Description;
						r.latitudeDelta = 9.0922;
						r.longitudeDelta = 9.0421;
					}
				}
				busRoutes.push(r);
			}
		}
		//console.log(busRoutes)
		// TODO, a problem raised now, the bus routes did not follow the actual road condition
		this.setState({busRoutes})
	}
	cloneObj(obj) {
		var copy;

		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;

		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}

		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = this.cloneObj(obj[i]);
			}
			return copy;
		}

		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneObj(obj[attr]);
			}
			return copy;
		}

		throw new Error("Unable to copy obj! Its type isn't supported.");
	};
    //Define your class component
    render() {
		const { navigation } = this.props;
		var isNearBy = navigation.getParam('isNearBy');
		var region={
		  latitude: navigation.getParam('busStop').Latitude,
		  longitude: navigation.getParam('busStop').Longitude,
		  latitudeDelta: 0.0922 / 10,
		  longitudeDelta: 0.0421 / 10,
		};
        return (
            <ScrollView style={{flex: 1}}>
				<View style={{height: 400}}>
					{this.state.loading ? <Text>Loading</Text> : <View style={{flex: 1}}>
						<MapView 
						initialRegion={region}
						showsUserLocation={true}
						followsUserLocation={isNearBy}
						showsTraffic={true}
						style={{flex: 1}}
						>
						<Marker coordinate={region}>
							<View style={{padding: 1}}>
							   <Image source={require('../../assets/images/busStopIcon.png')} style={{width: 30, height: 30}} />
							 </View>
						</Marker>
						{this.state.busRegion != null ? <Marker coordinate={this.state.busRegion}>
						<View style={{padding: 1}}>
							   <Image source={require('../../assets/images/busIcon.png')} style={{width: 30, height: 30}} />
							 </View>
						</Marker> : (null)}
						{this.state.busRoutes != null ? <Polyline
							coordinates={this.state.busRoutes}
							strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
							strokeColors={[
								'#7F0000',
								'#00000000', // no color, creates a "long" gradient between the previous and next coordinate
								'#B24112',
								'#E5845C',
								'#238C23',
								'#7F0000'
							]}
							strokeWidth={6}
						/> : (null)}
						{this.state.busRoutes != null ? this.state.busRoutes.map((r,i) => (
							<Marker coordinate={r} key={i}>
							<View style={{padding: 1}}>
							   <Image source={require('../../assets/images/otherBusStopIcon.png')} style={{width: 30, height: 30}} />
							 </View>
							 <Callout><Text>{r.Description}</Text></Callout>
						</Marker>
						)) : (null)}
						</MapView>
						
						<View style={styles.ServiceNoBox}>
							<View style={styles.ServiceNoLeftBox}/>
							<View style={styles.ServiceNoRightBox}>
								<Text style={styles.ServiceNoText}>{this.state.busService.ServiceNo}</Text>
								<Text style={styles.ServiceLastStop}>To {this.state.busService.lastStop}</Text>
							</View>
							<View style={styles.ServiceNoNextArrival}>
								<View style={styles.ArrivalBox}>
									<ProgressViewIOS style={styles.ArrivalProgress} trackTintColor='#ffcccc' progressTintColor='orange' progress={this.state.busServiceNextBusProgress} width={50}/>
									<Text style={styles.ArrivalText}>{this.state.busService.NextBusArrival}</Text>
								</View>
								<View style={styles.ArrivalBox}>
									<ProgressViewIOS style={styles.ArrivalProgress} trackTintColor='#ffcccc' progressTintColor='orange' progress={this.state.busService.NextBus2Progress} width={50}/>
									<Text style={styles.ArrivalText}>{this.state.busService.NextBus2Arrival}</Text>
								</View>
								<View style={styles.ArrivalBox}>
									<ProgressViewIOS style={styles.ArrivalProgress} trackTintColor='#ffcccc' progressTintColor='orange' progress={this.state.busService.NextBus3Progress} width={50}/>
									<Text style={styles.ArrivalText}>{this.state.busService.NextBus3Arrival}</Text>
								</View>
							</View>
						</View>
					</View>}
				  </View>
            </ScrollView>
        );
    }
}

export default ViewBusServiceDetail;