export class Nfce {
  id: number;
  vendaId: number;
  status: 'processando' | 'autorizada' | 'rejeitada' | 'cancelada';
  chaveAcesso: string;
  qrCodeUrl: string;
  xml: string; // The signed XML
  createdAt: Date;
}
