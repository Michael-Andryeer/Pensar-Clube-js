import React, { useState } from 'react';
import CotationModal from './CotationModal';

const BannerButtons = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="banner_btn s2-main-navigation clearfix ul-li">
        <div className="btn" onClick={() => setModalOpen(true)}>
          <a href="#">Benefícios</a>
        </div>
        <div className="btn">
          <ul>
            <li>
              <a href="https://pensarclubeapp.flutterflow.app/" className="saber">
                <img 
                  src="/images/svg.svg" 
                  alt="Imagem" 
                  className="icon"
                  style={{ marginRight: '10px', verticalAlign: 'middle' }}
                />
                Ir ao APP
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className='modalaberto'>
      <CotationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </>
  );
};

export default BannerButtons;