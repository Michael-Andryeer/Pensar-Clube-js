import React, { useState, useRef, useEffect } from 'react';
import NewsletterPatterns from './NewsLetterPatterns';

const endpoint1 = '/api-hinova/api/sga/v2/listar/boleto-associado-veiculo';
const token = import.meta.env.VITE_API_TOKEN;

if (!token) {
  throw new Error('Token de API não configurado. Verifique o arquivo .env');
}

// Formatar CPF enquanto digita
function formatarCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, "");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return cpf;
}

function formatarData(data: string) {
  if (!data) return '';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

function verificarDataVencimento(data: string) {
  const venc = new Date(data);
  const hoje = new Date();
  const diff = hoje.getTime() - venc.getTime();
  return diff > 30 * 24 * 60 * 60 * 1000;
}

// Componente de Boleto com Swipe
const BoletoSwipe = ({ item, copiarLinhaDigitavel }: { item: any, copiarLinhaDigitavel: (linha: string) => void }) => {
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { isPago, isVencido, isVencidoMais30Dias, diasAteVencimento, situacao, borderColor } = getSituacaoEBadges(item);

  // Manipuladores de eventos de toque/mouse
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === null) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);

    if (cardRef.current) {
      const deltaX = clientX - startX;
      const translateX = Math.min(0, deltaX);
      const limitedTranslateX = Math.max(-200, translateX);

      cardRef.current.style.transform = `translateX(${limitedTranslateX}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (startX === null || currentX === null) {
      setIsSwiping(false);
      return;
    }

    const deltaX = currentX - startX;

    if (cardRef.current) {
      if (deltaX < -100) {
        cardRef.current.style.transform = 'translateX(-200px)';
      } else {
        cardRef.current.style.transform = 'translateX(0)';
      }
    }

    setStartX(null);
    setCurrentX(null);
    setIsSwiping(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node) && !isSwiping) {
        cardRef.current.style.transform = 'translateX(0)';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSwiping]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, marginBottom: 24 }}>
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          zIndex: 10,
          background: '#fff',
          transition: 'transform 0.3s ease',
          touchAction: 'manipulation'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div
          style={{
            borderLeft: `6px solid ${borderColor}`,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            padding: 20,
            maxWidth: 420,
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'relative'
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <h3 style={{margin: 0, fontSize: 18, color: "#222", fontWeight: 600}}>
                {item.nome_associado && item.nome_associado.length > 28 ? item.nome_associado.slice(0, 28) + '...' : item.nome_associado}
              </h3>
              <div style={{fontSize: 22, fontWeight: 700, margin: '6px 0 0 0', color: '#222'}}>
                R$ {Number(item.valor_boleto).toFixed(2)}
              </div>
            </div>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 13,
                background: isPago ? '#dcfce7' : isVencido ? '#fee2e2' : '#fef9c3',
                color: isPago ? '#15803d' : isVencido ? '#b91c1c' : '#a16207'
              }}
            >
              {situacao}
            </span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginTop: 10, fontSize: 15, color: '#555'}}>
            <span style={{marginRight: 8, fontWeight: 500}}>Vencimento:</span>
            <span>{formatarData(item.data_vencimento)}</span>
            {situacao === 'Pendente' && diasAteVencimento <= 5 && diasAteVencimento > 0 && (
              <span style={{
                marginLeft: 12,
                background: '#ffedd5',
                color: '#ea580c',
                borderRadius: 8,
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 600
              }}>
                {diasAteVencimento} {diasAteVencimento === 1 ? 'dia' : 'dias'}
              </span>
            )}
            {isVencido && (
              <span style={{
                marginLeft: 12,
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 8,
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 600
              }}>
                Vencido
              </span>
            )}
          </div>
          <div style={{marginTop: 12}}>
            <div style={{display: 'flex', alignItems: 'center', fontSize: 15}}>
              <span style={{fontWeight: 500}}>Situação:</span>
              <span style={{marginLeft: 8}}>{situacao}</span>
            </div>
            {isVencidoMais30Dias && (
              <div style={{
                marginTop: 12,
                background: '#fee2e2',
                color: '#b91c1c',
                borderRadius: 6,
                padding: 10,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{fontWeight: 600, marginRight: 8}}>⚠️</span>
                Você precisa fazer a revistoria&nbsp;
                <a href="https://pensarclubeapp.flutterflow.app/" target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline', color: '#b91c1c', fontWeight: 600}}>clique aqui</a>
              </div>
            )}
            {!isPago && !isVencidoMais30Dias && (
              <>
                <div style={{marginTop: 10, fontSize: 14, wordBreak: 'break-all'}}>
                  <span style={{fontWeight: 500}}>Linha Digitável:</span>
                  <span style={{marginLeft: 8, fontFamily: 'monospace'}}>{item.linha_digitavel}</span>
                </div>
                <div style={{display: 'flex', gap: 8, marginTop: 10}}>
                  <button
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      backgroundColor: "#F3CD04",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                    onClick={() => copiarLinhaDigitavel(item.linha_digitavel)}
                  >
                    Copiar Linha Digitável
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Função para calcular status e dias
function getSituacaoEBadges(item: any) {
  const isPago = item.descricao_situacao_boleto === 'BAIXADO';
  const vencimento = new Date(item.data_vencimento);
  const hoje = new Date();
  const diff = hoje.getTime() - vencimento.getTime();
  const isVencido = vencimento < hoje && !isPago;
  const isVencidoMais30Dias = diff > 30 * 24 * 60 * 60 * 1000 && !isPago;
  const diasAteVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  let situacao = isPago ? 'Pago' : isVencido ? 'Vencido' : 'Pendente';

  let borderColor = '#F3CD04';
  if (situacao === 'Pago') borderColor = '#22c55e';
  else if (situacao === 'Vencido') borderColor = '#ef4444';
  else if (situacao === 'Pendente' && diasAteVencimento <= 5) borderColor = '#fb923c';

  return { isPago, isVencido, isVencidoMais30Dias, diasAteVencimento, situacao, borderColor };
}

const NewsletterSection = () => {
  const [cpf, setCpf] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [boletos, setBoletos] = useState<any[]>([]);
  const [modalMsg, setModalMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cpfInvalido, setCpfInvalido] = useState(false);
  const [currentBoletoIndex, setCurrentBoletoIndex] = useState(0);

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
    const notification = document.createElement('div');
    notification.textContent = 'Linha digitável copiada com sucesso!';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#22c55e';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '10002';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 2000);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 14) {
      setCpf(formatarCPF(value));
    }
  };

  const handleCPFSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCpfInvalido(false);

    if (!validarCPF(cpf)) {
      setCpfInvalido(true);
      return;
    }

    setLoading(true);

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
          cpf_associado: cpf.replace(/\D/g, ''),
          data_vencimento_inicial: dataFinalFormatada,
          data_vencimento_final: dataInicialFormatada
        })
      });
      const data = await response.json();
      // Filtrar apenas boletos pendentes
      const boletosPendentes = (data || []).filter((b: any) => {
        const isPago = b.descricao_situacao_boleto === 'BAIXADO';
        const vencimento = new Date(b.data_vencimento);
        const hoje = new Date();
        const isVencido = vencimento < hoje && !isPago;
        return !isPago && !isVencido;
      });
      if (boletosPendentes.length > 0) {
        setBoletos(boletosPendentes.reverse());
        setModalMsg(null);
        setCurrentBoletoIndex(0);
      } else {
        setBoletos([]);
        setModalMsg('Você não tem boletos pendentes no momento.');
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

  // Navegação entre boletos
  const nextBoleto = () => {
    if (currentBoletoIndex < boletos.length - 1) {
      setCurrentBoletoIndex(currentBoletoIndex + 1);
    }
  };

  const prevBoleto = () => {
    if (currentBoletoIndex > 0) {
      setCurrentBoletoIndex(currentBoletoIndex - 1);
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
              onChange={handleCPFChange}
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
        <div id="modal" className="modal-custom" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <div className="modal-content-custom">
            <button id="close-modal" className="close" onClick={() => setModalOpen(false)}>×</button>
            <div className="modal-body" style={{maxHeight: 400, overflowY: 'auto'}}>
              {modalMsg && <p>{modalMsg}</p>}
              {!modalMsg && boletos.length > 0 && (
                <>
                  {boletos.length > 1 && (
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                      <button 
                        onClick={prevBoleto} 
                        disabled={currentBoletoIndex === 0}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 4,
                          backgroundColor: currentBoletoIndex === 0 ? "#e5e5e5" : "#f3f4f6",
                          border: "none",
                          cursor: currentBoletoIndex === 0 ? "default" : "pointer",
                          color: currentBoletoIndex === 0 ? "#a3a3a3" : "#333"
                        }}
                      >
                        ← Anterior
                      </button>
                      <span style={{fontSize: 14, color: '#666'}}>
                        {currentBoletoIndex + 1} de {boletos.length}
                      </span>
                      <button 
                        onClick={nextBoleto} 
                        disabled={currentBoletoIndex === boletos.length - 1}
                        style={{
                          padding: '4px 12px',
                          borderRadius: 4,
                          backgroundColor: currentBoletoIndex === boletos.length - 1 ? "#e5e5e5" : "#f3f4f6",
                          border: "none",
                          cursor: currentBoletoIndex === boletos.length - 1 ? "default" : "pointer",
                          color: currentBoletoIndex === boletos.length - 1 ? "#a3a3a3" : "#333"
                        }}
                      >
                        Próximo →
                      </button>
                    </div>
                  )}
                  <BoletoSwipe 
                    item={boletos[currentBoletoIndex]} 
                    copiarLinhaDigitavel={copiarLinhaDigitavel} 
                  />
                </>
              )}
            </div>
          </div>
          {/* Removido o fundo cinza do modal-fade */}
          {/* <div id="fade" className="modal-fade" onClick={() => setModalOpen(false)}></div> */}
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
        /* Removido .modal-fade */
        .close {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-body {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NewsletterSection;