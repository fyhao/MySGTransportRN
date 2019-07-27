//import React form react
import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import styles from './styles';

//Define your stateless componetns, and destrcuts props from function arguments
const BusStopCard = ({item, navigation}) => {
	
    return (
        <TouchableOpacity style={{backgroundColor: 'transparent'}} onPress={() => navigation.navigate('BusStopDetail',{item:item})}>
            <View  style={styles.listItemContainer}>
                <Text style={styles.pokeItemHeader}>{item.BusStopCode}</Text>
                <Text style={styles.pokeItemHeader}>{item.Description}</Text>
            </View>
        </TouchableOpacity>
    )
}


export default BusStopCard;