var aloha = require('aloha-sd')

aloha.find((err, result) =>{
    if (err) console.log(err)

    if(result){
        console.log("Found service: "+ JSON.stringify(result,null,4))
    }
},'_http._tcp')
