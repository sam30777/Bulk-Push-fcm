

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
        userId++ ;
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
     let stream = USER.find({}).stream ;
    let perThousandUser = []
    let i = 0;
    stream.on('data',(doc)=>{
        if( i < 1000){
            perThousandUser.push(doc.deviceToken);
            i++ ;
        }else{
            promiseArray.push(fcmPush.sendFcmPush(perThousandUser));
            perThousandUser = [];
            i = 0;
        }   
    })

    stream.on('end',()=>{
        if(perThousandUser.length > 0){
            promiseArray.push(fcmPush.sendFcmPush(perThousandUser));
        }
        Promise.all(promiseArray).then(()=>{
            response.sendSuccess(res);
        }).catch((err)=>{
            response.sendError(err);
        })
    })

})


app.listen(3000,()=>{
    console.log("server is running at port 3000");
})