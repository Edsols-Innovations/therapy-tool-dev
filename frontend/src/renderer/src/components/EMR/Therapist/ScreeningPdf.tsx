import React from 'react'
import { jsPDF } from 'jspdf'
import { FaSave } from 'react-icons/fa'

interface ScreeningData {
  id: number
  date: string // ISO date string
  age_group: string
  screening_data: Record<string, Record<string, string>>
  doctor_comment: string // HTML content for doctor's comment
}

interface PatientData {
  first_name: string
  last_name: string
  age: number // or string
}

// Minimal ISO date -> readable date function
function formatDate(isoDate: string): string {
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

// Very naive HTML stripper if you want plain text.
// (If you want HTML rendered, that requires additional logic or a plugin.)
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

interface ScreeningPdfProps {
  patient: PatientData
  screening: ScreeningData
}

/**
 * Component that shows a "Save as PDF" button. When clicked,
 * it generates a PDF of the screening details (including color-coded answers).
 */
const ScreeningPdf: React.FC<ScreeningPdfProps> = ({ patient, screening }) => {
  /**
   * Save screening data as a PDF using jsPDF (bypassing print dialog).
   */
  const handleSaveAsPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter'
    })

    let currentY = 60
    const marginLeft = 50
    const lineHeight = 20
    const pageWidth = doc.internal.pageSize.getWidth()

    // 1. Title: Name + Age
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text(`${patient.first_name} ${patient.last_name} - ${patient.age} years old`, marginLeft, currentY)
    currentY += lineHeight

    // 2. Screening date
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Screening Date: ${formatDate(screening.date)}`, marginLeft, currentY)
    currentY += lineHeight

    // 3. Subheading for Screening Results
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    currentY += 10
    doc.text('Screening Results', marginLeft, currentY)
    currentY += lineHeight

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    // For each category, print subheading, then each question on separate lines
    Object.entries(screening.screening_data).forEach(([category, questions]) => {
      currentY += 10
      // Category subheading
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text(category.charAt(0).toUpperCase() + category.slice(1), marginLeft, currentY)
      currentY += lineHeight - 4

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)

      // Now each question -> answer
      Object.entries(questions).forEach(([question, ans]) => {
        // Color-code the answer
        const answer = ans.toLowerCase()
        if (answer === 'yes') {
          doc.setTextColor(0, 150, 0) // green
        } else if (answer === 'no') {
          doc.setTextColor(200, 0, 0) // red
        } else {
          doc.setTextColor(0, 0, 0)   // black
        }

        const lineText = `• ${question}: ${answer.charAt(0).toUpperCase() + answer.slice(1)}`
        doc.text(lineText, marginLeft + 20, currentY)
        currentY += lineHeight

        // revert color to black
        doc.setTextColor(0, 0, 0)

        // If we get near bottom, you might want to add doc.addPage() logic
        // For brevity, not shown here
      })
    })

    currentY += 10

    // 4. Doctor’s Comment
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text("Doctor's Comment", marginLeft, currentY)
    currentY += lineHeight

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)

    const docComment = stripHtml(screening.doctor_comment)
    const commentLines = doc.splitTextToSize(docComment, pageWidth - marginLeft * 2)
    commentLines.forEach((line) => {
      doc.text(line, marginLeft, currentY)
      currentY += lineHeight
    })
    
    
    doc.save(`${patient.first_name} ${patient.last_name} screening-data.pdf`)
  }

  return (
    <div className="bg-white p-4">
      <button
        onClick={handleSaveAsPDF}
        className="fixed bottom-8 right-8 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
      >
        <FaSave className="text-2xl" />
      </button>
    </div>
  )
}

export default ScreeningPdf
