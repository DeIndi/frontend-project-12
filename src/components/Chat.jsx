import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import filter from 'leo-profanity';
import { Container } from 'react-bootstrap';
import { useAuth, useAPI } from '../hooks';
import routes from '../routes';
import ChannelList from './ChannelList';
import { DispatchModal } from './ChannelModal';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chat = () => {
  const auth = useAuth();
  const socketAPI = useAPI();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { username } = auth.userData;
  const headers = auth.getAuthHeader();
  const currentChannel = useSelector((state) => state.channels.entities
    .find((channel) => channel.id === state.channels.currentChannelId));
  const currMessages = useSelector((state) => state.messages.entities
    .filter((message) => message.channelId === currentChannel.id));
  const { initChannels, updateCurrentChannelId } = channelsActions;
  useEffect(() => {
    console.log('Use Effect from Chat');

    axios.get(routes.dataPath(), { headers })
      .then((response) => {
        console.log('response.data: ', response.data);
        const { currentChannelId, channels, messages } = response.data;
        dispatch(updateCurrentChannelId(currentChannelId));
        dispatch(initChannels({ channels, messages }));
      })
      .catch((e) => {
        console.log('error: ', e);
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
              <p className="m-0">
                <b>
                  { `# ${currentChannel?.name}` }
                </b>
              </p>
              <span className="text-muted">
                { `${t('channelList.messages')}: ${currMessages.length}` }
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5 ">
              { /* eslint-disable-next-line no-shadow */ }
              { currMessages.map(({ id, username, body }) => (
                <div key={id}>
                  <b>{ username }</b>
                  { ': ' }
                  { body }
                </div>
              )) }
            </div>
            <div className="mt-auto px-5 py-3">
              <Formik
                initialValues={initialValues}
                onSubmit={async (values, { resetForm }) => {
                  // eslint-disable-next-line max-len
                  const result = await socketAPI.createMessage({ body: filter.clean(values.body), channelId: currentChannel.id, username });
                  console.log('result of createMessage: ', result);
                  resetForm();
                }}
              >
                { (formik) => (
                  <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
                    <div className="input-group has-validation">
                      <Field
                        type="text"
                        name="body"
                        aria-label={t('channelList.newMessage')}
                        placeholder={t('channelList.inputMessage')}
                        className="border-0 p-0 ps-2 form-control"
                      />
                      <button type="submit" className="btn btn-group-vertical">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          width="20"
                          height="20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                          />
                        </svg>
                        <span className="visually-hidden">{ t('modal.send') }</span>
                      </button>
                    </div>
                  </Form>
                ) }
              </Formik>
            </div>
          </div>
        </div>
        <DispatchModal />
      </Container>
    </div>
  );
};
export default Chat;
