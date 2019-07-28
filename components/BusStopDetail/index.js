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
			var busStopCode = navigation.getParam('item').BusStopCode;
			var nearbyBusStopList = navigation.getParam('nearbyBusStopList');
			
			var services = data[busStopCode];
			services.sort(function(a,b) {
				var a1 = a.ServiceNo;
				var b1 = b.ServiceNo;
				a1 = parseInt(a1);
				b1 = parseInt(b1);
				return a1 - b1;
			});
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
					<TouchableOpacity style={{backgroundColor: 'transparent'}} onPress={() => navigation.navigate('ViewBusServiceDetail',{item:data.item,busStop:navigation.getParam('item')})}>
					<View style={styles.ServiceNoBox}>
						<View style={styles.ServiceNoLeftBox}/>
						<Text style={styles.ServiceNoText}>{data.item.ServiceNo}</Text>
					</View>
					</TouchableOpacity>}
                    keyExtractor={(item) => item.ServiceNo} 
				  />}
            </ScrollView>
        );
    }
}

export default BusStopDetail;