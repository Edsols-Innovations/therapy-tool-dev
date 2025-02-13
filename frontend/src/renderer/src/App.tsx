import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Landingpage from './components/Landingpage'
import VisualGamesM1 from './components/VisualGamesMod1'
import VisualGamesM2 from './components/VisualGamesMod2'
import TalkSplash from './components/VisualGames/Talksplash'
import TalkDuckling from './components/VisualGames/TalkDuckling'
import Speechflight from './components/VisualGames/Speechflight'
import EnlargingCircle from './components/VisualGames/EnlargingCircle'
import Voiceplay from './components/VisualGames/Voiceplay'
import Teddy from './components/VisualGames/Teddy'
import { SelectedModulesProvider  } from "./components/SelectedDataContext";

import Readinglab from './components/Readinglab'
import ReadingLabDisplay from './components/ReadingLabDisplay'
import Listeningstudio from './components/Listeningstudio'
import PSE from './components/PSE/Pse'
import PSE1 from './components/PSE/Pse1'
import Pseadd from './components/PSE/Pseadd'
import AnimatedFlashConcept from './components/Animatedflashconcept'

import Loginemr from './components/EMR/Login';
import PatientDetails from './components/EMR/PatientDetails';
import PatientList from './components/EMR/PatientList';
import AdminDashboard from './components/EMR/Administrator/AdminDashboard';
import Therapyselection from './components/EMR/Therapist/Therapyware';
import Language from './components/EMR/Therapist/Language';

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import VideoPlayerPage from './components/VideoPlayerPage'

function App() {
  return (
    <AuthProvider>
      <SelectedModulesProvider >
      <Router>
        <Routes>
          <Route path="/" element={<Loginemr />} />

          {/* Protect routes that require authentication */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Landingpage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/patientdetails"
            element={
              <ProtectedRoute>
                <PatientDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/language"
            element={
              <ProtectedRoute>
                <Language />
              </ProtectedRoute>
            }
          />

          <Route
            path="/videoplayer"
            element={
              <ProtectedRoute>
                <VideoPlayerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/therapy"
            element={
              <ProtectedRoute>
                <Therapyselection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patientlist"
            element={
              <ProtectedRoute>
                <PatientList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/visualgames-1"
            element={
              <ProtectedRoute>
                <VisualGamesM1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visualgames-2"
            element={
              <ProtectedRoute>
                <VisualGamesM2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talkduckling"
            element={
              <ProtectedRoute>
                <TalkDuckling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/speechflight"
            element={
              <ProtectedRoute>
                <Speechflight />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talksplash"
            element={
              <ProtectedRoute>
                <TalkSplash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enlargingcircle"
            element={
              <ProtectedRoute>
                <EnlargingCircle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voiceplay"
            element={
              <ProtectedRoute>
                <Voiceplay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teddy"
            element={
              <ProtectedRoute>
                <Teddy />
              </ProtectedRoute>
            }
          />

          <Route
            path="/readinglab"
            element={
              <ProtectedRoute>
                <Readinglab />
              </ProtectedRoute>
            }
          />
          <Route
            path="/readinglabplay"
            element={
              <ProtectedRoute>
                <ReadingLabDisplay />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listeningstudio"
            element={
              <ProtectedRoute>
                <Listeningstudio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pse"
            element={
              <ProtectedRoute>
                <PSE />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pse1"
            element={
              <ProtectedRoute>
                <PSE1 />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pseaddnew"
            element={
              <ProtectedRoute>
                <Pseadd />
              </ProtectedRoute>
            }
          />

          <Route
            path="/afc"
            element={
              <ProtectedRoute>
                <AnimatedFlashConcept />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </SelectedModulesProvider >
      
    </AuthProvider>
  )
}

export default App
