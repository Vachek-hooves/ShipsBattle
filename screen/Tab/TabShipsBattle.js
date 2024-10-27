import { StyleSheet, Text, View ,TouchableOpacity,ImageBackground} from 'react-native'


const TabShipsBattle = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/image/bg/shipsBatlle.png')} style={styles.backgroundImage}>
      <Text>TabShipsBattle</Text>
      
      <TouchableOpacity onPress={()=>navigation.navigate('StackShipsBattle')} style={styles.button}>
          <Text style={styles.buttonText}>Start Battle</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default TabShipsBattle

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container:{
    flex:1,
    // justifyContent:'center',
    // alignItems:'center'
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