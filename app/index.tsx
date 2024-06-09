import { Image, RefreshControl, SafeAreaView, Text, View, ScrollView, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import axios from 'axios';
import { useCallback, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// import image1 from "../assets/images/clouds.jpg";
// import { ScrollView } from "react-native-gesture-handler";

export default function Index() {
  const [showCountry, setShowCountry] = useState(false)
  const [refreshing, setRefresh] = useState(false)
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [Location, setLocation] = useState("")
  const [selectedCountry, setCountry] = useState("ng")
  const [selectedCity, setCity] = useState("Ibadan")
  const [desc, setDesc] = useState("")
  const [temp, setTemp] = useState(0)
  const [feel, setFeel] = useState(0)
  const [wind, setWind] = useState(0)
  const [humidity, setHumidty] = useState(0)
  const [dew, setDew] = useState("")
  const [pressure, setPressure] = useState(0)
  const [ground, setGround] = useState(0)
  const [visibility, setVisibility] = useState(0)
  const [sea, setSea] = useState(0)
  const [sunset, setSun] = useState("")
  const [sunrise, setSunrise] = useState("")
  useEffect(() => {
    const fetchData = async () => {
      try {
        
       getLat(selectedCountry,selectedCity);
       
        // axios.get('http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=&appid=0443b7283ddace34bf9b8b7e6c346496')
        axios.get('https://countriesnow.space/api/v0.1/countries')
        .then(res => {
          const county = res.data;
          setCountries(county.data);

         console.log(county.data);
        })
      } catch (error) {
        console.error('Error fetching artworks:', error);
      }
    };
    
    fetchData();
  }, [selectedCity]);

  
  function calculateDewPoint(temperature:String, humidity:String) {
    // Constants for the approximation formula
    const a = 17.27;
    const b = 237.7;

    const alpha = ((a * parseFloat(temperature.toString())) / (b + parseFloat(temperature.toString()))) + Math.log(parseFloat(humidity.toString()) / 100.0);
    const dewPoint = (b * alpha) / (a - alpha);

    return dewPoint.toFixed(2); // Rounded to 2 decimal places
}
  async function getForecast(lat:String,lon:String) {

    try {
       
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0443b7283ddace34bf9b8b7e6c346496`)
      .then(res => {
        const county = res.data;
        setLocation(county);
        setFeel(parseFloat(county.main.feels_like) - 273.15);
        setDesc(county.weather[0].description);
        setTemp(parseFloat(county.main.temp)- 273.15)
        setWind(county.wind.speed);
        setHumidty(county.main.humidity);
        setPressure(county.main.pressure);
        setSea(county.main.sea_level);
        setGround(county.main.grnd_level);
        setVisibility(county.visibility);
        const dtt = new Date(county.sys.sunset);
        const dtr = new Date(county.sys.sunrise);
        setSun(dtt.getHours().toString() +":"+ dtt.getMinutes().toString())
        setSunrise(dtr.getHours().toString() +":"+ dtr.getMinutes().toString())
        setDew(calculateDewPoint(temp.toString(),humidity.toString()))

       console.log(county);
      })
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
    
  }
  async function getLat (country:String,city:String) {
    try {
       
      axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=&appid=0443b7283ddace34bf9b8b7e6c346496`)
      .then(res => {
        const county = res.data;
        setLocation(county);
        getForecast(res.data[0].lat,res.data[0].lon)

       console.log(county);
      })
    } catch (error) {
      console.error('Error fetching artworks:', error);
    }
  }
  const onRefresh = useCallback( () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false)
    }, 2000);
  }, []);
  return (
    <SafeAreaView style={styles.container}>

    <ScrollView
    // style = {styles.scrollview}
    showsHorizontalScrollIndicator={false}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
    }
      // style={{
      //   flex: 1,
      //   justifyContent: "center",
      //   alignItems: "center",
      // }}
    >
      {/* <ImageBackground style={styles.reactImg} source={require('../assets/images/partial-react-logo.png')}>
        <View style={{height:100, width: 100,}}></View>
      </ImageBackground> */}
      <View style={{margin:15, flexDirection:"row", justifyContent:"space-between"}}>
        <View>
          {/* <Text style={{fontWeight:"bold", fontSize:17}}>Good Morning, Boma</Text> */}
          <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
          <Text style={{fontWeight:"300"}}>How was your day?</Text>
        </View>
        <TouchableOpacity style={{ borderColor:"#0099ff", borderWidth:2, padding:7, borderRadius:10, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>

          <FontAwesome5 name="map-marker-alt" color="#0099ff" ></FontAwesome5>
          <Text style={{color:"#0099ff", marginHorizontal:5}}>{selectedCity}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dashboard}>

      <Text style={{fontSize:40, fontWeight:"bold", color:"white"}} >{temp.toPrecision(2).toString()}˚</Text>
      <Text style={{color:"white"}}>Feels like {feel.toPrecision(4).toString()}˚ / {desc}</Text>
      </View>
      {/* <Image style={[styles.reactImg]} source={require('@/assets/images/clouds.jpg')}/> */}
      <View

      style={{ width:"100%", flexDirection:"row", justifyContent:"space-between", padding:10}}>

      <Dropdown
      style={styles.dropdown}
      data={countries} labelField="country" valueField="iso2"
      search
      placeholder="Select Country"
      value={selectedCountry} onChange={item => {
        setCountry(item["iso2"]);
        setCities(item["cities"])
      }}
      renderRightIcon={() => (
        <AntDesign name="Safety"/>
  )}
      />
      <Dropdown
      style={styles.dropdown}
      data={cities.map((item, index) => ({
        label:item,
        value: item
      }))} 
      labelField="label" valueField="value"
      search
      placeholder="Select City"
      value={selectedCity} onChange={item => {
        setCity(item.value);
        getLat(selectedCountry,selectedCity);
      }}
      renderRightIcon={() => (
        <AntDesign name="Safety"/>
  )}
      />
      </View>
      <View style={{borderWidth:.5, borderColor:"lightgrey", borderRadius:10,padding:10, paddingVertical:15, margin:15, flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between"}}>
        {/* <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="cloud-sun" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>Very High</Text>
          <Text style={{fontWeight:300}}>UV Index</Text>
        </View> */}
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="wind" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{wind}km/h</Text>
          <Text style={{fontWeight:300}}>Wind</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="tint" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{humidity}%</Text>
          <Text style={{fontWeight:300}}>Humidity</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="temperature-low" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{dew}˚</Text>
          <Text style={{fontWeight:300}}>Dew Point</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="compress-alt" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{pressure}mb</Text>
          <Text style={{fontWeight:300}}>Pressure</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="eye" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{visibility/1000}km</Text>
          <Text style={{fontWeight:300}}>Visibility</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="sort-amount-down" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{ground}</Text>
          <Text style={{fontWeight:300}}>Ground Level</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="water" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{sea}</Text>
          <Text style={{fontWeight:300}}>Sea Level</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="sun" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{sunrise}</Text>
          <Text style={{fontWeight:300}}>Sun Rise</Text>
        </View>
        <View style={{justifyContent:"center", alignItems:"center", margin: 10}}>
          <FontAwesome5 name="cloud-sun" color="#0099ff" size={20}></FontAwesome5>
          <Text style={{fontWeight:"bold", fontSize:17}}>{sunset}</Text>
          <Text style={{fontWeight:300}}>Sun Set</Text>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor:"white"
    // justifyContent: "center",
    // alignItems: "center"
  },
  scrollview : {
    flex:1,
    // justifyContent: "center",
    // alignItems: "center"
  },
  reactImg: {
    height: 58,
    // width: 290,
    width:100,
    //  alignSelf:'center', 
     resizeMode:'cover',
    bottom: 0,
    left: 0,
    position: 'absolute',
    zIndex:100,
  },
  dashboard: {
    width:"95%", margin:10, padding:15, backgroundColor:"#0099ff",
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius : 1.41,
    elevation: 2
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    fontWeight:"bold", fontSize:17
  },
  dropdown : {
    width:"45%",
    margin: 10,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius : 1.41,
    elevation: 2
  },
  icon : {
    marginRight: 5,

  }
});