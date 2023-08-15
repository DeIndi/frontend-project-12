import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Loader,
} from 'semantic-ui-react';
import { useAuth, useAPI } from '../hooks';
import routes from '../routes';
import ChannelList from './ChannelList';
import MessagesList from './MessagesList';
import { DispatchModal } from './ChannelModal';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCurrentChannel, getCurrentMessages } from '../selectors/selectors';
import MessageForm from './MessageForm';

const Chat = () => {
  const auth = useAuth();
  const API = useAPI();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { username } = auth.userData;
  const headers = auth.getAuthHeader();
  const currentChannel = useSelector(getCurrentChannel);
  const currMessages = useSelector(getCurrentMessages);
  const { initChannels } = channelsActions;
  useEffect(() => {
    axios.get(routes.dataPath(), { headers })
      .then((response) => {
        dispatch(initChannels(response.data));
      })
      .catch((e) => {
        console.error('error: ', e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues = {
    body: '',
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '80vw' }}>
      <Container fluid style={{ height: '90%', width: '80%' }}>
        <div className="row h-100 d-flex bg-white flex-md-row">
          <ChannelList />
          <div className="col-4 col-md-4 d-flex flex-column h-100 flex-grow-1">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              { currentChannel
                ? (
                  <>
                    <p className="m-0">
                      <b>
                        { `# ${currentChannel?.name}` }
                      </b>
                    </p>
                    <span className="text-muted">
                      { `${t('channelList.messages')}: ${currMessages.length}` }
                    </span>
                  </>
                )
                : (
                  <Loader active inline />
                )}
            </div>
            <MessagesList currMessages={currMessages} />
            <MessageForm
              currentChannel={currentChannel}
              username={username}
              API={API}
              initialValues={initialValues}
            />
          </div>
        </div>
        <DispatchModal />
      </Container>
    </div>
  );
};
export default Chat;
