import React from 'react';

const BannerButtons = () => {
  return (
    <div className="banner_btn s2-main-navigation clearfix ul-li">
      <div className="btn" data-toggle="modal" data-target="#cotation">
        <a href="#">Benefícios</a>
      </div>
      <div className="btn">
        <ul>
          <li>
            <a href="https://pensarclubeapp.flutterflow.app/" className="saber">
              <img 
                src="assets/img/svg.svg" 
                alt="Imagem" 
                className="icon"
                style={{ marginRight: '10px', verticalAlign: 'middle' }}
              />
              Ir ao APP
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BannerButtons;