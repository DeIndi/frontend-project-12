import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useAuth, useSocketAPI} from "../hooks";
import {actions as channelsActions} from "../slices/channelsSlice"
import {actions as messagesActions} from "../slices/messagesSlice"
import {actions as modalsActions} from "../slices/modalsSlice";

export default function ChannelList() {
    const channels = useSelector(state => state.channels.entities);
    const dispatch = useDispatch();
    const socketAPI = useSocketAPI();
    const onChangeChannel = (e, channelId) => {
        e.preventDefault();
        dispatch(channelsActions.updateCurrentChannelId(channelId));
    }
    const onRemoveChannel = (e, channelId) => {
        e.preventDefault();
        const channelToDelete = channels.find((channel) => channel.id === channelId);
        if (channelToDelete.removable) {
            socketAPI.removeChannel(channelId);
            dispatch(messagesActions.removeChannelMessages(channelId));
            dispatch(modalsActions.changeCurrentModal('remove'));
        }
    }
    const onRenameChannel = (e, id, name) => {
        e.preventDefault();
        dispatch(modalsActions.changeCurrentModal('rename'));
        dispatch(channelsActions.updateChannelToRename({id, name}));
    }

    const onChannelAdd = (e) => {
        e.preventDefault();
        dispatch(modalsActions.changeCurrentModal('add'));
    }

    return (
        <div className="col-2 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex" id="channel-list">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4"><b>Каналы</b>
                <button onClick={(e) => {
                    onChannelAdd(e)
                }} type="button" className="p-0 text-primary btn btn-group-vertical">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20"
                         fill="currentColor">
                        <path
                            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path>
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                    </svg>
                    <span className="visually-hidden">+</span>
                </button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                {channels.map((channel) =>
                    <li key={channel.id} className="nav-item w-100">
                        <button onClick={(e) => {
                            onChangeChannel(e, channel.id)
                        }} type="button" className="vw-80 rounded-0 text-start btn btn-secondary"><span
                            className="me-1">#</span>{`${channel.name}`}
                        </button>
                        <button onClick={(e) => {
                            onRemoveChannel(e, channel.id)
                        }} type="button" className="p-0 text-primary btn btn-group-vertical">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                <rect width="20" height="20" fill="none" stroke="red"></rect>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" x="3"
                                     y="3" fill="red">
                                    <g transform="translate(1, 1)">
                                        <path
                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                        <path
                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                                    </g>
                                </svg>
                            </svg>
                            <span className="visually-hidden">+</span>
                        </button>
                        <button onClick={(e) => {
                            onRenameChannel(e, channel.id, channel.name)
                        }} type="button" className="p-0 text-primary btn btn-group-vertical">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                <rect width="20" height="20" fill="none" stroke="black"></rect>
                                <g transform="translate(2, 2) scale(0.6)">
                                    <path
                                        d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/>
                                </g>
                            </svg>
                            <span className="visually-hidden">+</span>
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}