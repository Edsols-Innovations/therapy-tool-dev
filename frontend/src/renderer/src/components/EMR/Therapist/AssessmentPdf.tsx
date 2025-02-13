import React from 'react'
import { jsPDF } from 'jspdf'
import { FaSave } from 'react-icons/fa'

interface AssessmentDetailsPdfProps {
  assessment: {
    id: number
    date: string
    content: string // HTML content
    taken_by: string
    role: string // Role (Doctor or Therapist)
  }
  patient: {
    first_name: string
    last_name: string
  }
}

const formatDate = (isoDate: string): string => {
  const dateObj = new Date(isoDate)
  return dateObj.toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]+>/g, '').trim()
}

const AssessmentPdf: React.FC<AssessmentDetailsPdfProps> = ({ assessment, patient }) => {
  const handleSaveAsPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    })

    const marginLeft = 50
    let currentY = 60
    const lineHeight = 20
    const pageWidth = doc.internal.pageSize.getWidth()

    // Add Patient Name and Assessment Date
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(`${patient.first_name} ${patient.last_name}`, marginLeft, currentY)
    currentY += lineHeight

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Assessment Date: ${formatDate(assessment.date)}`, marginLeft, currentY)
    currentY += lineHeight

    // Add Taken By Details
    doc.text(`Taken By: ${assessment.taken_by} (${assessment.role})`, marginLeft, currentY)
    currentY += lineHeight * 1.5

    // Add Assessment Content
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('Assessment Details', marginLeft, currentY)
    currentY += lineHeight

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    const assessmentContent = stripHtml(assessment.content)
    const contentLines = doc.splitTextToSize(assessmentContent, pageWidth - marginLeft * 2)
    contentLines.forEach((line) => {
      doc.text(line, marginLeft, currentY)
      currentY += lineHeight

      // Add a new page if near the bottom
      if (currentY > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage()
        currentY = 60
      }
    })

    // Save PDF
    doc.save(`${patient.first_name}_${patient.last_name}_assessment.pdf`)
  }

  return (
    <div>
      <button
        onClick={handleSaveAsPDF}
        className="fixed bottom-8 right-8 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
      >
        <FaSave className="text-2xl" />
      </button>
    </div>
  )
}

export default AssessmentPdf
