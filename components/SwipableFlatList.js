import React, { Component} from 'react';
import { Dimensions } from 'react-native';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { ListItem, Icon} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view'

export default class SwipableFlatList extends Component{
    constructor(props){
        super(props)
        this.state={allNotifications:this.props.allNotifications}
    }
    renderItem=data=>(
        <ListItem leftElement={<Icon name="book" type = "font-awesome" color="#696969"/>}
        title={data.item.book_name}
        titleStyle={{color:"black", fontWeight :"bold"}}
        subtitle={data.item.message}
        bottomDivider
       />    )
       
       renderHiddenItem=()=>{
           <View style={{alignItems:'center', flex:1, flexDirection:'row', justifyContent:'space-between',backgroundColor:"#29B6F6"}}>
               <View style={{alignIems:'center', justifyContent:'center', bottom:0, top:0, position:'absolute',width:100,backgroundColor:'#29B6F6',right:0}}>
                   <Text>Mark As Read</Text>
               </View>
           </View>
       }
       updateMarkasRead=Notification=>{
           db.collection("all_notifications").doc(Notification.doc_id).update({notificationStatus:"read"})
       }
        
    onSwipeValueChange=SwipeData=>{
        var allNotifications = this.state.allNotifications;
        const{key,value}= SwipeData
        if(value<-Dimensions.get("window").width){
            const newData=[...allNotifications]
            this.updateMarkasRead(allNotifications[key])
            newData.splice(key, 1)
            this.setState({allNotifications:newData})
        }
    }
    render() {
        return(
            <View style={{backgroundColor:'white', flex:1}}>
            <SwipeListView
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem = {this.renderItem}
            renderHiddenItem = {this.renderHiddenItem}
            rightOpenValue = {-Dimensions.get("window").width}
            previewRowKey = {"0"}
            previewOpenValue ={-40}
            previewOpenDelay = {3000}
            onSwipeValueChange = {this.onSwipeValueChange}
            keyExtractor={(item,index)=>index.toString()}
            />
            </View>
            
            )
    }
}