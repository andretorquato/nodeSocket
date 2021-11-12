import { container } from "tsyringe";
import { io } from "../http";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateMessageService } from "../services/CreateMessageService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoomService";
import { GetUserBySocketIdService } from "../services/GetUserBySocketIdService";

io.on('connect', socket => {
  socket.on('start', async data => {
    const { name, email, avatar } = data;
    const createUserService = container.resolve(CreateUserService);
    const user = await createUserService.execute({ name, email, avatar, socket_id: socket.id });

    socket.broadcast.emit("new_users", user);

    socket.on("get_users", async (callback) => {
      const getAllUsersService = container.resolve(GetAllUsersService);
      const users = await getAllUsersService.execute();
      callback(users);
    });
  });

  socket.on("start_chat", async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
    const getMessagesByChatRoomService = container.resolve(GetMessagesByChatRoomService);

    const userLogged = await getUserBySocketIdService.execute(socket.id);
    let room = await getChatRoomByUsersService.execute([data.idUser, userLogged.id]);

    if (!room) {
      room = await createChatRoomService.execute([data.idUser, userLogged._id]);
    }
    
    const messages = await getMessagesByChatRoomService.execute(room.idChatRoom);

    socket.join(room.idChatRoom);

    callback({ room, messages });
  });

  socket.on("message", async data => {
    const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);

    const user = await getUserBySocketIdService.execute(socket.id);

    const createMessageService = container.resolve(CreateMessageService);

    const message = await createMessageService.execute({
      to: user._id,
      text: data.message,
      roomId: data.idChatRoom
    });

    io.to(data.idChatRoom).emit("message", { message, user });
  });

});