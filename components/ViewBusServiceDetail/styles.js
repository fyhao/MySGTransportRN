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
	ServiceNoBox : {
		padding:5,
		flex: 1, flexDirection: 'row'
	},
	ServiceNoLeftBox : {
		backgroundColor:'green',
		width:10,
		height:40
	},
	ServiceNoRightBox : {
		flex: 1, flexDirection: 'column',
		paddingLeft:10,
	},
    ServiceNoNextArrival : {
		flex:2,flexDirection: 'row',
		paddingLeft:10,
	},
	ArrivalBox : {
		padding:10,
	},
	ArrivalText : {
		padding:10,
	},
	ArrivalProgress : {
		
	},
	ServiceNoText : {
		fontSize:20,
	},
	ServiceLastStop : {
		fontSize:10,
	}
})

export default styles;