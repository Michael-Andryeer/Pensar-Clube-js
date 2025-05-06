import React from 'react';
import NewsletterPatterns from './NewsLetterPatterns';

const NewsletterSection = () => {
  const handleCPFSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Implementar a lógica de busca do CPF aqui
    console.log('Buscando CPF...');
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
            <h6 className="cpfinválido">Digite um CPF válido!</h6>
            <input 
              className="cpf" 
              name="number" 
              type="text" 
              placeholder="Digite seu CPF" 
            />
            <div className="nws-button position-absolute text-capitalize loadercentral">
              <button 
                className="hover-btn btn btn-primary" 
                type="submit" 
                onClick={handleCPFSubmit}
                id="open-modal"
              >
                Resgatar
              </button>
              <div className="loader"></div>
            </div>
          </div>
        </div>
        <NewsletterPatterns />
      </div>
    </div>
  );
};

export default NewsletterSection;