import React from 'react';
import FAQItem from './FAQItemProps';
import { faqData } from './FAQData';

const FAQContent = () => {
  const perguntasEsquerda = faqData.filter(item => item.coluna === "esquerda");
  const perguntasDireita = faqData.filter(item => item.coluna === "direita");

  return (
    <div className="s2_faq_content">
      <div className="accordion" id="accordionExample">
        <div className="row">
          <div className="col-lg-6 col-md-12">
            {perguntasEsquerda.map((item, index) => (
              <FAQItem 
                key={item.id}
                {...item}
                isFirst={index === 0}
              />
            ))}
          </div>
          <div className="col-lg-6 col-md-12">
            {perguntasDireita.map((item, index) => (
              <FAQItem 
                key={item.id}
                {...item}
                isFirst={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQContent;