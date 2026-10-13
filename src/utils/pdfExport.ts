import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PredictionResults } from '../types';
import { formatCompactNumber } from './calculator';

export function generatePdfWithAutoTable(results: PredictionResults): void {
  const {
    productData,
    parameters,
    viability,
    ordersPerCreator,
    cartToOrderRate,
    pSingleVideo,
    recommendedVideos,
    cumulativeTable,
    competitionStatus,
    demandStatus,
    strategicInsights,
  } = results;

  // Initialize A4 document (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Helper color palette (Clean White, Slate, Indigo, Emerald)
  const colors = {
    slate950: [15, 23, 42] as [number, number, number],
    slate800: [30, 41, 59] as [number, number, number],
    slate600: [71, 85, 105] as [number, number, number],
    slate400: [148, 163, 184] as [number, number, number],
    slate200: [226, 232, 240] as [number, number, number],
    slate50: [248, 250, 252] as [number, number, number],
    tiktokRed: [254, 44, 85] as [number, number, number],
    tiktokRedSoft: [255, 241, 244] as [number, number, number],
    tiktokDark: [18, 18, 18] as [number, number, number],
    tiktokCyan: [0, 180, 216] as [number, number, number],
    emerald600: [5, 150, 105] as [number, number, number],
    emerald50: [236, 253, 245] as [number, number, number],
    amber500: [245, 158, 11] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
  };

  let y = margin;

  // --- 1. HEADER SECTION ---
  // Top brand bar accent
  doc.setFillColor(...colors.tiktokRed);
  doc.rect(margin, y, contentWidth, 2, 'F');
  y += 6;

  // Brand Badge
  doc.setFillColor(...colors.slate950);
  doc.roundedRect(margin, y, 46, 6, 1.5, 1.5, 'F');
  doc.setTextColor(...colors.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('AFFILIATE PREDICTOR AI', margin + 3, y + 4.2);

  // Subtitle & Date
  doc.setTextColor(...colors.slate600);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Laporan Eksekutif Analisis Probabilitas & Saturasi', margin + 50, y + 4.2);

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setTextColor(...colors.slate600);
  doc.text(formattedDate, pageWidth - margin, y + 4.2, { align: 'right' });

  y += 10;

  // Product Name Title
  doc.setTextColor(...colors.slate950);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  
  // Truncate or wrap product title cleanly
  const titleLines = doc.splitTextToSize(productData.productName, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6.5;

  // Platform & Metadata subheader
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.slate600);
  const metaText = `Platform: ${productData.platform || 'TikTok Shop'}  •  ${productData.timePeriod || 'Data 7 Hari Terakhir'}  •  Zero Database (Client-Side Privacy Verified)`;
  doc.text(metaText, margin, y);

  y += 6;

  // --- 2. 4 METRIC STATS BOXES ---
  const statBoxWidth = (contentWidth - 9) / 4;
  const statBoxHeight = 18;
  const statMetrics = [
    { label: 'TOTAL PESANAN', value: productData.totalOrders.toLocaleString('id-ID'), compact: formatCompactNumber(productData.totalOrders) },
    { label: 'JUMLAH KREATOR', value: productData.totalCreators.toLocaleString('id-ID'), compact: formatCompactNumber(productData.totalCreators) },
    { label: 'CTR PRODUK', value: `${productData.ctrPercent.toFixed(1)}%`, compact: 'Rasio Klik' },
    { label: 'ADD TO CART', value: productData.cartAdds.toLocaleString('id-ID'), compact: formatCompactNumber(productData.cartAdds) },
  ];

  statMetrics.forEach((stat, idx) => {
    const boxX = margin + idx * (statBoxWidth + 3);
    
    // Background & border
    doc.setFillColor(...colors.slate50);
    doc.setDrawColor(...colors.slate200);
    doc.setLineWidth(0.3);
    doc.roundedRect(boxX, y, statBoxWidth, statBoxHeight, 2, 2, 'FD');

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...colors.slate600);
    doc.text(stat.label, boxX + statBoxWidth / 2, y + 5, { align: 'center' });

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...colors.slate950);
    doc.text(stat.value, boxX + statBoxWidth / 2, y + 11.5, { align: 'center' });

    // Subtext
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...colors.slate400);
    doc.text(stat.compact, boxX + statBoxWidth / 2, y + 15.5, { align: 'center' });
  });

  y += statBoxHeight + 7;

  // --- 2B. PRODUCT VIABILITY ASSESSMENT BOX ---
  const viabilityBoxHeight = 20;
  const isSangatLayak = viability.status === 'SANGAT_LAYAK';
  const isLayakBersyarat = viability.status === 'LAYAK_BERSYARAT';
  const statusColor: [number, number, number] = isSangatLayak
    ? colors.emerald600
    : isLayakBersyarat
    ? colors.amber500
    : [225, 29, 72];
  const statusBg: [number, number, number] = isSangatLayak
    ? colors.emerald50
    : isLayakBersyarat
    ? [254, 243, 199]
    : [255, 241, 242];

  doc.setFillColor(...statusBg);
  doc.setDrawColor(...statusColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, viabilityBoxHeight, 2, 2, 'FD');

  // Row 1: Title on left, Score & Badge on right (never collide)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.slate950);
  doc.text('SKOR KELAYAKAN PRODUK (PRODUCT VIABILITY):', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...statusColor);
  doc.text(`${viability.totalScore} / 100   [ ${viability.badgeText} ]`, pageWidth - margin - 4, y + 5.5, { align: 'right' });

  // Row 2: Recommendation message across full width
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...colors.slate800);
  const msgLines = doc.splitTextToSize(viability.recommendationMessage, contentWidth - 8);
  doc.text(msgLines, margin + 4, y + 10.5);

  // Row 3: Breakdown metrics cleanly aligned at the bottom
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...colors.slate600);
  const breakdownText = `Parameter Terbobot:  Demand (45%): ${viability.breakdown.demandScore}  •  Cart (35%): ${viability.breakdown.cartScore}  •  CTR (20%): ${viability.breakdown.ctrScore}`;
  doc.text(breakdownText, margin + 4, y + 16.5);

  y += viabilityBoxHeight + 7;

  // --- 3. MAIN HIGHLIGHT RECOMMENDATION CARD ---
  const calloutHeight = 25;
  doc.setFillColor(...colors.tiktokDark);
  doc.setDrawColor(...colors.tiktokRed);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, calloutHeight, 2.5, 2.5, 'FD');

  // Badge inside callout
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...colors.tiktokCyan);
  const targetPercentText = `${(parameters.targetConfidence * 100).toFixed(0)}%`;
  doc.text(`TARGET KEYAKINAN CLOSING ${targetPercentText}`, margin + 5, y + 6);

  // Big bold recommendation text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...colors.white);
  doc.text(`Unggah Minimal ${recommendedVideos} Video Variasi`, margin + 5, y + 13.5);

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...colors.slate200);
  const recDesc = `Berdasarkan estimasi ${parameters.views.toLocaleString('id-ID')} views/video dan Checkout CR ${parameters.checkoutCrPercent}%, Anda memerlukan ${recommendedVideos} video variasi untuk mencapai target closing.`;
  doc.text(doc.splitTextToSize(recDesc, contentWidth - 45), margin + 5, y + 18.5);

  // Stat Pill (Right side)
  const pillWidth = 36;
  const pillHeight = 17;
  const pillX = pageWidth - margin - pillWidth - 4;
  const pillY = y + 4.5;
  doc.setFillColor(...colors.tiktokDark);
  doc.setDrawColor(...colors.tiktokCyan);
  doc.setLineWidth(0.4);
  doc.roundedRect(pillX, pillY, pillWidth, pillHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(...colors.slate200);
  doc.text('P(Closing 1 Video)', pillX + pillWidth / 2, pillY + 5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.tiktokCyan);
  doc.text(`${(pSingleVideo * 100).toFixed(1)}%`, pillX + pillWidth / 2, pillY + 11.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...colors.slate400);
  doc.text('Peluang per video', pillX + pillWidth / 2, pillY + 15, { align: 'center' });

  y += calloutHeight + 7;

  // --- 4. MARKET SATURATION & DEMAND SUMMARY ---
  const halfWidth = (contentWidth - 4) / 2;
  const analysisBoxHeight = 16;

  // Saturation Box
  doc.setFillColor(...colors.slate50);
  doc.setDrawColor(...colors.slate200);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, halfWidth, analysisBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...colors.slate950);
  doc.text(`Saturasi: ${ordersPerCreator.toFixed(2)} Pesanan / Kreator`, margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...colors.slate600);
  const satDesc = competitionStatus.description.slice(0, 85) + '...';
  doc.text(doc.splitTextToSize(satDesc, halfWidth - 8), margin + 4, y + 10);

  // Demand Box
  doc.setFillColor(...colors.slate50);
  doc.setDrawColor(...colors.slate200);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + halfWidth + 4, y, halfWidth, analysisBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...colors.slate950);
  doc.text(`Cart CR: ${cartToOrderRate.toFixed(1)}% Checkout Keranjang`, margin + halfWidth + 8, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...colors.slate600);
  const demDesc = demandStatus.description.slice(0, 85) + '...';
  doc.text(doc.splitTextToSize(demDesc, halfWidth - 8), margin + halfWidth + 8, y + 10);

  y += analysisBoxHeight + 7;

  // --- 5. PROGRESSION TABLE USING autoTable ---
  const tableData = cumulativeTable.slice(0, 15).map((step) => {
    const isTarget = step.videoCount === recommendedVideos;
    return [
      `Video ke-${step.videoCount}${isTarget ? ' (TARGET)' : ''}`,
      `${(step.cumulativeProbability * 100).toFixed(1)}%`,
      `+${(step.incrementalGain * 100).toFixed(1)}%`,
      step.targetReached ? 'Tercapai (>= 90%)' : 'Belum Tercapai',
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['Jumlah Video', 'Probabilitas Kumulatif Closing', 'Kenaikan Probabilitas', `Status Target (${targetPercentText})`]],
    body: tableData,
    theme: 'plain',
    margin: { left: margin, right: margin },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      textColor: colors.slate800,
      cellPadding: 2.1,
      lineWidth: 0.1,
      lineColor: colors.slate200,
    },
    headStyles: {
      fillColor: colors.slate950,
      textColor: colors.white,
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold' },
      1: { cellWidth: 50, fontStyle: 'bold', halign: 'center' },
      2: { cellWidth: 40, halign: 'center', textColor: colors.slate600 },
      3: { halign: 'right' },
    },
    didParseCell: (data) => {
      // Highlight row for the recommended video
      const rowIndex = data.row.index;
      if (rowIndex === recommendedVideos - 1) {
        if (data.section === 'body') {
          data.cell.styles.fillColor = colors.tiktokRedSoft;
          data.cell.styles.textColor = colors.tiktokRed;
          data.cell.styles.fontStyle = 'bold';
        }
      } else if (data.section === 'body' && data.column.index === 3) {
        const text = String(data.cell.raw);
        if (text.includes('Tercapai')) {
          data.cell.styles.textColor = colors.emerald600;
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = colors.slate400;
        }
      }
    },
  });

  // Get new Y position after table
  // @ts-expect-error autoTable attaches lastAutoTable to doc
  y = (doc.lastAutoTable?.finalY || y + 70) + 7;

  // Check if we need to add a page or if strategy fits on page 1
  if (y > pageHeight - 45) {
    doc.addPage();
    y = margin;
  }

  // --- 6. STRATEGIC INSIGHTS GRID ---
  doc.setFillColor(...colors.slate950);
  doc.rect(margin, y, contentWidth, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...colors.white);
  doc.text('REKOMENDASI STRATEGI KONTEN KREATOR', margin + 3, y + 3.5);
  y += 7;

  const stratWidth = (contentWidth - 3) / 2;
  const stratHeight = 18;

  const strategies = [
    { title: 'Hook 3 Detik Pertama', text: strategicInsights.contentHook },
    { title: 'Taktik Melewati Saturasi', text: strategicInsights.competitionAngle },
    { title: 'Call to Action (CTA)', text: strategicInsights.callToAction },
    { title: 'Tempo & Jadwal Upload', text: strategicInsights.postingSchedule },
  ];

  strategies.forEach((strat, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const boxX = margin + col * (stratWidth + 3);
    const boxY = y + row * (stratHeight + 2.5);

    doc.setFillColor(...colors.slate50);
    doc.setDrawColor(...colors.slate200);
    doc.setLineWidth(0.2);
    doc.roundedRect(boxX, boxY, stratWidth, stratHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...colors.slate950);
    doc.text(strat.title, boxX + 3, boxY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...colors.slate600);
    const splitText = doc.splitTextToSize(strat.text, stratWidth - 6);
    doc.text(splitText.slice(0, 3), boxX + 3, boxY + 8);
  });

  // --- 7. FOOTER ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...colors.slate200);
    doc.setLineWidth(0.2);
    doc.line(margin, pageHeight - 8, pageWidth - margin, pageHeight - 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...colors.slate400);
    doc.text('Affiliate Predictor AI  •  Executive Intelligence Report', margin, pageHeight - 4.5);
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - margin, pageHeight - 4.5, { align: 'right' });
  }

  // Generate safe filename and trigger download
  const safeName = (productData.productName || 'Produk_Affiliate')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `Laporan_Affiliate_${safeName}_${dateStr}.pdf`;

  doc.save(fileName);
}
