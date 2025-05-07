import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../../assets/css/style.css";

interface CotationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPANY_HASH = "peNs4rClub3fdgG42"; // Substitua pelo seu hash real

Modal.setAppElement("#root");

const CotationModal: React.FC<CotationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  // Campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicleType, setVehicleType] = useState(""); // 1, 2, 3
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [model, setModel] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [uber, setUber] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dados dinâmicos
  const [brands, setBrands] = useState<{id: string, text: string}[]>([]);
  const [years, setYears] = useState<{id: string, text: string}[]>([]);
  const [models, setModels] = useState<{id: string, text: string}[]>([]);
  const [states, setStates] = useState<{id: string, text: string}[]>([]);
  const [cities, setCities] = useState<{id: string, text: string}[]>([]);

  // Código da cotação retornado pelo step 1
  const [quotationCode, setQuotationCode] = useState<string | null>(null);

  // Buscar estados ao abrir modal
  useEffect(() => {
    if (isOpen) {
      fetch("https://utilities.powercrm.com.br/state/stt")
        .then(res => res.json())
        .then(data => setStates(data));
    }
  }, [isOpen]);

  // Buscar cidades ao selecionar estado
  useEffect(() => {
    if (state) {
      fetch(`https://utilities.powercrm.com.br/city/ct?st=${state}`)
        .then(res => res.json())
        .then(data => setCities(data));
    } else {
      setCities([]);
    }
  }, [state]);

  // Buscar marcas ao selecionar tipo de veículo
  useEffect(() => {
    if (vehicleType) {
      setBrand(""); setYear(""); setModel("");
      setYears([]); setModels([]);
      fetch(`https://app.powercrm.com.br/cb?type=${vehicleType}`)
        .then(res => res.json())
        .then(data => setBrands(data));
    } else {
      setBrands([]);
    }
  }, [vehicleType]);

  // Buscar anos ao selecionar marca
  useEffect(() => {
    if (brand) {
      setYear(""); setModel("");
      setModels([]);
      fetch(`https://app.powercrm.com.br/bmy?cb=${brand}`)
        .then(res => res.json())
        .then(data => setYears(data));
    } else {
      setYears([]);
    }
  }, [brand]);

  // Buscar modelos ao selecionar ano
  useEffect(() => {
    if (brand && year) {
      setModel("");
      fetch(`https://app.powercrm.com.br/cmby?cb=${brand}&cy=${year}`)
        .then(res => res.json())
        .then(data => setModels(data));
    } else {
      setModels([]);
    }
  }, [brand, year]);

  // Máscara para WhatsApp
  function formatWhatsapp(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      return value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      return value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      return value;
    }
  }

  // Resetar selects ao fechar modal
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setName("");
      setEmail("");
      setMobile("");
      setVehicleType("");
      setBrand("");
      setYear("");
      setModel("");
      setState("");
      setCity("");
      setUber(false);
      setBrands([]);
      setYears([]);
      setModels([]);
      setCities([]);
      setQuotationCode(null);
      setSuccessMessage(null);
      
      // Remover qualquer URL de redirecionamento armazenada
      localStorage.removeItem('redirectUrl');
    }
  }, [isOpen]);

  // Step 1: Enviar dados pessoais
  async function handleStep1() {
    if (!name || !email || !mobile) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    const body = {
      h: COMPANY_HASH,
      name,
      email,
      phone: mobile
    };
    const res = await fetch("https://app.powercrm.com.br/qttnStep1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.id > 0) {
      setQuotationCode(data.back);
      setStep(2);
    } else {
      alert(data.text || "Erro ao enviar dados.");
    }
  }

  // Step 2: Enviar dados do veículo
  async function handleStep2() {
    if (!quotationCode) return;
    if (!vehicleType || !brand || !year || !model) {
      alert("Preencha todos os campos obrigatórios do veículo.");
      return;
    }
    const body = {
      code: quotationCode,
      h: COMPANY_HASH,
      vhclTyp: Number(vehicleType),
      vhclModel: Number(model),
      vhclYear: Number(year)
    };
    const res = await fetch("https://app.powercrm.com.br/qttnStep2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.id > 0) {
      setStep(3);
    } else {
      alert(data.text || "Erro ao enviar dados do veículo.");
    }
  }

  // Step 3: Enviar dados de localização e uso
  async function handleStep3() {
    if (!quotationCode) return;
    if (!state || !city) {
      alert("Selecione o estado e a cidade.");
      return;
    }
    const body = {
      code: quotationCode,
      h: COMPANY_HASH,
      cty: Number(city),
      workVehicle: uber
    };
    
    try {
      const res = await fetch("https://app.powercrm.com.br/qttnStep3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (data.id <= 0) {
        alert(data.text || "Erro ao finalizar cotação.");
      } else {
        // Definimos a mensagem de sucesso, sem tentar redirecionar automaticamente
        setSuccessMessage("Cotação enviada com sucesso!");
        
        // Armazenamos a URL para redirecionamento em localStorage
        // para poder recuperá-la quando o usuário clicar no botão
        localStorage.setItem('redirectUrl', `https://app.powercrm.com.br/noPlan?h=${COMPANY_HASH}&=undefined`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Ocorreu um erro ao enviar a cotação. Tente novamente.");
    }
  }
  
  // Função de redirecionamento totalmente reescrita
  const handleRedirect = () => {
    try {
      // Tenta recuperar a URL do localStorage
      const redirectUrl = localStorage.getItem('redirectUrl') || 
        `https://app.powercrm.com.br/noPlan?h=${COMPANY_HASH}&=undefined`;
      
      // Limpa o localStorage para evitar problemas em futuras interações
      localStorage.removeItem('redirectUrl');
      
      // Usa window.open que tem melhor compatibilidade com políticas de popup
      window.open(redirectUrl, '_self');
      
      // Método alternativo se window.open não funcionar
      setTimeout(() => {
        if (document.hasFocus()) { // Se ainda estiver na mesma página após 100ms
          const a = document.createElement('a');
          a.href = redirectUrl;
          a.target = '_self';
          a.rel = 'noopener noreferrer';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        }
      }, 100);
    } catch (e) {
      console.error("Erro ao redirecionar:", e);
      alert("Houve um problema ao redirecionar. Por favor, clique novamente no botão ou copie este link: https://app.powercrm.com.br/noPlan?h=" + COMPANY_HASH);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      contentLabel="Cotação"
      shouldCloseOnOverlayClick={true}
    >
      <button
        className="close"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          background: "none",
          border: "none",
          fontSize: 28,
          cursor: "pointer"
        }}
        aria-label="Fechar"
      >
        ×
      </button>
      <div className="box-call-to-action-form pwr_form">
        {successMessage ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              fontSize: "1.2rem",
              color: "#4a1818",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#4a1818" opacity="0.1"/>
              <path d="M7 13l3 3 7-7" stroke="#4a1818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{marginTop: 16}}>{successMessage}</div>
            
            {/* Botão de redirecionamento com estilo mais destacado */}
            <div style={{marginTop: 24, width: "100%", maxWidth: 300}}>
              <p style={{fontSize: "0.9rem", marginBottom: 10, color: "#666"}}>
                Para continuar e ver suas cotações disponíveis, clique no botão abaixo:
              </p>
              <a 
                href={`https://app.powercrm.com.br/noPlan?h=${COMPANY_HASH}&=undefined`}
                target="_self"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "15px 20px",
                  width: "100%",
                  fontSize: "1.1rem",
                  backgroundColor: "#4a1818",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                  textDecoration: "none"
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleRedirect();
                }}
              >
                Ver cotações disponíveis
              </a>
            </div>
          </div>
        ) : (
        <>
        <span style={{fontWeight: 600, fontSize: "1.2rem"}}>Proteja seu veículo. Faça sua cotação!</span>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="step" id="pwr_step_1">
            <div className="group-form">
              <label>Meu nome é:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="group-form">
              <label>Envie a cotação para meu e-mail:</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="group-form">
              <label>ou para o meu Whatsapp:</label>
              <input
                type="text"
                value={formatWhatsapp(mobile)}
                onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                maxLength={15}
              />
            </div>
            <div className="group-form">
              <button
                className="button"
                onClick={handleStep1}
                id="pwr_step_1_next"
              >
                Próximo passo
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="step" id="pwr_step_2">
            <div className="group-form">
              <label style={{fontSize: "1.5rem"}}>Tipo de veículo:</label>
              <div className="vehicle-type-group">
                <button
                  type="button"
                  className={`vehicle-type-btn${vehicleType === "1" ? " selected" : ""}`}
                  onClick={() => setVehicleType("1")}
                >
                  Carro
                </button>
                <button
                  type="button"
                  className={`vehicle-type-btn${vehicleType === "2" ? " selected" : ""}`}
                  onClick={() => setVehicleType("2")}
                >
                  Moto
                </button>
                <button
                  type="button"
                  className={`vehicle-type-btn${vehicleType === "3" ? " selected" : ""}`}
                  onClick={() => setVehicleType("3")}
                >
                  Caminhão
                </button>
              </div>
            </div>
            <div className="row-flexbox" style={{gap: 12}}>
              <div className="group-form two-col">
                <label htmlFor="pwr_field_brand">Marca</label>
                <select
                  id="pwr_field_brand"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  disabled={!brands.length}
                >
                  <option value="">Selecione</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.text}</option>
                  ))}
                </select>
              </div>
              <div className="group-form two-col">
                <label htmlFor="pwr_field_year">Ano</label>
                <select
                  id="pwr_field_year"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  disabled={!years.length}
                >
                  <option value="">Selecione</option>
                  {years.map(y => (
                    <option key={y.id} value={y.id}>{y.text}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="group-form">
              <label htmlFor="pwr_field_model">Modelo</label>
              <select
                id="pwr_field_model"
                value={model}
                onChange={e => setModel(e.target.value)}
                disabled={!models.length}
              >
                <option value="">Selecione</option>
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.text}</option>
                ))}
              </select>
            </div>
            <div className="row-flexbox" style={{gap: 12}}>
              <button
                className="back"
                onClick={() => setStep(1)}
                id="pwr_step_2_back"
              >
                <i className="icon-left"></i>
              </button>
              <button
                className="button"
                onClick={handleStep2}
                id="pwr_step_2_next"
                disabled={!vehicleType || !brand || !year || !model}
              >
                Próximo passo
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="step" id="pwr_step_3">
            <div className="group-form">
              <label htmlFor="pwr_field_state">Moro no Estado:</label>
              <select
                id="pwr_field_state"
                value={state}
                onChange={e => setState(e.target.value)}
              >
                <option value="">Selecione</option>
                {states.map(s => (
                  <option key={s.id} value={s.id}>{s.text}</option>
                ))}
              </select>
            </div>
            <div className="group-form">
              <label>Na cidade:</label>
              <select
                id="pwr_field_city"
                value={city}
                onChange={e => setCity(e.target.value)}
                disabled={!cities.length}
              >
                <option value="">Selecione</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.text}</option>
                ))}
              </select>
            </div>
            <div className="group-form">
              <label>Você usa o seu veículo em Taxi ou Aplicativo?</label>
              <div className="box-input">
                <input
                  id="pwr_field_uber"
                  type="checkbox"
                  className="option-input checkbox"
                  checked={uber}
                  onChange={e => setUber(e.target.checked)}
                />
                <label htmlFor="pwr_field_uber" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: 500, marginRight: "5px" }}>Sim</span>
                  <span style={{ 
                    fontSize: "0.85em", 
                    color: "#666", 
                    fontStyle: "italic"
                  }}>
                    (deixe desmarcado caso não utilize)
                  </span>
                </label>
              </div>
            </div>
            <div className="row-flexbox" style={{gap: 12}}>
              <button
                className="back"
                onClick={() => setStep(2)}
                id="pwr_step_3_back"
              >
                <i className="icon-left"></i>
              </button>
              <button
                className="button"
                id="pwr_step_3_go"
                onClick={handleStep3}
                disabled={!state || !city}
              >
                Receber Cotação
              </button>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </Modal>
  );
};

export default CotationModal;