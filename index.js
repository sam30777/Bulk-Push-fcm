

const  express = require('express');
const app = new express() ;
const Promise = require('bluebird')
const database = require('./db')
const  response = require('./responses');

const fcmPush = require('./fcm');
const db =require('./db.js');
const {USER} = require('./user');

function generateRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 24 ; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
 



app.post('/insertDummyUsers',(req,res)=>{
    let deviceToken = generateRandomString() ;
    let obj = {} ;
    let insertArray= [];
    for( let i = 0 ; i < 2000 ; i++ ) {
           obj ={
            deviceToken : deviceToken 
           } 
        insertArray.push(obj);
        
    }

    USER.insertMany(insertArray,(err,result)=>{
        if(err){
            response.sendError(res);
        }else{
            response.sendSuccess(res);
        }
    })
})



app.post('/sendBulkNotificaitons',(req,res)=>{
    let promiseArray = [] ;
     let stream = USER.find({}).cursor() ;
    let perThousandUser = [] ;
    let i = 0;
    
    stream.on('data',(doc)=>{
        console.log('doc is this-->',doc);
        if( i < 1000){
            perThousandUser.push(doc.deviceToken);
            i++ ;
        } else {
            promiseArray.push(fcmPush.sendFcmPush(perThousandUser,"Welcome to app"));
            perThousandUser = [];
            i = 0;
        }   
    })

    stream.on('end',()=>{
        if(perThousandUser.length > 0){
            promiseArray.push(fcmPush.sendFcmPush(perThousandUser,"Welcome to app"));
        }
        Promise.all(promiseArray).then(()=>{
            response.sendSuccess(res);
        }).catch((err)=>{
            console.log('error os this--->',err);
            response.sendError(res);
        })
    })

})


app.listen(3000,()=>{
    console.log("server is running at port 3000");
})