import { server } from "./http";
import "./websocket/ChatService";

server.listen(3000, () => console.log("Socket is running on port 3000"));