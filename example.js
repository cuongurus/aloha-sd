var aloha = require('./')

aloha.find((err, result) =>{
    if (err) console.log(err)

    if(result){
        console.log(JSON.stringify(result,null,4))
    }
},'_http._tcp')
