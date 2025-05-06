import React from 'react';
import { FAQItem as FAQItemType } from './FAQItem';

interface FAQItemProps extends FAQItemType {
  isFirst: boolean;
}

const FAQItem = ({ question, answer, id, isFirst }: FAQItemProps) => {
  return (
    <div className="s2_faq">
      <div className="s2_faq-header" id={`heading${id}`}>
        <button 
          className={`${isFirst ? '' : 'collapsed'}`}
          type="button"
          data-toggle="collapse" 
          data-target={`#collapse${id}`}
          aria-expanded={isFirst ? "true" : "false"}
          aria-controls={`collapse${id}`}
        >
          {question}
        </button>
      </div>
      <div 
        id={`collapse${id}`} 
        className={`collapse ${isFirst ? 'show' : ''}`} 
        aria-labelledby={`heading${id}`}
        data-parent="#accordionExample"
      >
        <div className="s2_faq-body">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;