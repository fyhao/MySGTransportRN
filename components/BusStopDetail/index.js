import React, { PureComponent } from 'react';
//import UI from react-native
import { View, ScrollView, Text, Image, FlatList,TouchableOpacity } from 'react-native';
//import styles for component.
import styles from './styles';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
class BusStopDetail extends PureComponent {
	state = {
		services : [],
		stops : null,
		nearbyBusStopList : null,
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
			const serviceLastStopData = require('../../assets/data/service_last_stop_data.json');
			var busStopCode = navigation.getParam('item').BusStopCode;
			var nearbyBusStopList = navigation.getParam('nearbyBusStopList');
			
			var services = data[busStopCode];
			services = this.cloneObj(services);
			if(typeof services == 'undefined') services = [];
			services.sort(function(a,b) {
				var a1 = a.ServiceNo;
				var b1 = b.ServiceNo;
				a1 = parseInt(a1);
				b1 = parseInt(b1);
				return a1 - b1;
			});
			// Fill service last stop data into services
			for(var i = 0; i < services.length; i++) {
				services[i].lastStop = serviceLastStopData[services[i].ServiceNo];
			}
			var loading = false;

			this.setState({services, loading});
			
			await this.calculateNearbyBusStops(nearbyBusStopList);
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
	async calculateNearbyBusStops(n) {
		var nearbyBusStopList = [];
		n.map(r => {
			var rr = {};
			for(var k in r) {
				rr[k] = r[k];
			}
			nearbyBusStopList.push(rr)
		});
		for(var i = 0; i < nearbyBusStopList.length; i++) {
			var n = nearbyBusStopList[i];
			n.latitude = n.Latitude;
			n.longitude = n.Longitude;
			n.latitudeDelta = 0.0922;
			n.longitudeDelta = 0.0421;
		}
		this.state.nearbyBusStopList = nearbyBusStopList;
	};
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
		  latitude: navigation.getParam('item').Latitude,
		  longitude: navigation.getParam('item').Longitude,
		  latitudeDelta: 0.0922 / 10,
		  longitudeDelta: 0.0421 / 10,
		};
		var itemHolder = {};
        return (
            <ScrollView style={{flex: 1}}>
				<View style={styles.BusStopHeader}>
					<View style={styles.BusStopHeaderRow1}>
						<Text style={styles.BusStopDescHeading}>{navigation.getParam('item').Description}</Text>
					</View>
					<View style={styles.BusStopHeaderRow2}>
						<Text style={styles.BusStopCodeHeading}>{navigation.getParam('item').BusStopCode}</Text>
						<Text style={styles.BusStopRoadNameHeading}>{navigation.getParam('item').RoadName}</Text>
						<Text style={styles.BusStopDistanceHeading}>{navigation.getParam('item').myDistanceInMetre}m</Text>
					</View>
				</View>
                
				
				<View style={{height: 400}}>
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
						{this.state.nearbyBusStopList != null ? this.state.nearbyBusStopList.map((r,i) => (
							<Marker coordinate={r} key={i}>
							<View style={{padding: 1}}>
							   <Image source={require('../../assets/images/busStopIcon.png')} style={{width: 30, height: 30}} />
							 </View>
							 <Callout><Text>{r.Description}</Text></Callout>
						</Marker>
						)) : (null)}
					</MapView>
				  </View>
				  
				  {this.state.loading ? <Text>Loading...</Text> : <FlatList 
                    data={this.state.services}
                    renderItem={(data) => 
					<TouchableOpacity style={{backgroundColor: 'transparent'}} onPress={() => navigation.navigate('ViewBusServiceDetail',{item:data.item,busStop:navigation.getParam('item'),isNearBy:isNearBy})}>
					<View style={styles.ServiceNoBox}>
						<View style={styles.ServiceNoLeftBox}/>
						<View style={styles.SerivceNoRightBox}>
							<Text style={styles.ServiceNoText}>{data.item.ServiceNo}</Text>
							<Text style={styles.ServiceLastStop}>To {data.item.lastStop}</Text>
						</View>
					</View>
					</TouchableOpacity>}
                    keyExtractor={(item) => item.ServiceNo} 
				  />}
            </ScrollView>
        );
    }
}

export default BusStopDetail;