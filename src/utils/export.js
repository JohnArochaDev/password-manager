import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function exportToPDF(credentialArray) {
    const PDF = new jsPDF()

    //icon
    const img = new Image();
    img.src = '/shield-lock-line-icon.png';

    img.onload = function() {
        // Add the image to the PDF
        PDF.addImage(img, 'PNG', 10, 16, 7, 7);

        //title
        PDF.setFontSize(18)
        PDF.text('SAFEPASS', 20, 22)

        //subtitle
        PDF.setFont('helvetica', 'normal')
        PDF.setFontSize(12)
        PDF.setTextColor(100)
        PDF.text('Exported Passwords', 14, 30)

        //table
        const tableColumn = ["Website", "Username", "Password"]
        const tableRows = []

        credentialArray.forEach((password => {
            const passwordArr = [
                password.website,
                password.username,
                password.password
            ]
            tableRows.push(passwordArr)
        }))

        PDF.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: {fillColor: [22, 160, 133]},
            alternateRowStyles: { fillColor: [240, 240, 240] },
            styles: { fontSize: 10 }
        })

        //footer
        const pageCount = PDF.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            PDF.setPage(i);
            const pageWidth = PDF.internal.pageSize.width;
            const text = `Page ${i} of ${pageCount}`;
            const textWidth = PDF.getStringUnitWidth(text) * PDF.internal.getFontSize() / PDF.internal.scaleFactor;
            const textOffset = (pageWidth - textWidth) / 2;
            PDF.text(text, textOffset, PDF.internal.pageSize.height - 10);
        }

        //save
        PDF.save('passwords.pdf');
    }
}