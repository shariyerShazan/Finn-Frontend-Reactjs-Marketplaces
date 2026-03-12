/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

export const generatePurchaseInvoice = (item: any) => {
  const doc = new jsPDF();

  // Header Decorator
  doc.setFillColor(30, 41, 59); // Dark Slate Color
  doc.rect(0, 0, 210, 50, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("PURCHASE RECEIPT", 14, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${item.stripeId.toUpperCase()}`, 14, 35);
  doc.text(`Date: ${moment(item.createdAt).format("DD MMMM YYYY")}`, 14, 40);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PURCHASED BY:", 14, 65);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${item.buyer?.firstName} ${item.buyer?.lastName}`, 14, 72);
  doc.text(`Email: ${item.buyer?.email}`, 14, 78);

  autoTable(doc, {
    startY: 90,
    head: [["Description", "Qty", "Unit Price", "Total Amount"]],
    body: [
      [
        item.ad?.title || "Product Purchase",
        "01",
        `$${item.totalAmount.toFixed(2)}`,
        `$${item.totalAmount.toFixed(2)}`,
      ],
    ],
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    styles: { fontSize: 10, cellPadding: 6, halign: "center" },
    columnStyles: { 0: { halign: "left", cellWidth: 100 } },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Paid: $${item.totalAmount.toFixed(2)}`, 140, finalY);

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Thank you for your purchase!", 105, 280, { align: "center" });

  doc.save(`Receipt_${item.stripeId.substring(0, 10)}.pdf`);
};
