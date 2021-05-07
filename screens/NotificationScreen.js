import firebase from 'firebase';
import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,FlatList} from 'react-native';
import MyHeader from '../components/MyHeader';
import{ListItem,Icon} from 'react-native-elements'
import db from '../config'
import SwipableFlatList from '../components/SwipableFlatList'

export default class NotificationScreen extends React.Component {
    constructor(){
       super()
       this.state={userId:firebase.auth().currentUser.email,allNotifications:[]}
       this.notificationref= null
    }
    componentDidMount() {
        this.getNotifications()
    }
    getNotifications=()=>{
        console.log("line14")
        this.notificationref=db.collection("all_notification")
       .where("notificationStatus","==","unread")
        .where("targetUserId","==",this.state.userId)
        .onSnapshot((Snapshot)=>{
            var allnotifications = []
            Snapshot.docs.map((doc)=>{
                var notification = doc.data();
                notification ["doc_id"] = doc.id
                allnotifications.push(notification)
            })
        this.setState({allNotifications:allnotifications})
        })
        console.log(this.state.allNotifications)
    }
    keyExtractor=(item,index)=>index.toString();
    renderItem=({item,index})=>{
        return(
            <ListItem key={index}
            leftElement={<Icon name="book" type="font-awesome" color='#696969'/>}
        title = {item.bookName}
        titleStyle={{color:'black',fontWeight:'bold'}}
        subtitle = {item.message}
        bottomDivider
            />)
    }
    render(){
    return(
        <View style={{flex:1}}>
            <View style={{flex:1}}>
            <MyHeader title={"Notification"}navigation={this.props.navigation}/>
                </View>
                <View style={{flex:0.9}}>
                    {this.state.allNotifications.length==0?(
                        <View style={{flex:1}}>
                            <Text>You have no Notifications</Text>
                        </View>
                    ):(
                     <SwipableFlatList allNotification={this.state.allNotifications}/>
                     )}
                  </View>)
        </View>)
}}