import { StyleSheet, Text, View ,ImageBackground} from 'react-native'
import React from 'react'

const TabQuizScreen = () => {
  return (
    
      <ImageBackground source={require('../../assets/image/bg/map.png')} style={styles.image}>
       
      </ImageBackground>
    
  )
}

export default TabQuizScreen

const styles = StyleSheet.create({
    image:{
       flex:1,
       resizeMode:'cover',
    }
})