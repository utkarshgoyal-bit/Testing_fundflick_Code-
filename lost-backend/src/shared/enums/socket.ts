const enum SOCKET_EVENTS {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  JOIN = 'join',
  LEAVE = 'leave',
  NEW_MESSAGE = 'new_message',
  READE_MESSAGE = 'read_message',
}
export const enum SOCKET {
  SOCKET_PATH = '/socket',
  EMAIL_UNDEFINED = 'Email ID is undefined',
}

export default SOCKET_EVENTS;
