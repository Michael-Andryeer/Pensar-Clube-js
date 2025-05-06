import React from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import ActionButtons from './ActionButtons';

export const Header = () => {
  return (
    <header id="header_main" className="saas_two_main_header">
      <div className="container">
        <div className="s_main_menu">
          <div className="row">
            <div className="col-md-2">
              <Logo />
            </div>
            <div className="col-md-10">
              <div className="main_menu_list clearfix float-right">
                <Navigation />
                <ActionButtons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};