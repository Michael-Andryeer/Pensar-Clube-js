import React from 'react';

const Navigation = () => {
  const navLinks = [
    { href: '#saas_two_banner', text: 'Home' },
    { href: '#servico', text: 'Serviços' },
    { href: '#saas_two_feature', text: 'Associação' },
    { href: '#depoimentos', text: 'Depoimentos' },
    { 
      href: 'https://api.whatsapp.com/send/?phone=558430134747&text=�+Olá%21+Estou+interessado+na+assistência+veicular+da+Pensar+Clube&type=phone_number&app_absent=0',
      text: 'Fale conosco',
      target: '_blank'
    }
  ];

  return (
    <nav className="s2-main-navigation clearfix ul-li">
      <ul id="main-nav" className="navbar-nav text-capitalize clearfix">
        {navLinks.map((link, index) => (
          <li key={index}>
            <a 
              className="nav-link" 
              href={link.href}
              target={link.target}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;