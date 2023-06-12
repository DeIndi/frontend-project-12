import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useSocketAPI } from "../hooks";
import routes from "../routes";
import ChannelList from "./ChannelList";
import { DispatchModal, AddChannelModal, RenameChannelModal } from "./ChannelModal";
import {useDispatch, useSelector} from 'react-redux';
import { actions as usersActions } from '../slices/usersSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as modalsActions } from "../slices/modalsSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {Formik, Form, Field} from "formik";
import filter from 'leo-profanity';

const Chat = () => {
    const auth = useAuth();
    const socketAPI = useSocketAPI();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { username } = auth.userData;
    const headers = auth.getAuthHeader();
    const [currentMessage, setCurrentMessage] = useState('');
    const currentChannel = useSelector(state => state.channels.entities
        .find((channel) => channel.id === state.channels.currentChannelId));
    const messages = useSelector(state => state.messages.entities
        .filter((message) => message.channelId === currentChannel.id));
    useEffect(() => {
        axios.get(routes.dataPath(), { headers })
            .then((response) => {
                const {  currentChannelId, channels, messages } = response.data;
                dispatch(updateCurrentChannelId(currentChannelId));
                dispatch(initChannels(channels));
                dispatch(initMessages(messages));
            })
            .catch((e) => {
                console.log('error: ', e);
            });
    }, []);
    const { initChannels, updateCurrentChannelId } = channelsActions;
    const { initMessages } = messagesActions;

    const onInputMessage = (e) => {
        e.preventDefault();
        console.log('currentMessage: ', currentMessage);
    }

    /*const handleSubmit = (values, { resetForm }) => {
        console.log('test string');
        setCurrentMessage(filter.clean(currentMessage));
        socketAPI.createMessage({body: values.body, channelId: currentChannel.id, username});
        resetForm();
    };*/

    const initialValues = {
        body: ""
    };

    return (
        <div className="container-fluid">
            <div className="row h-100 d-flex bg-white flex-md-row">
                <ChannelList/>
                <div className="col-4 col-md-4 d-flex flex-column h-100 flex-grow-1">
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                        <p className="m-0">
                            <b>
                                {`# ${currentChannel?.name}`}
                            </b>
                        </p>
                        <span className="text-muted">
          {`${t('channelList.messages')}: ${messages.length}`}
        </span>
                    </div>
                    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                        {messages.map(({id, username, body}) => (
                            <div key={id}>
                                <b>{username}</b>
                                {': '}
                                {body}
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto px-5 py-3">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={(values, { resetForm }) => {
                                console.log('test string');
                                socketAPI.createMessage({body: filter.clean(values.body), channelId: currentChannel.id, username});
                                resetForm();
                            }}
                        >{(formik) => (
                            <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
                                <div className="input-group has-validation">
                                    <Field
                                        type="text"
                                        name="body"
                                        aria-label="channelList.newMessage"
                                        placeholder="channelList.inputMessage"
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
                                            ></path>
                                        </svg>
                                        <span className="visually-hidden">{t('HeaderNavBar.send')}</span>
                                    </button>
                                </div>
                            </Form>
                        )}
                        </Formik>
                    </div>
                </div>
            </div>
            <DispatchModal/>
        </div>
    );
}
export default  Chat;
