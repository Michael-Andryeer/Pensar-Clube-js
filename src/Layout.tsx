import "./assets/css/animate.css"
import "./assets/css/common.css"
import "./assets/css/index.css"
import "./assets/css/normalize.css"
import "./assets/css/typography.css"
import "./assets/libs/bootstrap.min.js"
import "./assets/libs/jquery-3.3.1.slim.min.js"
import "./assets/libs/jquery.mask.min.js"
import "./assets/libs/popper.min.js"
import "./assets/libs/pwr.js"
import React from "react"

export function Layout() {
  <header id="header_main" className="saas_two_main_header">
        <div className="container">
            <div className="s_main_menu">
                <div className="row">
                    <div className="col-md-2">
                        <div className="brand_logo">
                            <a href="#"></a>
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="main_menu_list clearfix float-right">
                            <nav className="s2-main-navigation  clearfix ul-li">
                                <ul id="main-nav" className="navbar-nav text-capitalize clearfix">
                                    <li><a className="nav-link" href="#saas_two_banner">Home</a></li>
                                    <li><a className="nav-link" href="#servico">Serviços</a></li>
                                    <li><a className="nav-link" href="#saas_two_feature">Associação</a></li>
                                    <li><a className="nav-link" href="#depoimentos">Depoimentos</a></li>
                                    <li><a target="_blank" className="nav-link"
                                            href="https://api.whatsapp.com/send/?phone=558430134747&text=�+Olá%21+Estou+interessado+na+assistência+veicular+da+Pensar+Clube&type=phone_number&app_absent=0">Fale
                                            conosco</a></li>
                                </ul>
                            </nav>
                            <div className="linha-btn-section">
                                <nav className="area-associado">
                                    <ul id="area-associado" className="navbar-nav text-capitalize clearfix">
                                        <li><a target="_blank" className="nav-link"
                                                href="https://kepler.hinova.com.br/sga/area/v5/auth/bcb4376ef8622eeb587d0c783c68b83796a023a32a89df3f2c8659482791f476bfd3f572d4a0bb8a2760c59e419adfc17ebce7fec56ab35ba776fa042f57ef6b114d2754efb7b4d08b788e722b85dfd9fdc6572bb2d7c3ed1a16e7722dcb3ce4">Área
                                                do associado</a></li>
                                    </ul>
                                </nav>
                                <div className="saas_sign_up_btn text-center">
                                    <a href="#boleto">2ª Via do boleto</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
}