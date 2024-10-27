import { StyleSheet, Text, View ,ImageBackground} from 'react-native'
import React from 'react'

const TabHarborScreen = () => {
  return (
    <ImageBackground source={require('../../assets/image/bg/userBG.png')} style={styles.container}>

    </ImageBackground>
  )
}

export default TabHarborScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})