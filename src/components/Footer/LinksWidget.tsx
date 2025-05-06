import React from 'react';
import { footerLinks } from './FooterLinks';

const LinksWidget = () => {
  return (
    <div className="s2_footer_widget clearfix ul-li-block saas2-headline">
      <div className="s2_footer_menu">
        <h3 className="s2_widget_title">
          <span>Links</span>
          <i></i>
        </h3>
        <ul>
          {footerLinks.map((link, index) => (
            <li key={index}>
              <a target="_blank" rel="noopener noreferrer" href={link.url}>
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LinksWidget;