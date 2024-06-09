import { Image, StyleSheet, Platform, TextInput } from 'react-native';
import { useEffect, useState } from "react";
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
export default function HomeScreen() {
  const [countries, setCountries] = useState([])
  const [Location, setLocation] = useState([])
  const [selectedCountry, setCountry] = useState("")
  const [selectedCity, setCity] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        // axios.get('http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=&appid=0443b7283ddace34bf9b8b7e6c346496')
        axios.get('https://countriesnow.space/api/v0.1/countries')
        .then(res => {
          const county = res.data;
          setCountries(county);

         console.log(county);
        })
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };
    
    fetchData();
  }, []);
  function getLat (country:String,city:String) {
    try {
       
      axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=&appid=0443b7283ddace34bf9b8b7e6c346496`)
      .then(res => {
        const county = res.data;
        setLocation(county);

       console.log(county);
      })
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/clouds.jpg')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <TextInput/>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
