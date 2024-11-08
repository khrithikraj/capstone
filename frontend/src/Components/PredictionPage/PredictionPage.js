import React, { useState } from 'react';
import Button from '../Button/Button';
import styled from 'styled-components';
import { saveAs } from 'file-saver';

const PredictionPage = () => {
  const [year, setYear] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentYear = new Date().getFullYear();
    
    // Allow years from 2000 up to 2100 for prediction
    if (!year || isNaN(year) || year < 2000) {
      setError(`Please enter a valid year: `);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/v1/predict-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year }),
      });

      if (response.ok) {
        const data = await response.json();
        setPredictions(data);
        setError('');
      } else {
        setError('Failed to fetch predictions.');
      }
    } catch (error) {
      setError('Error occurred while fetching predictions.');
    } finally {
      setLoading(false);
    }
  };

  // Function to download predictions as CSV
  const downloadCSV = () => {
    const csvContent = 
      "Month,Category,Prediction\n" +
      predictions.map(pred => `${pred.month},${pred.category},${pred.prediction}`).join("\n");

    // Create a Blob from the CSV content and use FileSaver to save it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "predictions.csv");
  };

  // Function to split predictions into chunks of 9
  const chunkPredictions = (predictions, chunkSize = 9) => {
    const result = [];
    for (let i = 0; i < predictions.length; i += chunkSize) {
      result.push(predictions.slice(i, i + chunkSize));
    }
    return result;
  };

  // Get grouped predictions
  const groupedPredictions = chunkPredictions(predictions);

  return (
    <div>
      

      <PredictionPageStyled onSubmit={handleSubmit}>
      <h1>Expense Predictions for Year</h1>
        <input
          type="text"
          placeholder="Enter year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <div className="submit-btn">
          <Button 
            name={'Submit'}
            bPad={'.8rem 1.6rem'}
            bRad={'30px'}
            bg={'var(--color-accent)'}
            color={'#fff'}
          />
        </div>
      </PredictionPageStyled>

      {loading && <p>Loading predictions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {groupedPredictions.length > 0 && (
        <div>
          <PredictionListStyled>
            {groupedPredictions.map((group, index) => (
              <div key={index} className="prediction-group">
                {/* Display month header for each group */}
                <div className="month-header">
                  {group[0].month} {/* Display the month for each group */}
                </div>
                <div className="prediction-box">
                  {group.map((prediction, idx) => (
                    <div key={idx} className="prediction-item">
                      <span>{prediction.category}</span>
                      <p>₹{prediction.prediction.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="export-btn">
            <Button 
              name={'Export as CSV'}
              onClick={downloadCSV}
              bPad={'.8rem 1.6rem'}
              bRad={'30px'}
              bg={'var(--color-green)'}
              color={'#fff'}
            />
          </div>
          </PredictionListStyled>

          
        </div>
      )}
    </div>
  );
};

const PredictionPageStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
        width: 70%;
        margin: 0 auto;
    }

    h1,h2 {
        text-align: center;
        margin-top: 3rem;
        color: rgba(34, 34, 96, 1);
    }

    .submit-btn, .export-btn {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const PredictionListStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;

    .prediction-group {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .month-header {
        text-align: center;
        font-size: 1.5rem;
        color: var(--color-accent);
        margin-bottom: 1rem;
        font-weight: bold;
    }

    .prediction-box {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* Three columns for each box */
        gap: 1rem;
        background: #f0f4f8;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

        @media (max-width: 768px) {
            grid-template-columns: 1fr 1fr; /* Two columns for smaller screens */
        }

        @media (max-width: 500px) {
            grid-template-columns: 1fr; /* One column for very small screens */
        }
    }

    .prediction-item {
        background: #fff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .prediction-item span {
        font-weight: bold;
        color: rgba(34, 34, 96, 0.8);
    }

    .prediction-item p {
        margin-top: 0.5rem;
        color: rgba(34, 34, 96, 0.7);
    }
      .submit-btn, .export-btn {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export default PredictionPage;
