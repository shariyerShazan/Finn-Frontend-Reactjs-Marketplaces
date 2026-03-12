// /* eslint-disable @typescript-eslint/no-explicit-any */
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import moment from "moment";

// export const generatePrettyInvoice = (item: any) => {
//   const doc = new jsPDF();

//   doc.setFillColor(0, 100, 174);
//   doc.rect(0, 0, 210, 50, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(24);
//   doc.setFont("helvetica", "bold");
//   doc.text("INVOICE", 14, 25);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Transaction ID: ${item.stripeId.toUpperCase()}`, 14, 35);
//   doc.text(`Date: ${moment(item.createdAt).format("DD MMMM YYYY")}`, 14, 40);

//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("BILL TO:", 14, 65);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text(`${item.buyer?.firstName} ${item.buyer?.lastName}`, 14, 72);
//   doc.text(`Email: ${item.buyer?.email}`, 14, 78);

//   autoTable(doc, {
//     startY: 90,
//     head: [["Product Details", "Base Price", "Platform Fee", "Total Earning"]],
//     body: [
//       [
//         item.ad?.title,
//         `$${item.totalAmount.toFixed(2)}`,
//         `-$${item.adminFee.toFixed(2)}`,
//         `$${item.sellerAmount.toFixed(2)}`,
//       ],
//     ],
//     headStyles: {
//       fillColor: [0, 100, 174],
//       textColor: [255, 255, 255],
//       fontSize: 11,
//       fontStyle: "bold",
//       halign: "center",
//     },
//     styles: {
//       fontSize: 10,
//       cellPadding: 6,
//       halign: "center",
//     },
//     columnStyles: {
//       0: { halign: "left", cellWidth: 80 },
//     },
//     theme: "striped",
//   });

//   const finalY = (doc as any).lastAutoTable.finalY + 15;
//   doc.setDrawColor(230, 230, 230);
//   doc.line(130, finalY, 196, finalY);

//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("Total Net Earnings:", 130, finalY + 10);
//   doc.setTextColor(0, 100, 174);
//   doc.text(`$${item.sellerAmount.toFixed(2)}`, 175, finalY + 10);

//   doc.setFontSize(9);
//   doc.setTextColor(150);
//   doc.setFont("helvetica", "italic");
//   doc.text(
//     "Thank you for your business. For any queries, contact support.",
//     105,
//     280,
//     { align: "center" },
//   );

//   doc.save(`Invoice_${item.stripeId.substring(0, 10)}.pdf`);
// };
