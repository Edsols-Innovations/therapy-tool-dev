import { jsPDF } from 'jspdf';

/**
 * Convert a remote or local image URL into a Base64 string for jsPDF.
 * If your image is already base64, you can skip this function and pass it directly.
 */
async function loadImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed converting image to base64'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}

/**
 * handleSaveAsPDF
 *
 * Generates a polished PDF with:
 * - Profile image
 * - Basic Info
 * - Parent Info
 * - Antenatal & Birth History
 * ... all in a better formatted layout.
 *
 * @param formData - The entire patient form data object.
 * @param calculateAge - function(dob: string): number|string => calculates age from DOB.
 * @param getProfileImageUrl - function(filename: string|null): string => returns full image URL.
 */
export async function handleSaveAsPDF(
  formData: any,
  calculateAge: (dob: string) => number | string,
  getProfileImageUrl: (filename: string | null) => string
) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    // --- Some layout constants ---
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 60; // track vertical position

    // --- Header / Title Box ---
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, 70, 'F'); // Gray rectangle at top
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(60);
    doc.text('Patient Data', 40, 40);

    // --- Try embedding the profile image to the top-left area
    try {
      const imageUrl = getProfileImageUrl(formData.profile_image);
      const base64Img = await loadImageAsBase64(imageUrl);
      // Place image at (x=pageWidth-150, y=10, width=70, height=70) - top-right corner
      doc.addImage(base64Img, 'JPEG', pageWidth - 130, 10, 60, 60);
    } catch (err) {
      console.warn('Could not load profile image, continuing without it:', err);
    }

    // --- Go below the header area
    currentY = 90;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0); // black text

    // Helper function to place label-value pairs
    const lineHeight = 16;
    const labelWidth = 150; // how much space to give the label
    function printLine(label: string, value?: string | number | null) {
      if (value === null || value === undefined || value === '') {
        value = 'N/A';
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}`, 40, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(`${value}`, 40 + labelWidth, currentY);
      currentY += lineHeight;
    }

    // --- SECTION: Profile ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Profile', 40, currentY);
    currentY += lineHeight + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    printLine('Name:', `${formData.first_name || ''} ${formData.last_name || ''}`);
    printLine('Gender:', formData.sex);
    const dob = formData.dob
      ? new Date(formData.dob).toLocaleDateString()
      : 'N/A';
    printLine('DOB:', dob);
    printLine(
      'Age:',
      formData.dob ? `${calculateAge(formData.dob)} years` : 'N/A'
    );
    printLine('Residence:', formData.residence);

    currentY += 10; // small gap

    // --- SECTION: Basic Info ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Basic Information', 40, currentY);
    currentY += lineHeight + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    printLine(
      'Chronological Age (entry):',
      formData.chronological_age
        ? `${formData.chronological_age} years`
        : 'N/A'
    );
    printLine(
      'Gestational Age (entry):',
      formData.gestational_age
    );
    printLine('Pedigree:', formData.pedigree);
    printLine('Consanguinity:', formData.consanguinity);

    currentY += 10; // small gap

    // --- SECTION: Parents Info ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text("Parents' Information", 40, currentY);
    currentY += lineHeight + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Father
    doc.setFont('helvetica', 'bold');
    doc.text("Father's Information", 40, currentY);
    currentY += lineHeight + 4;
    doc.setFont('helvetica', 'normal');

    printLine('Name:', formData.father_name);
    printLine('Occupation:', formData.father_occupation);
    printLine('Contact:', formData.father_contact);
    printLine('Email:', formData.father_email);

    currentY += 10; // small gap

    // Mother
    doc.setFont('helvetica', 'bold');
    doc.text("Mother's Information", 40, currentY);
    currentY += lineHeight + 4;
    doc.setFont('helvetica', 'normal');

    printLine('Name:', formData.mother_name);
    printLine('Occupation:', formData.mother_occupation);
    printLine('Contact:', formData.mother_contact);
    printLine('Email:', formData.mother_email);

    currentY += 10; // small gap

    // --- SECTION: Antenatal & Birth History ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Antenatal & Birth History', 40, currentY);
    currentY += lineHeight + 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    printLine('Antenatal History:', formData.antenatal_history);
    printLine('Perinatal History:', formData.perinatal_history);
    printLine('Conception Mode:', formData.conception_mode);
    printLine('Delivery Mode:', formData.delivery_mode);
    printLine('Term:', formData.term);
    printLine('Cried at Birth:', formData.cried_at_birth);
    printLine('Birth Weight:', formData.birth_weight);
    printLine('Postnatal Complications:', formData.postnatal_complications);
    printLine('Breastfed Upto:', formData.breastfed_upto);

    // -------------- Finally, Save the PDF --------------
    doc.save(`${formData.first_name || ''} ${formData.last_name || ''} patient-data.pdf`);
  } catch (err) {
    console.error('Failed to create/save PDF:', err);
  }
}
