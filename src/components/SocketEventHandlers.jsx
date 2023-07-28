import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as channelsActions } from '../slices/channelsSlice';
import { actions as messagesActions } from '../slices/messagesSlice';

const SocketEventHandlers = ({ clientSocket }) => {
  const dispatch = useDispatch();
  const currChannelId = useSelector((state) => state.channels.currentChannelId);

  useEffect(() => {
    clientSocket.on('newMessage', (payload) => {
      const {
        body, channelId, id, username,
      } = payload;
      dispatch(
        messagesActions.addMessage({
          body,
          channelId,
          id,
          username,
        }),
      );
    });

    clientSocket.on('newChannel', (payload) => {
      const { id, name } = payload;
      dispatch(channelsActions.addChannel({ id, name }));
      dispatch(channelsActions.updateCurrentChannelId(id));
    });

    clientSocket.on('removeChannel', (payload) => {
      const { id } = payload;
      dispatch(channelsActions.removeChannel(id));
      if (currChannelId === id) {
        dispatch(channelsActions.updateCurrentChannelId(1));
      }
    });

    clientSocket.on('renameChannel', (payload) => {
      const { id, name } = payload;
      dispatch(channelsActions.renameChannel({ id, name }));
    });

    return () => {
      clientSocket.off('newMessage');
      clientSocket.off('newChannel');
      clientSocket.off('removeChannel');
      clientSocket.off('renameChannel');
    };
  }, [clientSocket, dispatch, currChannelId]);

  return null;
};

export default SocketEventHandlers;
