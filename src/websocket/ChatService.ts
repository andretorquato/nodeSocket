import { io } from "../http";
io.on('connect', socket => {
  
  socket.on('init_chat', socket => {
    message: 'Chat init'
  });
});