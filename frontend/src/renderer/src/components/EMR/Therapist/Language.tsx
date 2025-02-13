import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'

const BASE_URL = 'http://127.0.0.1:8000'; // Backend URL

type Question = {
  ageRange: string;
  items: string[];
};

const questions: Question[] = [
  {
    ageRange: "0-2 Months",
    items: [
      "Does the child move their limbs, eyes, or head in response to voices or noise?",
      "Does the child make throaty noises?",
    ],
  },
  {
    ageRange: "3-5 Months",
    items: [
      "Does the child vocalize when spoken or sung to?",
      "Does the child turn their head in the direction of voices and sounds?",
      "Does the child exhibit differentiated crying (e.g., different cries for hunger, discomfort, etc.)?",
      "Does the child respond to a bell laterally?",
    ],
  },
  {
    ageRange: "6-8 Months",
    items: [
      "Does the child vocalize rhythmic syllable chains?",
      "Does the child form syllable repetitions (e.g., 'ba-ba' or 'da-da')?",
      "Does the child produce distinct double syllables?",
      "Does the child respond to a bell by looking downwards?",
    ],
  },
  {
    ageRange: "9-11 Months",
    items: [
      "Does the child use appropriate intonation in jargon speech (babbling with intonation)?",
      "Does the child respond to simple questions (e.g., looking or smiling)?",
      "Does the child say 'mama' or 'dada' (even if not contextually correct)?",
      "Does the child inhibit their actions when told 'NO'?",
      "Does the child respond to one-step commands with a gesture (e.g., pointing or waving)?",
    ],
  },
  {
  ageRange: "12-15 Months",
  items: [
    "Does the child respond to one-step commands without the need for a gesture?",
    "Does the child say 'mama' or 'dada' correctly (contextually appropriate)?",
    "Does the child respond to a bell diagonally?",
    "Has the child spoken their first word?",
    "Does the child initiate gesture-based games (e.g., peek-a-boo)?",
    "Does the child point to a desired object to indicate their interest?",
  ],
},
{
  ageRange: "16-19 Months",
  items: [
    "Does the child express 'I want' or communicate similar needs verbally?",
    "Does the child form simple two-word sentences (e.g., 'Want toy')?",
    "Can the child point to major body parts or clothing items when asked?",
    "Does the child have a vocabulary of 5-8 words?",
    "Does the child point to desired toys or persons to express their interest?",
  ],
},
{
  ageRange: "20-30 Months",
  items: [
    "Can the child express at least two wants (e.g., 'Want milk' and 'Want ball')?",
    "Does the child use 20 words correctly?",
    "Can the child name 10 common objects (e.g., ball, cup, fan)?",
    "Does the child identify objects by name when asked?",
    "Can the child point to 5 body parts on themselves or a doll?",
    "Does the child listen to stories when read to?",
    "Does the child have a vocabulary of at least 50 words?",
    "Can the child point to objects described by their use (e.g., 'Show me what you drink from')?",
    "Does the child respond to two-step commands without gestures (e.g., 'Pick up the toy and put it on the table')?",
    "Does the child repeat words they hear while adults are talking?",
    "Does the child use pronouns like 'me' or 'you' (any usage)?",
  ],
},
{
  ageRange: "31-35 Months",
  items: [
    "Does the child understand at least two prepositions (e.g., 'in,' 'on')?",
    "Can the child use 10 action words (e.g., run, jump, eat)?",
    "Does the child combine three words to form sentences (e.g., 'I want cookie')?",
    "Does the child use plurals correctly (e.g., 'cats,' 'dogs')?",
    "Can the child narrate simple experiences (e.g., 'I went park')?",
  ],
},
];



const Language: React.FC = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [answers, setAnswers] = useState<Record<number, Record<string, string>>>({});
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [developmentAge, setDevelopmentAge] = useState(questions[0].ageRange); // Default to the first age range
    const location = useLocation()
    const userState = JSON.parse(localStorage.getItem('userState') || '{}')
    const roleId = userState?.id || location.state?.id
    const role = userState?.role || location.state?.role
    const savedState = localStorage.getItem('patientState')
    const patientState = savedState ? JSON.parse(savedState) : {}
  
    const doctor_id = role?.toLowerCase() === 'doctor' ? roleId : null
    const therapist_id = role?.toLowerCase() === 'therapist' ? roleId : null
  
    const handleAnswerChange = (sectionIndex: number, question: string, value: string) => {
      const updatedAnswers = { ...answers };
      if (!updatedAnswers[sectionIndex]) {
        updatedAnswers[sectionIndex] = {};
      }
      updatedAnswers[sectionIndex][question] = value;
      setAnswers(updatedAnswers);
  
      // Count "no" answers
      const noCount = Object.values(updatedAnswers[sectionIndex]).filter((ans) => ans === 'no').length;
      if (noCount >= 2) {
        // If two "no" answers, backtrack development age to the previous section (if applicable)
        const previousSection = sectionIndex > 0 ? sectionIndex - 1 : 0;
        setDevelopmentAge(questions[previousSection].ageRange);
        setCurrentSection(-1); // Go to the submit screen
      }
    };
  
    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        const languageData = {
            patient_id: patientState.id,
            age:  String(patientState.age) || 'unknown', // Use "unknown" if age is null or undefined
            language_data: Object.keys(answers).reduce((acc, sectionIndex) => {
                const ageRange = questions[Number(sectionIndex)].ageRange;
                acc[ageRange] = answers[Number(sectionIndex)];
                return acc;
            }, {}),
            development_age: developmentAge,
            doctor_id: doctor_id || null,
            therapist_id: therapist_id || null,
        };       
      
        console.log('Submitting Data:', languageData);
      
        try {
          const response = await fetch(`${BASE_URL}/language/save`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(languageData),
          });
      
          if (response.ok) {
            setResponseMessage('Assessment saved successfully!');
            console.log('Assessment saved successfully!');
            setAnswers({});
            setCurrentSection(0);
          } else {
            const errorData = await response.json();
            console.error('Error details from server:', errorData);
            setResponseMessage('Submission failed: ' + errorData.detail);
          }
        } catch (error) {
          console.error('Error saving assessment:', error);
          setResponseMessage('Failed to save assessment. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };
      
  
    const section = questions[currentSection];
  
    return (
      <div className="min-h-screen bg-blue-200 text-gray-800 p-6">
        <div className="max-w-full mx-auto bg-blue-100 rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Language Development Questionnaire</h1>
          {responseMessage && (
            <p className="mb-6 text-center text-lg font-medium text-green-600">{responseMessage}</p>
          )}
          {currentSection === -1 ? (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Assessment Complete</h2>
              <p className="text-lg mb-6">
                The child's development age is:{' '}
                <span className="font-semibold text-indigo-700">{developmentAge}</span>
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-indigo-700">
                  Age Range: {section.ageRange}
                </h2>
              </div>
              <div className="space-y-6">
                {section.items.map((question, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <p className="mb-2 font-medium">{question}</p>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${currentSection}-${idx}`}
                          value="yes"
                          checked={answers[currentSection]?.[question] === 'yes'}
                          onChange={() => handleAnswerChange(currentSection, question, 'yes')}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${currentSection}-${idx}`}
                          value="no"
                          checked={answers[currentSection]?.[question] === 'no'}
                          onChange={() => handleAnswerChange(currentSection, question, 'no')}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                {currentSection > 0 && (
                  <button
                    onClick={() => setCurrentSection(currentSection - 1)}
                    className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-600"
                  >
                    Back
                  </button>
                )}
                {currentSection < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-green-600 text-white px-6 py-2 rounded-lg shadow-md ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Finish and Submit'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default Language;