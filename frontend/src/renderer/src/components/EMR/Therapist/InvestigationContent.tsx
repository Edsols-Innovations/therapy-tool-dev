// investigationContent.tsx

import React from 'react';
import { FaTimes } from 'react-icons/fa';

export interface Section {
  title: string;
}

export const sections: Section[] = [
  { title: "Hemogram" },
  { title: "Liver Function Test" },
  { title: "Renal Function Test" },
  { title: "Infectious Disease Tests" },
  { title: "Arterial Blood Gas/Venous Blood Gas" },
  { title: "Endocrine Evaluation" },
  { title: "Lipid Profile" },
  { title: "Procoagulant Tests" },
  { title: "Autoimmune Tests" },
  { title: "Cerebrospinal Fluid (CSF) Analysis" },
  { title: "Metabolic Disorders Tests" },
  { title: "Genetic Tests" },
  { title: "Electrophysiological Tests" },
  { title: "Radiology Tests" },
  // Add additional sections as needed...
];

interface SectionContentProps {
  handleDrop?: (e: React.DragEvent<HTMLDivElement>, scanType: string) => void;
  handleDragOver?: (e: React.DragEvent<HTMLDivElement>, scanType: string) => void;
  handleDragLeave?: () => void;
  handleFileInput?: (e: React.ChangeEvent<HTMLInputElement>, scanType: string) => void;
  handleRemoveFile?: (scanType: string) => void;
  files?: { [key: string]: any };
  draggedOver?: string | null;
}

export const sectionContent = [
  // Hemogram Section
  () => (
    <div key="hemogram" className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Hemogram</h3>

      {/* General Hemogram Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* All labels and inputs for Hemogram */}
        <label className="block text-sm font-light text-gray-600">
          Hemoglobin (Hb) (g/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          RBC Count (million/cumm):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          MCV (fL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          MCH (pg):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          MCHC (g/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Total WBC Count (cumm):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Neutrophils (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Lymphocytes (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Eosinophils (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Monocytes (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Basophils (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Platelet Count (cumm):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Peripheral Smear:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
      </div>

      {/* Iron Studies */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Iron Studies</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Serum Iron (µmol/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          TIBC (µmol/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Transferrin Saturation (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Ferritin (µg/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
          />
        </label>
      </div>

      {/* Hb Electrophoresis */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Hb Electrophoresis</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          HbA (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HbA2 (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HbF (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HbH (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HbS (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HbE (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>
    </div>
  ),

  // Liver Function Test Section
  () => (
    <div key="liver-function-test" className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Liver Function Test</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          ALT/SGPT (IU/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          AST/SGOT (IU/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          ALP (IU/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          GGTP (IU/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      {/* Bilirubin Section */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Bilirubin</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Bilirubin Total (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Direct Bilirubin (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Indirect Bilirubin (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      {/* Serum Protein Section */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Serum Protein</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Total Protein (g/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Albumin (g/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Globulin (g/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          A/G Ratio:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      {/* Coagulation Tests */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Coagulation Tests</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          PT (secs):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          aPTT (secs):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          INR:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>
    </div>
  ),

  // Renal Function Test Section
  () => (
    <div key="renal-function-test" className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Renal Function Test</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Serum Urea (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          BUN (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Creatinine (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      <h4 className="text-lg font-semibold text-gray-700 mt-8">Electrolytes</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Serum Sodium (mEq/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Potassium (mEq/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Calcium (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Phosphorus (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Uric Acid (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>
    </div>
  ),

  // Infectious Disease Tests Section
  () => (
    <div key="infectious-disease-tests" className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Infectious Disease Tests</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          OptiMal Test (Positive/Negative):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Dengue IgM (Y/N):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Chickungunya IgM (Y/N):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Leptospirosis IgM (Y/N):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      {/* Baby Toxoplasma IgM Section */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Baby Toxoplasma IgM</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Toxoplasma IgM Titre:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Rubella IgM Titre:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          CMV IgM Titre:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HSV IgM Titre:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      {/* Additional Tests */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Additional Tests</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Blood Culture:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          CRP (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Procalcitonin (µg/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>
    </div>
  ),

  // Arterial Blood Gas/Venous Blood Gas Section
  () => (
    <div key="arterial-blood-gas" className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Arterial Blood Gas/Venous Blood Gas</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          pH:
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          PaCO2 (mmHg):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          PaO2 (mmHg):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HCO3- (mEq/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Base Excess (mmol/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          O2 Saturation (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          Lactate (mmol/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>
    </div>
  ),

  // Endocrine Evaluation Section
  () => (
    <div key="endocrine-evaluation" className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Endocrine Evaluation</h3>

      {/* Blood Sugar Levels */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Blood Sugar Levels</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          Fasting (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          PLBS (mg/dL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          HbA1c (%):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      {/* Thyroid Function Tests */}
      <h4 className="text-lg font-semibold text-gray-700 mt-8">Thyroid Function Tests</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-light text-gray-600">
          TSH (mIU/L):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
        <label className="block text-sm font-light text-gray-600">
          T3 (ng/mL):
          <input
            type="text"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>
    </div>
  ),

  // Continue adding all other sections in the same way, including all labels and inputs as in your original code

  // Radiology Tests Section
  (props: SectionContentProps) => (
    <div key="radiology-tests" className="space-y-6">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Radiology Tests</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { scanType: 'XRay', label: 'X Ray' },
          { scanType: 'USG', label: 'USG' },
          { scanType: '2DECHO', label: '2D ECHO' },
          { scanType: 'CTBrain', label: 'CT Brain' },
          { scanType: 'MRIBrain', label: 'MRI Brain' },
          { scanType: 'MRSpectroscopyBrain', label: 'MR Spectroscopy Brain' },
          { scanType: 'MRAngiogramBrain', label: 'MR Angiogram Brain' },
          { scanType: 'MRVenogramBrain', label: 'MR Venogram Brain' },
          { scanType: 'DSA', label: 'Digital Subtraction Angiogram (DSA)' },
        ].map(({ scanType, label }) => (
          <div
            key={scanType}
            onDrop={(e) => props.handleDrop && props.handleDrop(e, scanType)}
            onDragOver={(e) => props.handleDragOver && props.handleDragOver(e, scanType)}
            onDragLeave={props.handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition duration-300 ${
              props.draggedOver === scanType ? 'border-blue-700 bg-blue-100 opacity-75' : 'border-gray-300'
            }`}
          >
            {props.files && props.files[scanType] ? (
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{props.files[scanType]?.file.name}</span>
                <button
                  onClick={() => props.handleRemoveFile && props.handleRemoveFile(scanType)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">{label}</h4>
                <input
                  type="file"
                  onChange={(e) => props.handleFileInput && props.handleFileInput(e, scanType)}
                  className="hidden"
                  id={`${scanType}-file-input`}
                />
                <label htmlFor={`${scanType}-file-input`} className="cursor-pointer text-gray-500">
                  <span className="text-blue-500 underline">Click to select</span> or drag & drop {label} files here
                </label>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  ),
];

