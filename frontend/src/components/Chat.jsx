import {useEffect, useState} from "react";
import axios from "axios";
import useAuth from "../hooks";
import routes from "../routes";
import ChannelList from "./ChannelList";
import {useDispatch, useSelector} from 'react-redux';
import { actions as usersActions } from '../slices/usersSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chat = () => {
    const auth = useAuth();
    const headers = auth.getAuthHeader();
    const [currentMessage, setCurrentMessage] = useState('');
    useSelector(state => {console.log('curState: ', state)});
    const messages = useSelector(state => state.messages.entities);
    const currentChannel = useSelector(state => state.channels.entities
        .find((channel) => channel.id === state.channels.currentChannelId));
    console.log('Current Channel: ', currentChannel);
    const dispatch = useDispatch();
    const { initChannels, updateCurrentChannelId } = channelsActions;
    const { initMessages } = messagesActions;
    useEffect(() => {
        axios.get(routes.dataPath(), { headers })
            .then((response) => {
                const {  currentChannelId, channels, messages } = response.data;
                dispatch(updateCurrentChannelId(currentChannelId));
                dispatch(initChannels(channels));
                dispatch(initMessages(messages));
                console.log('response.data: ', response.data);
            })
            .catch((e) => {
                console.log('error: ', e);
            });
    }, []);
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
          {`messages: ${messages.length}`}
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
                        <form noValidate="" className="py-1 border rounded-2">
                            <div className="input-group has-validation">
                                <input name="body" aria-label="Новое сообщение"
                                       placeholder="Введите сообщение..."
                                       className="border-0 p-0 ps-2 form-control"
                                       onInput={(e) => { e.preventDefault(); setCurrentMessage(currentMessage.concat(e.nativeEvent.data))} }
                                       ></input>
                                <button type="submit" onClick={(e)=> { e.preventDefault(); console.log(currentMessage) }} disabled="" className="btn btn-group-vertical">
                                    <span className="visually-hidden">Отправить</span></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default  Chat;
