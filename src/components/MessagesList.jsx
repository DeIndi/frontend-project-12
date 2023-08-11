import React from 'react';

const MessagesList = ({ currMessages }) => {
  console.log('currMessages: ', currMessages);
  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
      { /* eslint-disable-next-line react/destructuring-assignment */}
      { currMessages.map(({ id, username, body }) => (
        <div key={id}>
          <b>{ username }</b>
          { ': ' }
          { body }
        </div>
      )) }
    </div>
  );
};

export default MessagesList;
