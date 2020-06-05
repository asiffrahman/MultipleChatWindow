
  var posNum = 0; //0 for GM and 1 for Player
  var userNa;
  var userNum=0;
  var roomNum;
  var roomPass;
  var roomPl=0;
  var spNum = 0; // 1 if He is Spectator 1
  var plNameList=["","","","","","",""];
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCwRHQFlj--hlbzmAUsqw6uJMND9XvT6tg",
    authDomain: "pheonixchat-6c2e4.firebaseapp.com",
    databaseURL: "https://pheonixchat-6c2e4.firebaseio.com",
    projectId: "pheonixchat-6c2e4",
    storageBucket: "pheonixchat-6c2e4.appspot.com",
    messagingSenderId: "345813116648",
    appId: "1:345813116648:web:266110f370cb9be9fa8b5d",
    measurementId: "G-ESW15N7N3X"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  var messagesDB = db.collection("chatroom").doc("room1").collection("messages");
  var usersDB = db.collection("chatroom").doc("room1").collection("users");
  var roomInfo = db.collection("chatroom").doc("room1").collection("room Information");

  function createRoom(){
      var plrdCR = document.getElementById('plR');
      if (plrdCR.checked == true) {
        changeDiaM("!Player Cannot Create Room!");
        return ;
      }

      console.log(2);

      loadRoom();

     roomInfo.doc("doorNo").set({
       Password: document.getElementById('roomPs').value,
       PlTotal: 0,
       TotalNum: document.getElementById('plNumber').value,
       date: new Date().getTime()
     })
     .then(function() {
         console.log("Document successfully written!");
         changeDiaM("Room Created &nbsp;&nbsp;&nbsp; RoomID:"+roomNum);
         document.getElementById("roomC").disabled = "disabled";

     })
     .catch(function(error) {
         console.error("Error writing document: ", error);
     });



  }
  // RoomInfo を更新する
  function updateRoom(roomdoc){
    return roomdoc.update({
        PlTotal: roomPl
    })
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
  }

  //プレイヤーが参加した時にroomInfoを取得する
  function getRoomPL(){
    loadRoom();
    roomInfo.doc("doorNo").get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
        roomPl = doc.data().PlTotal;
        roomPl = roomPl+1;
        console.log("current player number", roomPl);
        updateRoom(roomInfo.doc("doorNo"));
        plWindow();//不本意
        updatePlDB();
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    }).catch(function(error) {
    console.log("Error getting document:", error);
    });
  }

function updatePlDB(){
  // Set the "capital" field of the city 'DC'
  return usersDB.doc(userNa).update({
      Pn: roomPl
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}


  //Message Database Initialization
   /**
    * 同期処理
    **/
    function mesInstant(){
  //  messagesDB.orderBy("date", "asc").limit(20).onSnapshot( (snapshot) => {
   messagesDB.orderBy("date", "asc").onSnapshot( (snapshot) => {
   snapshot.docChanges().forEach((change) => {
     // 追加
     if ( change.type === 'added' ) {
       if(posNum==0){addText(change.doc.id, change.doc.data());}
       if(posNum==1){addPlText(change.doc.id, change.doc.data());}

     }
     // 更新
     else if( change.type === 'modified' ){
       //modLog(change.doc.id, change.doc.data());
     }
     // 削除
     else if ( change.type === 'removed' ) {
       //removeLog(change.doc.id);
     }
   });
 });}

 //mesInstant(); // 画面を作った後にインスタンス化

//User Database Initialization
  function userInstant(){
 //usersDB.orderBy("date", "asc").limit(20).onSnapshot( (snapshot) => {
 usersDB.orderBy("date", "asc").onSnapshot( (snapshot) => {
 snapshot.docChanges().forEach((change) => {
   // 追加
   if ( change.type === 'added' ) {
     if(posNum==0){editView(change.doc.id, change.doc.data());}

     if(posNum==1){plEditView(change.doc.id, change.doc.data());}
   }
   // 更新
   else if( change.type === 'modified' ){
     //modLog(change.doc.id, change.doc.data());
   }
   // 削除
   else if ( change.type === 'removed' ) {
     //removeLog(change.doc.id);
   }
 });
});}


//あとは画面をどんどん作っていけばいいと思う
function editView(id, data){
  if(data.PosNumber == 1){
  var  userNameList = document.getElementsByClassName('userN');
  userNameList[userNum].innerText = data.Name;
  console.log(userNameList);
  plNameList[userNum] = data.Name
  userNum ++;
  }
}
function plEditView(id, data){
  if(data.PosNumber == 0){
  var  userNameList = document.getElementsByClassName('userN');
  userNameList[0].innerText = data.Name;

  }
}

//決定ボタンを押された時の処理
function onStart(){

  var gmrd = document.getElementById('gmR');
  var plrd = document.getElementById('plR');
  if(gmrd.checked == true){
    posNum = 0;
  }else if (plrd.checked == true) {
    posNum = 1;
    getRoomPL();
  }
  userNa = document.getElementById('userName').value;



  usersDB.doc(userNa).set({
  Name: userNa,
  PosNumber: posNum,
  Yokoguruma: 25,
  date: new Date().getTime()
  })
  .then(function(docRef) {
    //console.log("Document written with ID: ", docRef.id);
    document.getElementById("startB").disabled = "disabled";
    document.getElementById("relB").disabled = "disabled";
    document.getElementById("spB").disabled = "disabled";
    changeDiaM("Joined &nbsp;&nbsp;&nbsp; RoomID:"+roomNum);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
  if(posNum == 0){
    makeWindow(document.getElementById('plNumber').value);
  }
  if(posNum == 1){
    //plWindow();
  }

}


// どのユーザーからもつけるようにするべき
function addData() {
      if(posNum == 0){
      var cm = textArea[this.name-1].value;
      textArea[this.name-1].value = "";}
      if(posNum == 1){
      var cm = textArea[0].value;
      textArea[0].value = "";}
      messagesDB.add({
      PosNumber: posNum,
      Name: plNameList[this.name-1],
      plId: this.name,
      posN: posNum,
      Comment: cm,
      Yokoguruma: 25,
      date: new Date().getTime()
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
}

function generateText(cm, mNum, lrNum){

  var div = document.createElement('div');
  div.className = 'plMessage';
  if(lrNum == posNum){div.className = 'gmMessage';}
  div.innerHTML= cm;
  messagesElement[mNum].appendChild(div);
  var div1 = document.createElement('div');
  div1.className = 'bms_clear';
  messagesElement[mNum].appendChild(div1);
   // Need to Modify
  messagesElement[mNum].scrollTop = messagesElement[mNum].scrollHeight;
}

function addPlText(id, data){
  if(roomPl==data.plId){
    var comm = data.Comment;
    var mesNum = 0;
    lrNum = data.PosNumber;
    generateText(comm, mesNum, lrNum);
  }
}

function addText(id, data){
  var comm = data.Comment;
  var mesNum = data.plId-1;
  lrNum = data.PosNumber;
  generateText(comm, mesNum,lrNum);

}

function gmView(){
    //userNameElement.innerText = "GMです";
    var  userNameList = document.getElementsByClassName('userN');
    userNameList[this.name].innerText = "GMDESU";
    //for( var i = 0; i<userNameList.length();i++ ){
      //userNAmeList[i].innerText = "GMデス";
    //}
    console.log(this.name);
}

var gmButtonElement = document.getElementById('gmB');
var messagesElement = document.getElementsByClassName('messagesStyle');
var userNameElement = document.getElementById('bms_chat_user_name');
var textArea = document.getElementsByClassName('bms_send_messageF');
var containerElement1 = document.getElementById('user1');
var containerElement2 = document.getElementById('user2');
var containerElement3 = document.getElementById('user3');

// Chat Box Structure
var messageBoxStruc =
'<div class="your_container" id="user_N" style="float:left;">'+



      '<!-- チャットの外側部分① -->'+
       '<div id="bms_messages_container">'+

           '<!-- ヘッダー部分② -->'+
           '<div id="bms_chat_header">'+
               '<!--ステータス-->'+
               '<div id="bms_chat_user_status">'+
                   '<!--ステータスアイコン-->'+
                   '<div id="bms_status_icon">●</div>'+
                   '<!--ユーザー名-->'+
                   '<div id="bms_chat_user_name" class="userN">ユーザー</div>'+
               '</div>'+
           '</div>'+

           '<!-- タイムライン部分③ -->'+
           '<!-- Deleted the original message-->'+
           '<div id="bms_messages1" class="messagesStyle">'+


           '</div>'+

           '<!-- テキストボックス、送信ボタン④ -->'+
           '<div id="bms_send">'+
               '<textarea id="bms_send_message1" class="bms_send_messageF"></textarea>'+
               '<div id="bms_send_btn">'+
                   '<button type="button" name="sendButton" id="sendB_N" class="BSend"> SEND </button>'+
              '</div>'+
              '</div>'+
       '</div>'+

   '</div>';

function plWindow(){
  var mainBoxElement = document.getElementById('mainBody');
  var divmain = document.createElement('div');
  divmain.innerHTML = messageBoxStruc;
  //consloe.log('Your code is Correct');
  mainBody.appendChild(divmain);
  console.log("Now player number", roomPl);
  changeid(roomPl);

  var wid = 50;
  var boxes = document.getElementsByClassName('your_container');
  for(i = 0; i < boxes.length; i++) {
    boxes[i].style.width = wid+'%';
  }
  changeHeight();
  window.onresize = changeHeight;
  userInstant();
  mesInstant();
  instantEKey();
  //need Message Instant

}
// Test Code to add a box and chage th ewidth to fit the screen イイ感じ　
//画面作成いを指定されたプレイヤー分作成して上のメニューを非表示にする
function makeWindow(plNum){

  //var plNum = document.getElementById('plNumber').value;
  var mainBoxElement = document.getElementById('mainBody');
  for(i = 1; i <= plNum; i++){
  var divmain = document.createElement('div');
  divmain.innerHTML = messageBoxStruc;
  //consloe.log('Your code is Correct');
  mainBody.appendChild(divmain);
  changeid(i);
  }

  var wid = 100/plNum;

  var boxes = document.getElementsByClassName('your_container');
  for(i = 0; i < boxes.length; i++) {
    boxes[i].style.width = wid+'%';
  }
  changeHeight();
  window.onresize = changeHeight;
  userInstant();
  mesInstant();
  instantEKey();

}
function changeid(n){
  document.getElementById('user_N').id = "user"+n;
  document.getElementById('bms_chat_user_name').id = "user_name"+n;
  var sB = document.getElementById('sendB_N');
  console.log("n is ", n);
  sB.addEventListener('click',　{name: n, handleEvent: addData});
  sB.id = "sendB"+n;
  document.getElementById('bms_send_message1').id = "send_message"+n;

}

function instantEKey(){
  var textAreaK = document.getElementsByClassName('bms_send_messageF');
  var kN = 0;
  for(i = 0; i < textAreaK.length; i++) {
    kN = i;
    textAreaK[i].addEventListener("keypress", {name: kN, handleEvent:enter});
  }


  }
  function enter(){
    if( window.event.keyCode == 13 ){
    var sblist = document.getElementsByClassName('BSend');
      sblist[this.name].click();
    }
}
function changeHeight(){
  var hei = window.innerHeight;
  var boxes = document.getElementsByClassName('your_container');
  for(i = 0; i < boxes.length; i++) {
    console.log("My Height is",hei);
    boxes[i].style.height = hei-160+'px';
  }
}
function changeDiaM (diaCM){
  document.getElementById('diaMes').innerHTML= diaCM;
}
function onReload(){
  //Need Check of Name
  var gmrd = document.getElementById('gmR');
  var plrd = document.getElementById('plR');
  if(gmrd.checked == true){
    posNum = 0;
  }else if (plrd.checked == true) {
    posNum = 1;
  }
  loadRoom();
  roomInfo.doc("doorNo").get().then(function(doc) {
  if (doc.exists) {
      userNa = document.getElementById('userName').value;
      var totalPNum = doc.data().TotalNum;
      var rPass = doc.data().Password;
      usersDB.get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.log("Reloaded");
            if(userNa == doc.data().Name){
              //document.getElementById("startB").disabled = "disabled";
              //document.getElementById("relB").disabled = "disabled";
              changeDiaM("Rejoined &nbsp;&nbsp;&nbsp; RoomID:"+roomNum);

              if(doc.data().PosNumber == posNum){
                if(posNum==0){
                if(rPass == document.getElementById('roomPs').value){
                makeWindow(totalPNum);
                console.log(doc.data());
                document.getElementById("startB").disabled = "disabled";
                document.getElementById("relB").disabled = "disabled";
                document.getElementById("spB").disabled = "disabled";
                if(spNum == 1){
                   stopSendB();
                   console.log('Stopped All Send Button');
                }
              }else{
                changeDiaM("Wrong Password");
              }

              }
                else if(posNum==1){
                  roomPl = doc.data().Pn;
                  plWindow();
                  console.log(totalPNum);
                  document.getElementById("startB").disabled = "disabled";
                  document.getElementById("relB").disabled = "disabled";
                  document.getElementById("spB").disabled = "disabled";
                }else {
                  changeDiaM("Chose Player Or Game Maseter &nbsp;&nbsp;&nbsp; RoomID:"+roomNum);
                }
              }
            }
              // doc.data() is never undefined for query doc snapshots

          });
      });

      //console.log("Document data:", doc.data());
      //roomPl = doc.data().PlTotal;
      //roomPl = roomPl+1;
      //console.log("current player number", roomPl);
      //updateRoom(roomInfo.doc("doorNo"));
      //plWindow();//不本意
  } else {
      // doc.data() will be undefined in this case
      changeDiaM("Room Does Not Exist or User Does Not Match");
      console.log("No such document!");
  }
  }).catch(function(error) {
  console.log("Error getting document:", error);
  });
}


function loadRoom(){
  roomNum= document.getElementById('roomId').value;
  messagesDB = db.collection("chatroom").doc(roomNum).collection("messages");
  usersDB = db.collection("chatroom").doc(roomNum).collection("users");
  roomInfo = db.collection("chatroom").doc(roomNum).collection("room Information");
  console.log(roomNum);

}
function onSpectate(){
  var gmrd = document.getElementById('gmR');
  var plrd = document.getElementById('plR');
  if(gmrd.checked == true){
    spNum = 1;
    onReload();
    console.log('I am here');


  }else if (plrd.checked == true) {
    changeDiaM("Choose Game Master to Spectate");
  }
}
function stopSendB(){
  var sblist = document.getElementsByClassName('BSend');
  for(i = 0; i < sblist.length; i++) {
    console.log(i);
    sblist[i].disabled = "disabled";
  }
}

startB.addEventListener('click', onStart);
//gmB.addEventListener('click', getRoomPL);
//plB.addEventListener('click',makeWindow);
roomC.addEventListener('click',createRoom);
relB.addEventListener('click',onReload);
spB.addEventListener('click',onSpectate);
