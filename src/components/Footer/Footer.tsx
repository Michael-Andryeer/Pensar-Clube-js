import React from 'react';
import NewsletterSection from './NewsLetterSection.tsx';
import FooterContent from './FooterContent';
import Copyright from './Copyright';

const Footer = () => {
  return (
    <>
      <footer id="boleto" className="saas_two_footer_section relative-position">
        <NewsletterSection />
        <FooterContent />
      </footer>
      <Copyright />
    </>
  );
};

export default Footer;