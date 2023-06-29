import ReactDOM from 'react-dom/client';
import init from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const run = async () => {
  root.render(
    await init(),
  );
};

run();
