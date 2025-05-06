import React from 'react';
import { socialLinks } from './FooterLinks';

const ContactWidget = () => {
  return (
    <div className="s2_footer_widget clearfix ul-li-block saas2-headline">
      <div className="s2_footer_social">
        <h3 className="s2_widget_title">
          <span>Contatos</span>
          <i></i>
        </h3>
        <span className="end">Endereço:</span>
        <br />
        <p>Rua Tereza Bezerra Salustino, 1902 - Lagoa nova, Natal/RN</p>
        <br />
        <h4>Telefone: (84) 3013-4747</h4>
        <br />
        <div className="social-links">
          {socialLinks.map((social, index) => (
            <a 
              key={index}
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className={`${social.icon} ${social.className}`}></i>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactWidget;