import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CalendarHome from './Pages/CalendarHome';
import EventsPage from './Pages/EventsPage';
// import DatePage from './components/DatePage'; // Create this page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarHome />} />
        <Route path="/date/:date" element={<EventsPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
