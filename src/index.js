const express =require('express')
const app= express()

app.set('port', 5000)


app.get('/',(req, res)=>{
res.send('hola mundo ')
})

 app.listen(app.get('port'),() =>{
console.log('server on port', app.get('port'))
 })
