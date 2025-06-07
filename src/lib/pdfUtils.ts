import jsPDF from 'jspdf';

interface ShoppingItem {
  productName?: string;
  item?: string;
  suggestedQuantity?: number;
  quantity?: number;
  unit: string;
  supplier: string;
  estimatedCost?: number;
  cost?: number;
}

interface ConsumptionItem {
  item: string;
  consumed: number;
  unit: string;
  cost: number;
  percentage: number;
}

interface MovementSummary {
  totalEntries: number;
  totalExits: number;
  totalLosses: number;
  totalValueIn: number;
  totalValueOut: number;
  totalValueLost: number;
}

// Utilitário para gerar PDF da lista de compras
export const generateShoppingListPDF = (items: ShoppingItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header da empresa
  doc.setFillColor(237, 125, 49); // Cor laranja do tema
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('🍽️ StockFood - Lista de Compras', 20, 20);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  // Data de geração
  const today = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerado em: ${today}`, pageWidth - 60, 40);
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 45, pageWidth - 20, 45);
  
  let yPosition = 60;
  
  // Cabeçalho da tabela
  doc.setFillColor(248, 249, 250);
  doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Produto', 25, yPosition);
  doc.text('Qtd', 120, yPosition);
  doc.text('Unidade', 140, yPosition);
  doc.text('Fornecedor', 170, yPosition);
  doc.text('Custo (R$)', pageWidth - 40, yPosition);
  
  yPosition += 15;
  
  // Lista de itens
  doc.setFont('helvetica', 'normal');
  let totalCost = 0;
  
  items.forEach((item, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Zebra stripes
    if (index % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    }
    
    doc.setTextColor(0, 0, 0);
    const productName = item.productName || item.item || 'Produto';
    doc.text(productName, 25, yPosition);
    
    const quantity = item.suggestedQuantity || item.quantity || 0;
    doc.text(quantity.toString(), 120, yPosition);
    doc.text(item.unit, 140, yPosition);
    doc.text(item.supplier, 170, yPosition);
    
    const cost = item.estimatedCost || item.cost || 0;
    doc.text(`R$ ${cost.toFixed(2)}`, pageWidth - 40, yPosition);
    
    totalCost += cost;
    yPosition += 10;
  });
  
  // Total
  yPosition += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPosition - 5, pageWidth - 20, yPosition - 5);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Total Estimado: R$ ${totalCost.toFixed(2)}`, pageWidth - 70, yPosition + 5);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('StockFood - Sistema de Gestão de Estoque para Restaurantes', 20, pageHeight - 20);
  doc.text('Página 1', pageWidth - 40, pageHeight - 20);
  
  return doc;
};

export const generateConsumptionReportPDF = (consumptionData: ConsumptionItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header
  doc.setFillColor(237, 125, 49);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('🍽️ StockFood - Relatório de Consumo', 20, 20);
  
  doc.setTextColor(0, 0, 0);
  const today = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(10);
  doc.text(`Gerado em: ${today}`, pageWidth - 60, 40);
  
  let yPosition = 65;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Análise de Consumo - Últimos 30 dias', 20, yPosition);
  yPosition += 20;
  
  // Cabeçalho da tabela
  doc.setFillColor(248, 249, 250);
  doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Produto', 25, yPosition);
  doc.text('Consumido', 100, yPosition);
  doc.text('Custo (R$)', 140, yPosition);
  doc.text('% Total', pageWidth - 30, yPosition);
  
  yPosition += 15;
  
  let totalCost = 0;
  doc.setFont('helvetica', 'normal');
  
  consumptionData.forEach((item, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 30;
    }
    
    if (index % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
    }
    
    doc.text(item.item, 25, yPosition);
    doc.text(`${item.consumed} ${item.unit}`, 100, yPosition);
    doc.text(`R$ ${item.cost.toFixed(2)}`, 140, yPosition);
    doc.text(`${item.percentage}%`, pageWidth - 30, yPosition);
    
    totalCost += item.cost;
    yPosition += 10;
  });
  
  // Total
  yPosition += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPosition - 5, pageWidth - 20, yPosition - 5);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Total Consumido: R$ ${totalCost.toFixed(2)}`, pageWidth - 70, yPosition + 5);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('StockFood - Sistema de Gestão de Estoque', 20, pageHeight - 20);
  
  return doc;
};

export const generateMovementReportPDF = (movementSummary: MovementSummary) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header
  doc.setFillColor(237, 125, 49);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('🍽️ StockFood - Relatório de Movimentações', 20, 20);
  
  doc.setTextColor(0, 0, 0);
  const today = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(10);
  doc.text(`Gerado em: ${today}`, pageWidth - 60, 40);
  
  let yPosition = 65;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo de Movimentações', 20, yPosition);
  yPosition += 25;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Entradas
  doc.setTextColor(34, 139, 34);
  doc.text(`📥 Entradas: ${movementSummary.totalEntries}`, 25, yPosition);
  doc.text(`Valor: R$ ${movementSummary.totalValueIn.toFixed(2)}`, 120, yPosition);
  yPosition += 15;
  
  // Saídas
  doc.setTextColor(30, 144, 255);
  doc.text(`📤 Saídas: ${movementSummary.totalExits}`, 25, yPosition);
  doc.text(`Valor: R$ ${movementSummary.totalValueOut.toFixed(2)}`, 120, yPosition);
  yPosition += 15;
  
  // Perdas
  doc.setTextColor(255, 69, 0);
  doc.text(`⚠️ Perdas: ${movementSummary.totalLosses}`, 25, yPosition);
  doc.text(`Valor: R$ ${movementSummary.totalValueLost.toFixed(2)}`, 120, yPosition);
  yPosition += 25;
  
  // Resultado
  const margin = movementSummary.totalValueIn - movementSummary.totalValueOut - movementSummary.totalValueLost;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`💰 Margem Líquida: R$ ${margin.toFixed(2)}`, 25, yPosition);
  yPosition += 25;
  
  // Indicadores
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('📊 Indicadores de Performance:', 25, yPosition);
  yPosition += 15;
  
  const lossRate = (movementSummary.totalValueLost / movementSummary.totalValueIn) * 100;
  const turnoverRate = movementSummary.totalExits / movementSummary.totalEntries;
  
  doc.text(`• Taxa de Perdas: ${lossRate.toFixed(1)}%`, 30, yPosition);
  yPosition += 10;
  doc.text(`• Giro de Estoque: ${turnoverRate.toFixed(1)}x`, 30, yPosition);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('StockFood - Sistema de Gestão de Estoque', 20, pageHeight - 20);
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};