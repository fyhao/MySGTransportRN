import React, { PureComponent } from 'react';
//import UI from react-native
import { View, ScrollView, Text, Image, FlatList,TouchableOpacity,ProgressViewIOS } from 'react-native';
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

			this.setState({services});
			
			await this.calculateNearbyBusStops(nearbyBusStopList);
			await this.queryNextBusArrival(busStopCode);
			
			this.setState({loading})
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
	async queryNextBusArrival(busStopCode) {
		var services = this.state.services;
		let response = await fetch(
		  'https://api.imgshow-apps.com/?api=1&k=q:name=bus,action=checkbusarrival,busStopCode=' + busStopCode,
		);
		let responseJson = await response.json();
		
		for(var i = 0; i < services.length; i++) {
			var svc = services[i];
			svc.NextBusProgress = 0;
			svc.NextBus2Progress = 0;
			svc.NextBus3Progress = 0;
			svc.NextBusArrival = 0;
			svc.NextBus2Arrival = 0;
			svc.NextBus3Arrival = 0;
			for(var j = 0; j < responseJson.length; j++) {
				var res = responseJson[j];
				if(res.ServiceNo == svc.ServiceNo) {
					//svc.NextBusArrival = res.NextBus.EstimatedArrival;
					//svc.NextBus2Arrival = res.NextBus2.EstimatedArrival;
					//svc.NextBus3Arrival = res.NextBus3.EstimatedArrival;
					svc.NextBusLocation = {latitude:res.NextBus.Latitude,longitude:res.NextBus.Longitude};
					svc.NextBus2Location = {latitude:res.NextBus2.Latitude,longitude:res.NextBus2.Longitude};
					svc.NextBus3Location = {latitude:res.NextBus3.Latitude,longitude:res.NextBus3.Longitude};
					var now = new Date();
					try {
						if(res.NextBus.EstimatedArrival != '') {
							var d1 = new Date(res.NextBus.EstimatedArrival);
							var min1 = Math.ceil((d1.getTime() - now.getTime()) / 1000 / 60);
							min1 = Math.abs(min1);
							svc.NextBusArrival = min1;
						}
						else {
							svc.NextBusArrival = '-';
						}
					} catch (e) {}
					try {
						if(res.NextBus2.EstimatedArrival != '') {
							var d2 = new Date(res.NextBus2.EstimatedArrival);
							var min2 = Math.ceil((d2.getTime() - now.getTime()) / 1000 / 60);
							min2 = Math.abs(min2);
							svc.NextBus2Arrival = min2;
						}
						else {
							svc.NextBus2Arrival = '-';
						}
					} catch (e) {}
					try {
						if(res.NextBus3.EstimatedArrival != '') {
							var d3 = new Date(res.NextBus3.EstimatedArrival);
							var min3 = Math.ceil((d3.getTime() - now.getTime()) / 1000 / 60);
							min3 = Math.abs(min3);
							svc.NextBus3Arrival = min3;
						}
						else {
							svc.NextBus3Arrival = '-';
						}
					} catch (e) {}
					break;
				}
			}
		}
		// calculate all progress bar overview
		var maxArrivalTime = -1;
		for(var i = 0; i < services.length; i++) {
			var svc = services[i];
			if(svc.NextBusArrival != '-' && svc.NextBusArrival > maxArrivalTime) {
				maxArrivalTime = svc.NextBusArrival;
			}
			if(svc.NextBus2Arrival != '-' && svc.NextBus2Arrival > maxArrivalTime) {
				maxArrivalTime = svc.NextBus2Arrival;
			}
			if(svc.NextBus3Arrival != '-' && svc.NextBus3Arrival > maxArrivalTime) {
				maxArrivalTime = svc.NextBus3Arrival;
			}
		}
		
		for(var i = 0; i < services.length; i++) {
			var svc = services[i];
			if(svc.NextBusArrival && svc.NextBusArrival != '-') {
				svc.NextBusProgress = svc.NextBusArrival / maxArrivalTime;
			}
			else {
				svc.NextBusProgress = 1;
			}
			if(svc.NextBus2Arrival && svc.NextBus2Arrival != '-') {
				svc.NextBus2Progress = svc.NextBus2Arrival / maxArrivalTime;
			}
			else {
				svc.NextBus2Progress = 1;
			}
			if(svc.NextBus3Arrival && svc.NextBus3Arrival != '-') {
				svc.NextBus3Progress = svc.NextBus3Arrival / maxArrivalTime;
			}
			else {
				svc.NextBus3Progress = 1;
			}
			if(svc.NextBusArrival == 0) svc.NextBusProgress = 0;
			if(svc.NextBus2Arrival == 0) svc.NextBus2Progress = 0;
			if(svc.NextBus3Arrival == 0) svc.NextBus3Progress = 0;
		}
		this.setState({services})
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
						<View style={styles.ServiceNoRightBox}>
							<Text style={styles.ServiceNoText}>{data.item.ServiceNo}</Text>
							<Text style={styles.ServiceLastStop}>To {data.item.lastStop}</Text>
						</View>
						<View style={styles.ServiceNoNextArrival}>
							<View style={styles.ArrivalBox}>
								<ProgressViewIOS style={styles.ArrivalProgress} trackTintColor='#ffcccc' progressTintColor='orange' progress={data.item.NextBusProgress} width={50}/>
								<Text style={styles.ArrivalText}>{data.item.NextBusArrival}</Text>
							</View>
							<View style={styles.ArrivalBox}>
								<ProgressViewIOS style={styles.ArrivalProgress} trackTintColor='#ffcccc' progressTintColor='orange' progress={data.item.NextBus2Progress} width={50}/>
								<Text style={styles.ArrivalText}>{data.item.NextBus2Arrival}</Text>
							</View>
							<View style={styles.ArrivalBox}>
								<ProgressViewIOS style={styles.ArrivalProgress} trackTintColor='#ffcccc' progressTintColor='orange' progress={data.item.NextBus3Progress} width={50}/>
								<Text style={styles.ArrivalText}>{data.item.NextBus3Arrival}</Text>
							</View>
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