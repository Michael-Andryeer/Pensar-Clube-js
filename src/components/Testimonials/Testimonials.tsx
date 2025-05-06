import React from 'react';
import TestimonialImage from './TestimonialImage';
import TestimonialContent from './TestimonialContent';

const Testimonials = () => {
  return (
    <section id="depoimentos" className="integration_section">
      <div className="container">
        <div className="row">
          <TestimonialImage />
          <TestimonialContent />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;