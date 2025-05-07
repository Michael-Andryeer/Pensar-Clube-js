import React, { useState } from 'react';
import NewsletterPatterns from './NewsLetterPatterns';

const endpoint1 = '/api-hinova/api/sga/v2/listar/boleto-associado-veiculo';
const token = process.env.NEXT_PUBLIC_API_TOKEN || process.env.API_TOKEN;

if (!token) {
  throw new Error('Token de API não configurado. Verifique o arquivo .env');
}

function formatarData(data: string) {
  if (!data) return '';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function verificarDataVencimento(data: string) {
  // Exemplo: retorna true se vencido há mais de 30 dias
  const venc = new Date(data);
  const hoje = new Date();
  const diff = hoje.getTime() - venc.getTime();
  return diff > 30 * 24 * 60 * 60 * 1000;
}

const NewsletterSection = () => {
  const [cpf, setCpf] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [boletos, setBoletos] = useState<any[]>([]);
  const [modalMsg, setModalMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cpfInvalido, setCpfInvalido] = useState(false);

  function validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  const copiarLinhaDigitavel = (linha: string) => {
    navigator.clipboard.writeText(linha);
    alert('Linha digitável copiada com sucesso!');
  };

  const handleCPFSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCpfInvalido(false);

    if (!validarCPF(cpf)) {
      setCpfInvalido(true);
      return;
    }

    setLoading(true);

    // Calcula datas
    const dataAtual = new Date();
    const dataInicial = new Date(dataAtual.getTime() + 30 * 24 * 60 * 60 * 1000);
    const dataFinal = new Date(dataAtual.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dataInicialFormatada = `${(dataInicial.getDate()).toString().padStart(2, '0')}/${(dataInicial.getMonth() + 1).toString().padStart(2, '0')}/${dataInicial.getFullYear()}`;
    const dataFinalFormatada = `${(dataFinal.getDate()).toString().padStart(2, '0')}/${(dataFinal.getMonth() + 1).toString().padStart(2, '0')}/${dataFinal.getFullYear()}`;

    try {
      const response = await fetch(endpoint1, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cpf_associado: cpf,
          data_vencimento_inicial: dataFinalFormatada,
          data_vencimento_final: dataInicialFormatada
        })
      });
      const data = await response.json();
      if (data && data.length > 0) {
        setBoletos(data.reverse());
        setModalMsg(null);
      } else {
        setBoletos([]);
        setModalMsg('Você não tem boletos no momento.');
      }
      setModalOpen(true);
      setCpf('');
    } catch (error) {
      setBoletos([]);
      setModalMsg('Erro ao buscar boleto. Tente novamente.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="s2-newslatter_section relative-position">
      <div className="container">
        <div className="s2-newslatter_content relative-position">
          <div className="s2-newslatter_title text-center saas2-headline pera-content">
            <h2>2ª Via do boleto</h2>
            <p>Digite o seu CPF e receba o seu boleto na hora!</p>
          </div>
          <div className="s2-newslatter-form relative-position">
            {cpfInvalido && <h6 className="cpfinválido" style={{color: 'red'}}>Digite um CPF válido!</h6>}
            <input 
              className="cpf" 
              name="number" 
              type="text" 
              placeholder="Digite seu CPF" 
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              disabled={loading}
            />
            <div className="nws-button position-absolute text-capitalize loadercentral">
              <button 
                className="hover-btn btn btn-primary" 
                type="submit" 
                onClick={handleCPFSubmit}
                id="open-modal"
                disabled={loading}
              >
                {loading ? "Buscando..." : "Resgatar"}
              </button>
              {loading && <div className="loader"></div>}
            </div>
          </div>
        </div>
        <NewsletterPatterns />
      </div>
      {/* Modal estilizado */}
      {modalOpen && (
        <div id="modal" className="modal-custom">
          <div className="modal-content-custom">
            <button id="close-modal" className="close" onClick={() => setModalOpen(false)}>×</button>
            <div className="modal-body" style={{maxHeight: 400, overflowY: 'auto'}}>
              {modalMsg && <p>{modalMsg}</p>}
              {!modalMsg && boletos.map((item, idx) => (
                <div key={idx} style={{marginBottom: 24}}>
                  <h3 style={{margin: 0, fontSize: 20, color: "#222"}}>{item.nome_associado}</h3>
                  <p><strong>Valor do Boleto:</strong> R$ {Number(item.valor_boleto).toFixed(2)}</p>
                  <p><strong>Data de Vencimento:</strong> {formatarData(item.data_vencimento)}</p>
                  <p><strong>Situação do Boleto:</strong> {item.descricao_situacao_boleto === 'BAIXADO' ? 'Pago' : item.descricao_situacao_boleto}</p>
                  {item.descricao_situacao_boleto !== 'BAIXADO' && verificarDataVencimento(item.data_vencimento) && (
                    <p style={{color: 'red'}}>Você precisa fazer a revistoria <a href="https://pensarclubeapp.flutterflow.app/" target="_blank" rel="noopener noreferrer">clique aqui</a></p>
                  )}
                  {item.descricao_situacao_boleto !== 'BAIXADO' && !verificarDataVencimento(item.data_vencimento) && (
                    <>
                      <p style={{marginRight: 10}}><strong>Linha Digitável:</strong> {item.linha_digitavel}</p>
                      <div style={{display: 'flex', gap: 8, marginBottom: 8}}>
                        <button
                          style={{padding: 8, borderRadius: 6, backgroundColor: "#F3CD04", border: "none", cursor: "pointer"}}
                          onClick={() => copiarLinhaDigitavel(item.linha_digitavel)}
                        >
                          Copiar Linha Digitável
                        </button>
                       
                      </div>
                    </>
                  )}
                  <hr />
                </div>
              ))}
            </div>
          </div>
          <div id="fade" className="modal-fade" onClick={() => setModalOpen(false)}></div>
        </div>
      )}
      <style>{`
        .modal-custom {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content-custom {
          background: #fff;
          padding: 32px 24px;
          border-radius: 8px;
          position: relative;
          z-index: 10001;
          min-width: 320px;
          max-width: 90vw;
          box-shadow: 0 4px 32px rgba(0,0,0,0.18);
        }
        .modal-fade {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 10000;
        }
        .close {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default NewsletterSection;