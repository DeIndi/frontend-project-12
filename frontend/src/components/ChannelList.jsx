import React, {useState} from "react";
import {useSelector} from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChannelList() {
    const channels = useSelector(state => state.channels.entities);
    return (
        <div className="col-2 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex" id="channel-list">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4"><b>Каналы</b>
            </div>
                <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                    {channels.map((channel) =>
                        <li key={channel.id} className="nav-item w-100">
                            <button type="button" className="w-100 rounded-0 text-start btn btn-secondary"><span
                                className="me-1">#</span>{`${channel.name}`}
                            </button>
                        </li>
                    )}
                </ul>
            </div>
    );
}