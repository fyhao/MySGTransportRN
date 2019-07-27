import React, { PureComponent } from 'react';
//import UI from react-native
import { View, ScrollView, Text, Image, FlatList } from 'react-native';
//import styles for component.
import styles from './styles';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
class BusStopDetail extends PureComponent {
    //Define your navigationOptions as a functino to have access to navigation properties, since it is static.
    static navigationOptions = ({navigation}) => ({
        //Use getParam function to get a value, also set a default value if it undefined.
        title: `${navigation.getParam('item').BusStopCode} Info`
    })
    //Define your class component
    render() {
		const { navigation } = this.props;
		const data = require('../../assets/data/stopServiceData.json');
		var busStopCode = navigation.getParam('item').BusStopCode;
		var services = data[busStopCode];
        var region={
		  latitude: navigation.getParam('item').Latitude,
		  longitude: navigation.getParam('item').Longitude,
		  latitudeDelta: 0.0922,
		  longitudeDelta: 0.0421,
		};
        return (
            <ScrollView style={{flex: 1}}>
                <Image source={{uri: 'https://res.cloudinary.com/aa1997/image/upload/v1535930682/pokeball-image.jpg'}}
                        style={styles.pokemonImage} />
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
				  
				 <FlatList 
                    data={services}
                    renderItem={(data) => <View>
						<Text>Service No: {data.item.ServiceNo}</Text>
						<Text>Category: {data.item.Category}</Text>
						<Text>Operator: {data.item.Operator}</Text>
					</View>}
                    keyExtractor={(item) => item.ServiceNo} 
                    />
            </ScrollView>
        );
    }
}

export default BusStopDetail;