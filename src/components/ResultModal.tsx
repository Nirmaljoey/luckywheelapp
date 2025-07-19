import React from 'react';
import './ResultModal.css';

interface Props {
    name: string;
    email: string;
    prize: string;
    alreadySpun: boolean;
    onClose: () => void;
}

const ResultModal: React.FC<Props> = ({ name, email, prize, alreadySpun, onClose }) => (
    <div className="modal-backdrop">
        <div className="modal-box">
            {alreadySpun ? (
                <>
                    <h2>🔒 You already spun!</h2>
                    <h3>{name}</h3>
                    <p>{email}</p>
                    <p>Your result was:</p>
                    <h3>{prize}</h3>
                </>
            ) : (
                <>
                    <h2>🎉 Congratulations!</h2>
                    <h3>{name}</h3>
                    <p>{email}</p>
                    <p>You won:</p>
                    <h3>{prize}</h3>
                </>
            )}
            <button onClick={onClose}>Close</button>
        </div>
    </div>
);

export default ResultModal;