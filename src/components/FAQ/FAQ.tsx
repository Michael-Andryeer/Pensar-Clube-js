import React from 'react';
import FAQContent from './FAQContentProps';
import './FAQ.css';

const FAQ = () => {
  return (
    <section id="s2-faq" className="s2-faq_section relative-position">
      <div className="container">
        <div className="saas_two_section_title saas2-headline text-center">
          <span className="title_tag">
            Perguntas frequentes
          </span>
          <h2>
            Tire suas dúvidas
          </h2>
        </div>
        <FAQContent />
      </div>
    </section>
  );
};

export default FAQ;