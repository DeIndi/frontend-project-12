import React from "react";
import {useDispatch, useSelector} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import {actions as channelsActions} from "../slices/channelsSlice"
import {actions as modalsActions} from "../slices/modalsSlice";
import {useTranslation} from 'react-i18next';
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";

export default function ChannelList() {
    const {t} = useTranslation();
    const channels = useSelector(state => state.channels.entities);
    const currentChannelId = useSelector(state => state.channels.currentChannelId);
    const dispatch = useDispatch();
    const onChangeChannel = (e, channelId) => {
        e.preventDefault();
        dispatch(channelsActions.updateCurrentChannelId(channelId));
    }
    const onRemoveChannel = (e, id) => {
        e.preventDefault();
        const channel = channels.find((channel) => channel.id === id);
        dispatch(modalsActions.openModal({modal: 'remove', data: {id, channel}}));
    }
    const onRenameChannel = (e, id, name) => {
        e.preventDefault();
        dispatch(modalsActions.openModal({modal: 'rename', data: {id, name}}));
    }

    const onChannelAdd = (e) => {
        e.preventDefault();
        dispatch(modalsActions.openModal({modal: 'add'}));
    }

    return (
        <div className="col-2 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex" id="channel-list">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4"><b>{t('channelList.channels')}</b>
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
                        <Dropdown as={ButtonGroup} className="d-flex">
                            <Button
                                onClick={(e) => {
                                    onChangeChannel(e, channel.id)
                                }}
                                type="button"
                                className={`vw-80 rounded-0 text-start text-truncate btn ${currentChannelId === channel.id ? "btn-secondary": "btn-light"} flex-grow-1`}>
                                <span className="me-1">#</span>
                                {`${channel.name}`}
                            </Button>
                            <Dropdown.Toggle split className={`flex-grow-0 overflow-visible ${currentChannelId === channel.id ? "btn-secondary": "btn-light"}`}>
                                <span className="visually-hidden btn-secondary">{t('channels.menu')}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className={ `overflow-visible ${currentChannelId === channel.id ? "btn-secondary": "btn-light"}` }>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        onRenameChannel(e, channel.id, channel.name)
                                    }}
                                    >
                                    {t('channelModal.rename')}
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={(e) => {
                                        onRemoveChannel(e, channel.id)
                                    }}
                                    >
                                    {t('channelModal.remove')}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                )}
            </ul>
        </div>
    );
}