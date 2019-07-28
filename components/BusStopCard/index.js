//import React form react
import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import styles from './styles';

//Define your stateless componetns, and destrcuts props from function arguments
const BusStopCard = ({item, nearbyBusStopList, navigation}) => {
	var serviceNoList = [];
	if(typeof item.services != 'undefined') {
		item.services.map((r,i) => {
			serviceNoList.push(r['ServiceNo']);
		});
	}
    return (
        <TouchableOpacity style={styles.Container} onPress={() => navigation.navigate('BusStopDetail',{item:item, nearbyBusStopList:nearbyBusStopList})}>
			<View style={styles.LeftBox}/>
			<View style={styles.RightBox}>
				<View  style={styles.listItemContainer}>
					<Text style={styles.itemHeader}>{item.BusStopCode}</Text>
					<Text style={styles.itemHeader}>{item.Description}</Text>
					<Text style={styles.distanceText}>{item.myDistanceInMetre}m</Text>
				</View>
				<View  style={styles.listItemContainer2}>
					{serviceNoList.map((r,i) => (
						<Text style={styles.serviceNo} key={i}>{r}</Text>
					))}
				</View>
			</View>
            
        </TouchableOpacity>
    )
}


export default BusStopCard;