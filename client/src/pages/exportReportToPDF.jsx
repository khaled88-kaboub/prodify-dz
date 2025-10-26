import jsPDF from "jspdf";
import "jspdf-autotable";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export const exportReportToPDF = (reportData) => {
  const doc = new jsPDF();

  // Exemple d’en-tête moderne
  doc.setFontSize(18);
  doc.text("📊 Production Manager - Rapport de Production", 14, 20);

  doc.setFontSize(12);
  doc.text(`Date : ${reportData.date}`, 14, 30);
  doc.text(`Ligne : ${reportData.ligneProduction}`, 14, 38);
  doc.text(`Catégorie : ${reportData.categorieProduit}`, 14, 46);
  doc.text(`Produit : ${reportData.produit}`, 14, 54);
  doc.text(`Shift : ${reportData.shift}`, 14, 62);

  // Exemple de tableau
  doc.autoTable({
    startY: 70,
    head: [["Nombre de cartons", "Déchets (kg)", "Remarques"]],
    body: [[reportData.nombreCartons, reportData.dechetsKg, reportData.remarques || ""]],
  });

  // Exemple : petit graphique
  const canvas = document.createElement("canvas");
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Production", "Déchets"],
      datasets: [
        {
          label: "Production",
          data: [reportData.nombreCartons, reportData.dechetsKg],
          backgroundColor: ["#4CAF50", "#FF5733"],
        },
      ],
    },
  });

  const chartImage = canvas.toDataURL("image/png");
  doc.addImage(chartImage, "PNG", 14, doc.lastAutoTable.finalY + 10, 180, 80);

  doc.save(`Rapport_${reportData.date}.pdf`);
};
