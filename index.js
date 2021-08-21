const express= require('express');
const app= express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = (3001 || process.env.PORT);
const delay= require('delay')


app.use(express.static("public"));

app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/view/home.html');
})
const users=['aaa']
io.on('connection', (socket) => {

       socket.on('update-list',(name)=>{
         users.push(name)
         socket.userName=name
         io.emit('list-users',users);
        })
      socket.on('on-chat',(data)=>{          
           //socket.broadcast.emit('list-users',users);
           //socket.emit('user-chat',data);
           io.emit('user-chat',data)

      })
       
       socket.on('disconnect',()=>{
         users.splice(
            users.indexOf(socket.userName),1)
          //console.log(users)
           io.emit('list-users',users)

       })


        socket.on('typing',()=>{
            let s=socket.userName +' typing...'
            socket.broadcast.emit('send-typing',s)
        })
         socket.on('out-typing',()=>{
            socket.broadcast.emit('send-out-typing')
        })
      })

    
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});



