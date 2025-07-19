import React, { useState } from 'react';
import './App.css';
import Wheel from './components/Wheel';
import InputForm from './components/InputForm';
import ResultModal from './components/ResultModal';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alreadySpun, setAlreadySpun] = useState(false);

  const uniqueID = `${email.trim().toLowerCase()}-${phone.trim()}`;

  const handleStart = () => {
    if (name && email && phone) {
      const storedResult = localStorage.getItem(uniqueID);
      if (storedResult && storedResult !== 'pending') {
        setResult(storedResult);
        setAlreadySpun(true);
        setShowModal(true);
        setHasStarted(true);
        return;
      }
      //localStorage.setItem(uniqueID, 'pending');
      setHasStarted(true);
    }
  };

  const handleResult = (prize: string) => {
    localStorage.setItem(uniqueID, prize);
    setResult(prize);
    setAlreadySpun(false);
    setShowModal(true);
  };

  return (
    <div className="App">
      {!hasStarted ? (
        <>
          <h1>V Elements Spa and Wellness</h1>
          <p>
            Experience the thrill of relaxation with our V Elements Spa Spinning Wheel! 🎉<br />
            Spin to win exclusive rewards like free add-ons, discounts, extended massage minutes, or complimentary services. ✨
          </p>
          <InputForm
            name={name} email={email} phone={phone}
            setName={setName} setEmail={setEmail} setPhone={setPhone}
            onStart={handleStart}
          />
        </>
      ) : (
        <>
          <h1>V Elements Spa Spinning Wheel Result</h1>
          <h2 style={{ marginBottom: '10px', marginTop: '20px' }}>🎡 Spin the Wheel!</h2>
          <Wheel user={{ name, email, phone }} onResult={handleResult} />
          {showModal && result && (
            <ResultModal
              name={name}
              email={email}
              prize={result}
              alreadySpun={alreadySpun}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;