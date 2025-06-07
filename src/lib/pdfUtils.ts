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

interface LossItem {
  item: string;
  quantity: number;
  unit: string;
  reason: string;
  cost: number;
  date: string;
}

// Mock data for losses
const mockLossData: LossItem[] = [
  { item: 'Molho Especial', quantity: 2, unit: 'Litros', reason: 'Vencimento', cost: 30.00, date: '2025-06-04' },
  { item: 'Pão Brioche', quantity: 5, unit: 'Unidades', reason: 'Mofou', cost: 7.50, date: '2025-06-03' },
  { item: 'Queijo Cheddar', quantity: 0.5, unit: 'Kg', reason: 'Contaminação', cost: 14.45, date: '2025-06-02' }
];

// Utilitário para gerar PDF da lista de compras (SEM VALORES)
export const generateShoppingListPDF = (items: ShoppingItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header simplificado (sem logo)
  doc.setFillColor(233, 115, 22); // Cor laranja limpa
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('STOCKELY - LISTA DE COMPRAS', 20, 16);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  // Data de geração
  const today = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerada em: ${today}`, pageWidth - 50, 35);
  
  // Linha separadora
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 40, pageWidth - 20, 40);
  
  let yPosition = 55;
  
  // Cabeçalho da tabela (SEM CUSTO)
  doc.setFillColor(248, 249, 250);
  doc.rect(20, yPosition - 5, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUTO', 25, yPosition);
  doc.text('QTD', 110, yPosition);
  doc.text('UNIDADE', 135, yPosition);
  doc.text('FORNECEDOR', 170, yPosition);
  
  yPosition += 15;
  
  // Lista de itens (SEM VALORES)
  doc.setFont('helvetica', 'normal');
  
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
    
    // Limitar tamanho do nome do produto
    const maxProductNameLength = 35;
    const displayName = productName.length > maxProductNameLength 
      ? productName.substring(0, maxProductNameLength) + '...' 
      : productName;
    
    doc.text(displayName, 25, yPosition);
    
    const quantity = item.suggestedQuantity || item.quantity || 0;
    doc.text(quantity.toString(), 110, yPosition);
    doc.text(item.unit, 135, yPosition);
    
    // Limitar tamanho do fornecedor
    const maxSupplierLength = 25;
    const displaySupplier = item.supplier.length > maxSupplierLength 
      ? item.supplier.substring(0, maxSupplierLength) + '...' 
      : item.supplier;
    
    doc.text(displaySupplier, 170, yPosition);
    
    yPosition += 10;
  });
  
  // Nota sobre valores
  yPosition += 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('OBSERVAÇÃO: Os valores serão definidos no momento da compra.', 20, yPosition);
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Stockely - Sistema de Gestão de Estoque', 20, pageHeight - 20);
  doc.text('Página 1', pageWidth - 30, pageHeight - 20);
  
  return doc;
};

export const generateCompleteReportPDF = (
  consumptionData: ConsumptionItem[], 
  movementSummary: MovementSummary,
  lossData: LossItem[] = mockLossData
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Header simplificado
  doc.setFillColor(233, 115, 22);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('STOCKELY - RELATÓRIO COMPLETO DE ANÁLISE', 20, 16);
  
  doc.setTextColor(0, 0, 0);
  const today = new Date().toLocaleDateString('pt-BR');
  doc.setFontSize(10);
  doc.text(`Período: Últimos 30 dias | Gerado em: ${today}`, pageWidth - 85, 35);
  
  let yPosition = 50;
  
  // === RESUMO EXECUTIVO ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 115, 22);
  doc.text('1. RESUMO EXECUTIVO', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Cards de resumo
  const margin = movementSummary.totalValueIn - movementSummary.totalValueOut - movementSummary.totalValueLost;
  const lossRate = (movementSummary.totalValueLost / movementSummary.totalValueIn) * 100;
  const turnoverRate = movementSummary.totalExits / movementSummary.totalEntries;
  
  doc.text(`📊 Total de Entradas: ${movementSummary.totalEntries} movimentações`, 25, yPosition);
  doc.text(`💰 Valor: R$ ${movementSummary.totalValueIn.toFixed(2)}`, 130, yPosition);
  yPosition += 8;
  
  doc.text(`📦 Total de Saídas: ${movementSummary.totalExits} movimentações`, 25, yPosition);
  doc.text(`💰 Valor: R$ ${movementSummary.totalValueOut.toFixed(2)}`, 130, yPosition);
  yPosition += 8;
  
  doc.text(`⚠️ Total de Perdas: ${movementSummary.totalLosses} ocorrências`, 25, yPosition);
  doc.text(`💰 Valor: R$ ${movementSummary.totalValueLost.toFixed(2)}`, 130, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text(`💡 Margem Líquida: R$ ${margin.toFixed(2)}`, 25, yPosition);
  doc.text(`📈 Taxa de Perdas: ${lossRate.toFixed(1)}%`, 130, yPosition);
  yPosition += 15;
  
  // === ANÁLISE DE CONSUMO ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 115, 22);
  doc.text('2. ANÁLISE DE CONSUMO POR PRODUTO', 20, yPosition);
  yPosition += 15;
  
  // Cabeçalho da tabela de consumo
  doc.setFillColor(248, 249, 250);
  doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('PRODUTO', 25, yPosition);
  doc.text('CONSUMO', 90, yPosition);
  doc.text('CUSTO (R$)', 130, yPosition);
  doc.text('% TOTAL', 170, yPosition);
  
  yPosition += 12;
  
  let totalConsumptionCost = 0;
  doc.setFont('helvetica', 'normal');
  
  consumptionData.forEach((item, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 30;
    }
    
    if (index % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(20, yPosition - 4, pageWidth - 40, 6, 'F');
    }
    
    doc.text(item.item, 25, yPosition);
    doc.text(`${item.consumed} ${item.unit}`, 90, yPosition);
    doc.text(`R$ ${item.cost.toFixed(2)}`, 130, yPosition);
    doc.text(`${item.percentage}%`, 170, yPosition);
    
    totalConsumptionCost += item.cost;
    yPosition += 8;
  });
  
  // Total do consumo
  yPosition += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL CONSUMIDO: R$ ${totalConsumptionCost.toFixed(2)}`, 25, yPosition + 5);
  yPosition += 20;
  
  // === ANÁLISE DE PERDAS ===
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 115, 22);
  doc.text('3. ANÁLISE DETALHADA DE PERDAS', 20, yPosition);
  yPosition += 15;
  
  // Cabeçalho da tabela de perdas
  doc.setFillColor(248, 249, 250);
  doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUTO', 25, yPosition);
  doc.text('QTD', 70, yPosition);
  doc.text('MOTIVO', 100, yPosition);
  doc.text('CUSTO', 140, yPosition);
  doc.text('DATA', 170, yPosition);
  
  yPosition += 12;
  
  let totalLossCost = 0;
  doc.setFont('helvetica', 'normal');
  
  lossData.forEach((loss, index) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 30;
    }
    
    if (index % 2 === 0) {
      doc.setFillColor(254, 242, 242);
      doc.rect(20, yPosition - 4, pageWidth - 40, 6, 'F');
    }
    
    doc.text(loss.item, 25, yPosition);
    doc.text(`${loss.quantity} ${loss.unit}`, 70, yPosition);
    doc.text(loss.reason, 100, yPosition);
    doc.text(`R$ ${loss.cost.toFixed(2)}`, 140, yPosition);
    doc.text(loss.date, 170, yPosition);
    
    totalLossCost += loss.cost;
    yPosition += 8;
  });
  
  // Total das perdas
  yPosition += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(`TOTAL EM PERDAS: R$ ${totalLossCost.toFixed(2)}`, 25, yPosition + 5);
  yPosition += 20;
  
  // === INDICADORES DE PERFORMANCE ===
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 30;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 115, 22);
  doc.text('4. INDICADORES DE PERFORMANCE', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  doc.text(`• Taxa de Perdas: ${lossRate.toFixed(1)}% (ideal: abaixo de 3%)`, 25, yPosition);
  yPosition += 8;
  doc.text(`• Giro de Estoque: ${turnoverRate.toFixed(1)}x (ideal: acima de 2x)`, 25, yPosition);
  yPosition += 8;
  doc.text(`• Eficiência Operacional: ${((1 - lossRate/100) * 100).toFixed(1)}%`, 25, yPosition);
  yPosition += 8;
  doc.text(`• Margem de Contribuição: ${((margin/movementSummary.totalValueIn) * 100).toFixed(1)}%`, 25, yPosition);
  yPosition += 15;
  
  // === RECOMENDAÇÕES ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(233, 115, 22);
  doc.text('5. RECOMENDAÇÕES', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  if (lossRate > 3) {
    doc.text('⚠️ ALTA TAXA DE PERDAS: Revisar procedimentos de armazenamento e prazos de validade.', 25, yPosition);
    yPosition += 8;
  }
  
  if (turnoverRate < 2) {
    doc.text('📦 BAIXO GIRO: Considerar reduzir pedidos ou diversificar cardápio.', 25, yPosition);
    yPosition += 8;
  }
  
  doc.text('✅ Implementar sistema de controle FIFO (Primeiro que entra, primeiro que sai).', 25, yPosition);
  yPosition += 8;
  doc.text('✅ Monitorar temperaturas de refrigeração diariamente.', 25, yPosition);
  yPosition += 8;
  doc.text('✅ Realizar inventários semanais para maior precisão.', 25, yPosition);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Stockely - Sistema de Gestão de Estoque | Relatório gerado automaticamente', 20, pageHeight - 20);
  
  return doc;
};

export const generateConsumptionReportPDF = (consumptionData: ConsumptionItem[]) => {
  const mockMovementSummary: MovementSummary = {
    totalEntries: 15,
    totalExits: 48,
    totalLosses: 3,
    totalValueIn: 3250.80,
    totalValueOut: 1806.70,
    totalValueLost: 51.95
  };
  
  return generateCompleteReportPDF(consumptionData, mockMovementSummary);
};

export const generateMovementReportPDF = (movementSummary: MovementSummary) => {
  const mockConsumptionData: ConsumptionItem[] = [
    { item: 'Pão Brioche', consumed: 150, unit: 'Unidades', cost: 225.00, percentage: 25 },
    { item: 'Carne Angus 180g', consumed: 27, unit: 'Kg', cost: 945.00, percentage: 35 },
    { item: 'Queijo Cheddar', consumed: 8, unit: 'Kg', cost: 231.20, percentage: 15 },
    { item: 'Molho Especial', consumed: 5, unit: 'Litros', cost: 75.00, percentage: 8 },
    { item: 'Batata Palito', consumed: 22, unit: 'Kg', cost: 330.00, percentage: 17 }
  ];
  
  return generateCompleteReportPDF(mockConsumptionData, movementSummary);
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};