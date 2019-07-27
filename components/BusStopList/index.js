//import PoreCompoent for preventing unnecesary updates. 
import React, { PureComponent } from 'react';
//import components
import BusStopCard from '../BusStopCard';
//import your components from react-native 
import {  FlatList, ActivityIndicator, Text} from 'react-native';


export default class BusStopList extends PureComponent {
	//Define your state for your component. 
    state = {
        //Assing a array to your pokeList state
        busStopList: [],
        //Have a loading state where when data retrieve returns data. 
        loading: true
    }
    //Define your navigation options in a form of a method so you have access to navigation props.
    static navigationOptions = {
        title: 'List of Bus Stops'
    }
    //Define your componentDidMount lifecycle hook that will retrieve data.
    //Also have the async keyword to indicate that it is asynchronous. 
    async componentDidMount() {
        //Have a try and catch block for catching errors.
        try {
            //Assign the promise unresolved first then get the data using the json method. 
            //const pokemonApiCall = await fetch('https://pokeapi.co/api/v2/pokemon/');
            //const pokemon = await pokemonApiCall.json();
			var data = [{"Latitude": 1.29684825487647, "BusStopCode": "01012", "Description": "Hotel Grand Pacific", "Longitude": 103.85253591654006, "RoadName": "Victoria St"}, {"Latitude": 1.29770970610083, "BusStopCode": "01013", "Description": "St. Joseph's Ch", "Longitude": 103.8532247463225, "RoadName": "Victoria St"}];
            this.setState({busStopList: data, loading: false});
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
    render() {
        const { busStopList, loading } = this.state;
        //Destruct navigation from props 
        const { navigation } = this.props;
        //If laoding to false, return a FlatList which will have data, rednerItem, and keyExtractor props used.
        //Data contains the data being  mapped over.
        //RenderItem a callback return UI for each item.
        //keyExtractor used for giving a unique identifier for each item.
        if(!loading) {
            return <FlatList 
                    data={busStopList}
                    renderItem={(data) => <BusStopCard item={data.item} navigation={navigation} />}
                    keyExtractor={(item) => item.BusStopCode} 
                    />
        } else {
            return <ActivityIndicator />
        }
    }
}