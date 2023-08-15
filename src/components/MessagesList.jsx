import React from 'react';

const MessagesList = ({ currMessages }) => (
  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
    { currMessages.map(({ id, username, body }) => (
      <div key={id}>
        <b>{ username }</b>
        { ': ' }
        { body }
      </div>
    )) }
  </div>
);

export default MessagesList;
