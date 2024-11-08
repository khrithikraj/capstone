import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import PredictionPage from './Components/PredictionPage/PredictionPage';
import NotesPage from './Components/NotesPage/NotesPage';
import ExpenseChartsPage from './Components/ExpenseChartsPage/ExpenseChartsPage'; // <-- Import the new ExpenseChartsPage component
import { useGlobalContext } from './context/globalContext';

function App() {
  const [active, setActive] = useState(1);

  const global = useGlobalContext();
  console.log(global);

  // Display different pages based on the active state
  const displayData = () => {
    if (active === 1 || active === 2) {
      return <Dashboard />;
    }
    if (active === 3) {
      return <Income />;
    }
    if (active === 4) {
      return <Expenses />;
    }
    if (active === 5) {
      return <PredictionPage />;
    }
    if (active === 6) {
      return <NotesPage />;
    }
    if (active === 7) {  // <-- Add condition for the ExpenseChartsPage
      return <ExpenseChartsPage />;
    }
    return <Dashboard />;
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>
          {displayData()}
        </main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
