var aloha = require('./')

var finder = aloha.find((err, result) =>{
    if (err) console.log(err)

    if(result){
        console.log(JSON.stringify(result,null,4))
    }
},'_http._tcp')


setTimeout(function(){
    finder.shutdown()
},3000)

