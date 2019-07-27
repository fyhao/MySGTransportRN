//import PoreCompoent for preventing unnecesary updates. 
import React, { PureComponent } from 'react';
//import components
import BusStopCard from '../BusStopCard';
//import your components from react-native 
import {  FlatList, ActivityIndicator, Text, View} from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import {
  Accelerometer,
  Barometer,
  Gyroscope,
  Magnetometer,
  MagnetometerUncalibrated,
  Pedometer,
  DeviceMotion
} from 'expo-sensors';

export default class BusStopList extends PureComponent {
	//Define your state for your component. 
    state = {
        //Assing a array to your pokeList state
        busStopList: [],
		busStopLastUpdated : null,
        //Have a loading state where when data retrieve returns data. 
        loading: true,
		location : null,
		errorMessage : null,
		accelerometerData: {},
		mData : {}
    }
    //Define your navigation options in a form of a method so you have access to navigation props.
    static navigationOptions = {
        title: 'Nearby Bus Stops'
    }
	
    //Define your componentDidMount lifecycle hook that will retrieve data.
    //Also have the async keyword to indicate that it is asynchronous. 
    async componentDidMount() {
        //Have a try and catch block for catching errors.
        try {
            //Assign the promise unresolved first then get the data using the json method. 
            //const pokemonApiCall = await fetch('https://pokeapi.co/api/v2/pokemon/');
            //const pokemon = await pokemonApiCall.json();
			//var data = [{"Latitude": 1.29684825487647, "BusStopCode": "01012", "Description": "Hotel Grand Pacific", "Longitude": 103.85253591654006, "RoadName": "Victoria St"}, {"Latitude": 1.29770970610083, "BusStopCode": "01013", "Description": "St. Joseph's Ch", "Longitude": 103.8532247463225, "RoadName": "Victoria St"}];
			const data = require('../../assets/data/stops.json');
            this.setState({busStopList: data});
			this._getLocationAsync();
			if(false && DeviceMotion.isAvailableAsync()) {
				DeviceMotion.setUpdateInterval(3000); // fast = 16, slow = 1000
				this._subscription = DeviceMotion.addListener(accelerometerData => {
				  this.setState({ accelerometerData });
				  this.calculateIfUserMovingThenUpdateLocation();
				});
			}
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
	 _getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
		  this.setState({
			errorMessage: 'Permission to access location was denied',
		  });
		}
		this.setState({loading:true});
		let location = await Location.getCurrentPositionAsync({});	
		this.filterNearbyBusStopByLocation(location);
	  };
	filterNearbyBusStopByLocation = async (location) => {
		this.setState({ location });
		this.filterNearbyBusStop();
		this.setState({loading:false});
	};
	distance = (pos1,pos2) => {
		var lat1 = pos1.Latitude;
		var lon1 = pos1.Longitude;
		var lat2 = pos2.Latitude;
		var lon2 = pos2.Longitude;
		var R = 6371; // km (change this constant to get miles)
		var dLat = (lat2-lat1) * Math.PI / 180;
		var dLon = (lon2-lon1) * Math.PI / 180;
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c; // km
		return d;
	}
    filterNearbyBusStop = async () => {
		var busStopList = this.state.busStopList;
		var location = this.state.location;
		var myLocation = {Latitude:location.coords.latitude, Longitude:location.coords.longitude};
		var newList = [];
		var nearLimit = 0.2;
		//console.log('filtering within ' + nearLimit + ' metre data');
		for(var i = 0; i < busStopList.length; i++) {
			var stop = busStopList[i];
			var d = this.distance(stop, myLocation);
			if(d < nearLimit) {
				//console.log(JSON.stringify(stop) + "," + d);
				stop.myDistanceInMetre = Math.round(d * 1000);
				newList.push(stop);
			}
		}
		busStopList = null;
		this.setState({busStopList:newList,busStopLastUpdated:new Date().toString()});
	};
	
	
	calculateIfUserMovingThenUpdateLocation = async () => {
		var accelerometerData = this.state.accelerometerData;
		var {x,y,z} = accelerometerData.acceleration;
		//console.log(x + "," + y + "," + z);
		var mData = this.state.mData;
		if(x > 1 || y > 1 || z > 1) {
			if(!mData.lastCheckTime) mData.lastCheckTime = new Date().getTime();
			if(!mData.lastCheckCount) mData.lastCheckCount = 0;
			var now = new Date().getTime();
			if(now - mData.lastCheckTime < 5 * 1000) {
				mData.lastCheckCount++;
			}
			else {
				mData.lastCheckCount = 0;
			}
			if(mData.lastCheckCount > 10) {
				console.log('Found target count, executing');
				mData.lastCheckCount = 0;
				this._getLocationAsync();
			}
			mData.lastCheckTime = new Date().getTime();;
		}
		
		this.setState({mData});
	};
    render() {
        const { busStopList, loading } = this.state;
        //Destruct navigation from props 
        const { navigation } = this.props;
        //If laoding to false, return a FlatList which will have data, rednerItem, and keyExtractor props used.
        //Data contains the data being  mapped over.
        //RenderItem a callback return UI for each item.
        //keyExtractor used for giving a unique identifier for each item.
		
		let debugText = 'Waiting..';
		if (this.state.errorMessage) {
		  debugText = this.state.errorMessage;
		} else if (this.state.location) {
		  debugText = JSON.stringify(this.state.location);
		}
		debugText = 'Last Updated: ' + this.state.busStopLastUpdated;
		//debugText = JSON.stringify(this.state.accelerometerData);
        if(!loading) {
            return <View><FlatList 
                    data={busStopList}
                    renderItem={(data) => <BusStopCard item={data.item} navigation={navigation} />}
                    keyExtractor={(item) => item.BusStopCode} 
                    />
					<Text style={{textAlign:"center",fontSize:18}}>{debugText}</Text>
					</View>
        } else {
            return <ActivityIndicator />
        }
    }
}