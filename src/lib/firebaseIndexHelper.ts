// Helper para detectar e orientar criação de índices do Firebase
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';

interface IndexError {
  collection: string;
  fields: string[];
  url: string;
  description: string;
}

export class FirebaseIndexHelper {
  private static indexErrors: IndexError[] = [];
  private static hasChecked = false;

  // URLs diretas para criar os índices necessários
  private static readonly REQUIRED_INDEXES = [
    {
      collection: 'products',
      fields: ['organizationId', 'name'],
      url: 'https://console.firebase.google.com/v1/r/project/stockely-5de11/firestore/indexes?create_composite=Ck9wcm9qZWN0cy9zdG9ja2VseS01ZGUxMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcHJvZHVjdHMvaW5kZXhlcy9fEAEaEgoOb3JnYW5pemF0aW9uSWQQARoICgRuYW1lEAEaDAoIX19uYW1lX18QAQ',
      description: 'Índice para buscar produtos por organização e ordenar por nome'
    },
    {
      collection: 'stockMovements',
      fields: ['organizationId', 'createdAt'],
      url: 'https://console.firebase.google.com/v1/r/project/stockely-5de11/firestore/indexes?create_composite=ClVwcm9qZWN0cy9zdG9ja2VseS01ZGUxMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvc3RvY2tNb3ZlbWVudHMvaW5kZXhlcy9fEAEaEgoOb3JnYW5pemF0aW9uSWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXhAC',
      description: 'Índice para buscar movimentações por organização e ordenar por data'
    }
  ];

  // Detecta automaticamente quais índices estão faltando
  static async checkRequiredIndexes(organizationId: string): Promise<IndexError[]> {
    if (this.hasChecked) return this.indexErrors;

    console.log('🔍 Verificando índices necessários do Firebase...');
    this.indexErrors = [];

    // Testa índice de produtos
    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('organizationId', '==', organizationId),
        orderBy('name'),
        limit(1)
      );
      await getDocs(productsQuery);
      console.log('✅ Índice de produtos: OK');
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        console.log('❌ Índice de produtos: FALTANDO');
        this.indexErrors.push(this.REQUIRED_INDEXES[0]);
      }
    }

    // Testa índice de movimentações
    try {
      const movementsQuery = query(
        collection(db, 'stockMovements'),
        where('organizationId', '==', organizationId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      await getDocs(movementsQuery);
      console.log('✅ Índice de movimentações: OK');
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        console.log('❌ Índice de movimentações: FALTANDO');
        this.indexErrors.push(this.REQUIRED_INDEXES[1]);
      }
    }

    this.hasChecked = true;
    return this.indexErrors;
  }

  // Mostra instruções claras para o usuário
  static showIndexInstructions(errors: IndexError[]) {
    if (errors.length === 0) {
      console.log('🎉 Todos os índices estão configurados!');
      return;
    }

    console.log('🚨 AÇÃO NECESSÁRIA: Índices do Firebase faltando');
    console.log('');
    console.log('Para corrigir, siga estes passos:');
    console.log('');

    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.description}`);
      console.log(`   Coleção: ${error.collection}`);
      console.log(`   Campos: ${error.fields.join(', ')}`);
      console.log(`   🔗 Clique aqui para criar: ${error.url}`);
      console.log('');
    });

    console.log('⏱️ Após criar os índices, aguarde 5-10 minutos e recarregue a página.');
    console.log('');

    // Mostra alerta visual para o usuário
    this.showUserAlert(errors);
  }

  // Mostra alerta visual na interface
  private static showUserAlert(errors: IndexError[]) {
    // Cria um modal de alerta
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    const modalDiv = document.createElement('div');
    modalDiv.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;

    modalDiv.innerHTML = `
      <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 24px;">
        🚨 Configuração do Firebase Necessária
      </h2>
      <p style="margin: 0 0 20px 0; color: #374151; line-height: 1.6;">
        O sistema precisa de índices no Firebase para funcionar. Clique nos links abaixo para criá-los:
      </p>
      ${errors.map((error, index) => `
        <div style="margin: 15px 0; padding: 15px; background: #f3f4f6; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">
            ${index + 1}. ${error.description}
          </h3>
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
            Coleção: <code>${error.collection}</code> | Campos: <code>${error.fields.join(', ')}</code>
          </p>
          <a href="${error.url}" target="_blank" style="
            display: inline-block;
            background: #ea580c;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
          ">
            🔗 Criar Índice
          </a>
        </div>
      `).join('')}
      <div style="margin: 20px 0 0 0; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          ⏱️ <strong>Importante:</strong> Após criar os índices, aguarde 5-10 minutos e recarregue a página.
        </p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        margin: 20px 0 0 0;
        background: #6b7280;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
      ">
        Fechar (Criarei os índices agora)
      </button>
    `;

    alertDiv.appendChild(modalDiv);
    document.body.appendChild(alertDiv);
  }

  // Função para usar nos hooks
  static async ensureIndexes(organizationId: string) {
    const errors = await this.checkRequiredIndexes(organizationId);
    if (errors.length > 0) {
      this.showIndexInstructions(errors);
      return false; // Índices faltando
    }
    return true; // Todos os índices OK
  }
}

// Função utilitária para usar nos componentes
export const checkFirebaseIndexes = async (organizationId: string) => {
  return await FirebaseIndexHelper.ensureIndexes(organizationId);
};