// components/InputForm.tsx
import React from 'react';
import './InputForm.css';

interface Props {
    name: string;
    email: string;
    phone: string;
    setName: (val: string) => void;
    setEmail: (val: string) => void;
    setPhone: (val: string) => void;
    onStart: () => void;
}

const InputForm: React.FC<Props> = ({
    name,
    email,
    phone,
    setName,
    setEmail,
    setPhone,
    onStart
}) => (
    <div className="form-section">
        <label htmlFor="name">Name</label>
        <input
            id="name"
            name="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
        />

        <label htmlFor="email">Email</label>
        <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
        />

        <label htmlFor="phone">Phone</label>
        <input
            id="phone"
            name="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
        />

        <button onClick={onStart}>Start</button>
    </div>
);

export default InputForm;
