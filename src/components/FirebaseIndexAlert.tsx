import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ExternalLink, CheckCircle, Clock } from 'lucide-react';

interface IndexInfo {
  name: string;
  collection: string;
  fields: string[];
  url: string;
  description: string;
}

const REQUIRED_INDEXES: IndexInfo[] = [
  {
    name: 'Produtos por Organização',
    collection: 'products',
    fields: ['organizationId', 'name'],
    url: 'https://console.firebase.google.com/v1/r/project/stockely-5de11/firestore/indexes?create_composite=Ck9wcm9qZWN0cy9zdG9ja2VseS01ZGUxMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcHJvZHVjdHMvaW5kZXhlcy9fEAEaEgoOb3JnYW5pemF0aW9uSWQQARoICgRuYW1lEAEaDAoIX19uYW1lX18QAQ',
    description: 'Permite buscar e ordenar produtos por organização'
  },
  {
    name: 'Movimentações por Data',
    collection: 'stockMovements', 
    fields: ['organizationId', 'createdAt'],
    url: 'https://console.firebase.google.com/v1/r/project/stockely-5de11/firestore/indexes?create_composite=ClVwcm9qZWN0cy9zdG9ja2VseS01ZGUxMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvc3RvY2tNb3ZlbWVudHMvaW5kZXhlcy9fEAEaEgoOb3JnYW5pemF0aW9uSWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXhAC',
    description: 'Permite buscar movimentações ordenadas por data'
  }
];

interface FirebaseIndexAlertProps {
  show: boolean;
  onClose: () => void;
}

export const FirebaseIndexAlert: React.FC<FirebaseIndexAlertProps> = ({ show, onClose }) => {
  const [createdIndexes, setCreatedIndexes] = useState<Set<string>>(new Set());

  if (!show) return null;

  const handleIndexCreated = (indexName: string) => {
    setCreatedIndexes(prev => new Set([...prev, indexName]));
  };

  const allIndexesCreated = createdIndexes.size === REQUIRED_INDEXES.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <CardTitle className="text-xl text-red-600">
                Configuração do Firebase Necessária
              </CardTitle>
              <CardDescription>
                O sistema precisa de índices no Firestore para funcionar corretamente
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Ação necessária:</strong> Clique nos botões abaixo para criar os índices necessários no Firebase.
              Após criar todos os índices, aguarde 5-10 minutos e recarregue a página.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Índices Necessários:</h3>
            
            {REQUIRED_INDEXES.map((index, i) => (
              <div key={index.name} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg flex items-center gap-2">
                      {i + 1}. {index.name}
                      {createdIndexes.has(index.name) && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {index.description}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <strong>Coleção:</strong> {index.collection} | 
                      <strong> Campos:</strong> {index.fields.join(', ')}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      window.open(index.url, '_blank');
                      handleIndexCreated(index.name);
                    }}
                    className="bg-orange-500 hover:bg-orange-600"
                    disabled={createdIndexes.has(index.name)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {createdIndexes.has(index.name) ? 'Índice Criado' : 'Criar Índice'}
                  </Button>
                  
                  {createdIndexes.has(index.name) && (
                    <div className="flex items-center text-sm text-green-600">
                      <Clock className="w-4 h-4 mr-1" />
                      Aguardando ativação...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {allIndexesCreated && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Ótimo!</strong> Todos os índices foram criados. 
                Aguarde 5-10 minutos para que sejam ativados e depois recarregue a página.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">📋 Instruções:</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Clique em cada botão "Criar Índice" acima</li>
              <li>Uma nova aba abrirá no Firebase Console</li>
              <li>Clique em "Create Index" na página que abrir</li>
              <li>Repita para todos os índices</li>
              <li>Aguarde 5-10 minutos</li>
              <li>Recarregue esta página</li>
            </ol>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar (Criarei os índices)
            </Button>
            {allIndexesCreated && (
              <Button onClick={() => window.location.reload()}>
                Recarregar Página
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};