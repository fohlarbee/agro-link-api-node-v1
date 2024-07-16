import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway( {namespace:'events'})
export class EventsGateway implements  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;
  socket: Socket;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized', server);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
 
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessage(@ConnectedSocket() client:Socket, @MessageBody() messsage:string): string {

    client.broadcast.emit('messsage', messsage);
    client.emit('message', 'Your message was received');

    return 'Hello world!';
  }
}
