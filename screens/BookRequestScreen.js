import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  FlatList} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      requestId:"",
      requestedBookName:"",
      isBookRequestActive:"",
      userDocId:"",
      docId:"",
      bookStatus:"",
      showFlatList: false,
      dataSource :""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }
  componentDidMount(){
    this.getBookRequest()
    this.getIsBookRequestActive()
  }
getIsBookRequestActive(){
  db.collection('users').where('email_id','==',this.state.userId).onSnapshot(query=>{
    query.forEach(doc=>{this.setState({isBookRequestActive:doc.data().isBookRequestActive,userDocId:doc.id})})
    
  })
}

 getBookRequest=()=>{
var bookRequest = db.collection('requested_books').where('user_id','==',this.state.userId).get()
.then((snapshot)=>{
  snapshot.forEach((doc)=>{
if(doc.data().book_status !== "received"){
  this.setState({
    requestId:doc.data().request_id,
    requestedBookName: doc.data().book_name,
    bookStatus:doc.data().book_status,
    docId: doc.id
  })
}
  })
})
}

  addRequest =async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
    })

    await this.getBookRequest();
    db.collection("users").where("email_id","==",userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({isBookRequestActive:true})
      })
    })

    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }

  updateBookRequestStatus=()=>{
    db.collection('requested_books').doc(this.state.docId).update({book_status:'received'})
  }
receivedBooks=(bookName)=>{
  db.collection('recieved_books').add({
    "user_id":this.state.userId,
    "book_name":bookName,
    "request_id": this.state.requestId,
    "book_status": "received"
  })
}


async getBooksFromAPI(bookName){
  this.setState({
    bookName:bookName
})
  if(bookName.length>2){
    var books = await BookSearch.searchbook(bookName,'AIzaSyBDE6qQUU8NVNS-OQfbqOckVg-pWQrSCO4')
    this.setState({dataSource:books.data,showFlatList:true})
  }
  console.log(this.state.dataSource)
}
renderItem=({item,i})=>{
  return(
    <TouchableHighlight
    style={{alignItem:'center',backgroundColor:'#666666',padding:10,width:'90%'}}
    activeOpacity = {0.6}
    underlayColor = "#DDDDDD"
    onPress= {()=>{this.setState({showFlatList:false,bookName:item.volumeInfo.title})}}
    bottomDivider>
      <Text>{item.volumeInfo.title}</Text>
    </TouchableHighlight>
  )
}

  render(){
   
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={text=>{
                  this.getBooksFromAPI(text)
                   
                }}
                value={this.state.bookName}
              />
              {this.state.showFlatList?(
              <FlatList data={this.state.dataSource}
                  renderItem = {this.renderItem}
                  enableEmptySections={true}
                  style={{marginTop:10}}
                  keyExtractor={(item,index)=>index.toString()}
              />):(
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />)}
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
