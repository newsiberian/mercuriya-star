import './App.css';
import { StarButton } from './StarButton.tsx';

function App() {
  const handleClick = () => {
    alert('clicked!');
  };

  return (
    <StarButton
      onClick={handleClick}
      text={<span className="star-button-title">Click on me!</span>}
    />
  );
}

export default App;
