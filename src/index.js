import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import init from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const run = async () => {
  const clientSocket = io();
  root.render(
    await init(clientSocket),
  );
};

run();
