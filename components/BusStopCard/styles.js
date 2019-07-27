//import styleSheet for creating a css abstraction.
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    listItemContainer: {
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderColor: '#fff',
        borderBottomWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    itemHeader: {  
        color: '#000',
        fontSize: 24,
    },
	distanceText: {  
        color: '#ff0000',
        fontSize: 12,
    },
})

export default styles;