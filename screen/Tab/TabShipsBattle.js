import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'


const TabShipsBattle = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>TabShipsBattle</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('StackShipsBattle')} style={styles.button}>
        <Text style={styles.buttonText}>Start Battle</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TabShipsBattle

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    backgroundColor:'#000',
    padding:10,
    borderRadius:10
  },
  buttonText:{
    color:'#fff',
    fontSize:16,
    fontWeight:'bold'
  }
})