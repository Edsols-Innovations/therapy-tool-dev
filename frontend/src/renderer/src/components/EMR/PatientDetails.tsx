// PatientDetails.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Therapist/Sidebar';
import PatientHistory from './Therapist/PatientHistory';
import Assessment from './Therapist/Assessment';
import AssessmentPage from './Therapist/AssessmentPage';
import Investigation from './Therapist/Investigation';
import InvestigationPage from './Therapist/InvestigationPage';
import ScreeningPage from './Therapist/Screening';
import LanguagePage from './Therapist/languagedetails';
import PatientHistoryDashboard from './Therapist/PatientHistoryDashboard';
import ScreeningForm from './Therapist/ScreeningForm';
import Language from './Therapist/Language';
import Therapyware from './Therapist/Therapyware';

const PatientDetails = () => {
  const location = useLocation();
  const stateFromLocation = location.state || {};
  const savedState = localStorage.getItem('patientState');
  const patientState = stateFromLocation || (savedState ? JSON.parse(savedState) : {});

  const initialMode = patientState?.mode || 'existing';
  const patientId = patientState?.id || null;
  const role = patientState?.role || null;

  const userState = JSON.parse(localStorage.getItem('userState') || '{}')
  const name = userState?.name || location.state?.name
  const userId = userState?.id || location.state?.id
  const loggedInUser = {
    id: patientState?.id || null,
    role,
  };


  const [activeView, setActiveView] = useState(() => localStorage.getItem('activeView') || 'patient-profile');
  const [mode, setMode] = useState(initialMode);

  const handlePatientStateSave = (updatedData) => {
    localStorage.setItem('patientState', JSON.stringify(updatedData));
      console.log('Patient state saved:', updatedData);
  };
  

  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem('mode', mode);
    setActiveView(mode === 'existing' ? 'patient-profile' : 'patient-history');
  }, [mode]);

  const handleSidebarClick = (view) => {
    setActiveView(view);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="flex w-screen h-screen bg-blue-200">
      <Sidebar
        activeView={activeView}
        onClick={handleSidebarClick}
        mode={mode}
        onModeChange={handleModeChange}
        isAdding={mode === 'add'}
        role={role}
        roleId={userId}
        name={name}
      />
      <div className="flex-1 overflow-auto">
        {mode === 'existing' && patientId && (
          <>
            {activeView === 'patient-profile' && <PatientHistoryDashboard patientId={patientId} loggedInUser={loggedInUser} role={role}/>}
            {activeView === 'screening' && <ScreeningPage />}
            {activeView === 'language' && <LanguagePage />}
            {activeView === 'assessment' && <AssessmentPage />}
            {activeView === 'investigation' && <InvestigationPage />}
            {activeView === 'therapyware' && <Therapyware />}
            </>
        )}
        {mode === 'add' && (
          <>
            {activeView === 'patient-history' && <PatientHistory initialData={undefined} loggedInUser={loggedInUser} role={role} mode='add' onSubmit={handlePatientStateSave} />}
            {activeView === 'screening' && <ScreeningForm />}
            {activeView === 'language' && <Language />}
            {activeView === 'investigation' && <Investigation onUploadSuccess={function (): void {
              throw new Error('Function not implemented.');
            } } />}
            {activeView === 'assessment' && <Assessment />}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
