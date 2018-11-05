function sendSuccess(res){
    var response = {
        message:  "Success" ,
        status : 200 ,
        data   : {}
      };
      return res.send(JSON.stringify(response)); 
}

function sendError(res) {
    var response = {
        message:  "Someting went wrong" ,
        status : 400 ,
        data   : {}
      };
      return res.send(JSON.stringify(response)); 
}

module.exports = {
    sendSuccess ,
    sendError
}