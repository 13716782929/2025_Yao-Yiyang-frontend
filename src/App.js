import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS for styling

function App() {
    const [targetAmount, setTargetAmount] = useState('');
    const [denominations, setDenominations] = useState('');
    const [result, setResult] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!targetAmount || !denominations) {
                alert("Target amount and denominations cannot be empty!");
                return;
            }

            console.log("Target Amount (raw):", targetAmount);
            console.log("Denominations (raw):", denominations);

            const denomArray = denominations
                .split(',')
                .map((item) => parseFloat(item.trim()))
                .filter((item) => !isNaN(item));
            const target = parseFloat(targetAmount);

            console.log("Parsed Target Amount:", target);
            console.log("Parsed Denominations Array:", denomArray);

            if (isNaN(target) || denomArray.length === 0) {
                alert("Please enter valid target amount and denominations!");
                return;
            }

            const response = await axios.post(
                'http://localhost:8080/api/coins/minimum',
                denomArray,
                {
                    params: { targetAmount: target },
                }
            );

            setResult(response.data);
            setTargetAmount('');
            setDenominations('');
        } catch (error) {
            console.error('Error fetching data', error);
            if (error.response) {
                alert(`Request failed: ${error.response.data.message || 'Please check input parameters!'}`);
            } else if (error.request) {
                alert('Request not sent. Please check if the backend service is running!');
            } else {
                alert('An unknown error occurred. Please try again later!');
            }
        }
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Coin Calculator</h1>
            <form className="app-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Target Amount:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={targetAmount}
                        onChange={(e) => {
                            console.log("Target Amount Input:", e.target.value);
                            setTargetAmount(e.target.value);
                        }}
                        placeholder="e.g., 0.01"
                    />
                </div>
                <div className="form-group">
                    <label>Denominations (comma-separated):</label>
                    <input
                        type="text"
                        value={denominations}
                        onChange={(e) => {
                            console.log("Denominations Input:", e.target.value);
                            setDenominations(e.target.value);
                        }}
                        placeholder="e.g., 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 100, 1000"
                    />
                </div>
                <button className="submit-button" type="submit">Calculate</button>
            </form>
            {result.length > 0 && (
                <div className="result-container">
                    <h2>Result:</h2>
                    <ul>
                        {result.map((coin, index) => (
                            <li key={index}>{coin}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
