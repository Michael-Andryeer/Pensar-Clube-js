import React from 'react';
import AboutWidget from './AboutWidget';
import LinksWidget from './LinksWidget';
import ContactWidget from './ContactWidget';

const FooterContent = () => {
  return (
    <div className="footer_content pera-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-12">
            <AboutWidget />
          </div>
          <div className="col-lg-4 col-md-12">
            <LinksWidget />
          </div>
          <div className="col-lg-4 col-md-12">
            <ContactWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterContent;