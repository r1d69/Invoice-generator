import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportInvoiceToPdf(elementId: string, invoiceNumber: string = 'Invoice'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found for PDF generation.`);
    return;
  }

  try {
    // Show temporary progress state or class if needed
    const canvas = await html2canvas(element, {
      scale: 2, // high DPI crisp rendering
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pageHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Handle multi-page if height exceeds A4 (297mm)
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const safeFilename = `${invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;
    pdf.save(safeFilename);
  } catch (error) {
    console.error('Error generating PDF via html2canvas:', error);
    // Fallback to browser print dialog
    window.print();
  }
}

export function printInvoice(): void {
  window.print();
}
