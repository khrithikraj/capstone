import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';

const NotesPage = () => {
  const [note, setNote] = useState('');
  const [notesList, setNotesList] = useState([]);

  // Function to handle adding notes
  const handleAddNote = () => {
    if (note.trim()) {
      setNotesList([...notesList, note]);
      setNote(''); // Clear input field
    }
  };

  return (
    <NotesPageStyled>
      <h1>Your Notes</h1>
      <div className="note-input">
        <textarea
          placeholder="Type your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <div className="submit-btn">
          <Button
            name={'Add Note'}
            onClick={handleAddNote}
            bPad={'.8rem 1.6rem'}
            bRad={'30px'}
            bg={'var(--color-accent)'}
            color={'#fff'}
          />
        </div>
      </div>

      <NotesListStyled>
        {notesList.map((note, index) => (
          <div key={index} className="note-item">
            <p>{note}</p>
          </div>
        ))}
      </NotesListStyled>
    </NotesPageStyled>
  );
};

const NotesPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;

  h1 {
    text-align: center;
    color: rgba(34, 34, 96, 1);
    font-size: 1.8rem;
  }

  .note-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    textarea {
      width: 100%;
      max-width: 500px;
      height: 100px;
      padding: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      resize: none;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      color: rgba(34, 34, 96, 0.9);
      &::placeholder {
        color: rgba(34, 34, 96, 0.4);
      }
    }

    .submit-btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const NotesListStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  .note-item {
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: rgba(34, 34, 96, 0.8);
  }
`;

export default NotesPage;
