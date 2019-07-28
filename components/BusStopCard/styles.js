//import styleSheet for creating a css abstraction.
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	Container: {
		backgroundColor: 'transparent',
		flexDirection:'row',
		padding:5,
	},
    listItemContainer: {
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderColor: '#fff',
        borderBottomWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
		
    },
	listItemContainer2: {
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderColor: '#fff',
        borderBottomWidth: 2,
        flexDirection: 'row',
    },
	LeftBox : {
		backgroundColor:'green',
		width:10,
		height:60
	},
	RightBox : {
		flex:1,flexDirection:'column'
	},
	serviceNo : {
		paddingLeft:5,
		color:'green'
	},
    itemHeader: {  
        color: '#000',
        fontSize: 20,
		padding:10,
    },
	distanceText: {  
        color: '#ff0000',
        fontSize: 12,
		padding:10,
    },
})

export default styles;