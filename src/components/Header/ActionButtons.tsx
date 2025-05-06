import React from 'react';

const ActionButtons = () => {
  return (
    <div className="linha-btn-section">
      <nav className="area-associado">
        <ul id="area-associado" className="navbar-nav text-capitalize clearfix">
          <li>
            <a
              target="_blank"
              className="nav-link"
              href="https://kepler.hinova.com.br/sga/area/v5/auth/bcb4376ef8622eeb587d0c783c68b83796a023a32a89df3f2c8659482791f476bfd3f572d4a0bb8a2760c59e419adfc17ebce7fec56ab35ba776fa042f57ef6b114d2754efb7b4d08b788e722b85dfd9fdc6572bb2d7c3ed1a16e7722dcb3ce4"
            >
              Área do associado
            </a>
          </li>
        </ul>
      </nav>
      <div className="saas_sign_up_btn text-center">
        <a href="#boleto">2ª Via do boleto</a>
      </div>
    </div>
  );
};

export default ActionButtons;