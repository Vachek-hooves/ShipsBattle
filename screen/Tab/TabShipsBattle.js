import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'


const TabShipsBattle = ({navigation}) => {
  return (
    <View>
      <Text>TabShipsBattle</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('StackShipsBattle')}>
        <Text>Start Battle</Text>
      </TouchableOpacity>
    </View>
  )
}

export default TabShipsBattle

const styles = StyleSheet.create({})