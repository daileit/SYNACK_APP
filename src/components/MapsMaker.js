import React, { Component } from 'react';
import {
    Image, View, StyleSheet, Text, Platform, Alert,
     TouchableOpacity, Modal, Animated,Easing
} from 'react-native';
import { nstyles  } from '../styles/styles'
import Untils from '../app/Utils';
import { Images } from '../images';
import { colors } from '../styles/color';
import { sizes } from '../styles/size';
import Utils from '../app/Utils';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';



export default class MapsMaker extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: 10.764929, // kinh độ
                longitude: 106.697514, // vĩ độ
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
        }
    }

    componentDidMount(){
      
    }
    
  
    //Menu popup More...
    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={this.state.region}
                    showsUserLocation={true}
                >
                    <MapView.Marker
                        coordinate={this.state.region}
                        title={"Địa điểm 1"}
                    >
                        <MapView.Callout tooltip={true}>
                            <View style={{flexDirection:'column',backgroundColor:'white'}}>
                                <Image resizeMode="cover" source={Images.hotel} style={{width:'100%',height:200}} />
                                <View style={styles.containerText}>
                                    <Text>Hotel Name</Text>
                                    <Text>Homestay</Text>
                                    <View style={styles.containerIcon}>
                                        <Image resizeMode="contain" source={Images.connection} style={styles.iconDiscription}/>
                                        <Image resizeMode="contain" source={Images.thang} style={styles.iconDiscription}/>
                                        <Image resizeMode="contain" source={Images.person} style={styles.iconDiscription}/>
                                        <Image resizeMode="contain" source={Images.dog} style={styles.iconDiscription}/>
                                        <Image resizeMode="contain" source={Images.fire} style={styles.iconDiscription}/>
                                        <Image resizeMode="contain" source={Images.p} style={styles.iconDiscription}/>
                                    </View>
                                    <View style={{flexDirection:'row',marginVertical:10,justifyContent:'center',alignItems:'center'}}>
                                        <TouchableOpacity style={styles.btnRating}>
                                            <Text>7.8/10</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.txtRating}>Very Good</Text>
                                        <Text>289 Reviews</Text>
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                        <TouchableOpacity style={styles.btnBooking}>
                                            <Text>Book now</Text>
                                        </TouchableOpacity>
                                        <View style={{flexDirection:'column'}}>
                                            <Text style={{textDecorationLine:'line-through'}}>1,980,000   VND</Text>
                                            <Text>880,000 VND</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </MapView.Callout>
                    </MapView.Marker>
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    containerText:{
        paddingVertical:10,
        marginHorizontal: 10,
        flexDirection: 'column'
    },
    containerIcon:{
        flexDirection:'row',
    },
    iconDiscription:{
        width:25,
        height:25,
        marginRight:10
    },
    btnRating:{
        backgroundColor:'blue',
        borderRadius:15,
        paddingHorizontal:16,
        paddingVertical: 12,
        marginRight: 15
    },
    txtRating:{
        fontSize:16,
        color:'blue',
        marginRight: 20
    },
    btnBooking:{
        backgroundColor:'orange',
        paddingHorizontal:16,
        paddingVertical: 10,
        borderRadius:15,
    },
});


