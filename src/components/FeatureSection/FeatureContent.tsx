import React from 'react';

const FeatureContent = () => {
  return (
    <div className="col-lg-6 col-md-12 wow fadeFromUp" data-wow-delay="300ms" data-wow-duration="1500ms">
      <div className="s2-feature_left">
        <div className="s2-feature_text saas2-headline pera-content">
          <span className="feature_tag">Associação</span>
          <h2>Conheça a Pensar Clube!</h2>
          <p>
            A Pensar Clube Associados é uma associação sem fins lucrativos, fundamentada na
            Constituição Federal de 1988 (Art. 5º, XVII a XXI) e no Código Civil (Art. 53 e
            seguintes). Visa defender e promover os interesses dos associados, oferecendo
            benefícios e amparo conforme seu regulamento. Suas atividades são norteadas pelo
            princípio do associativismo, operando através de assistência mútua e acordos
            coletivos para divisão de despesas e cooperação recíproca entre seus membros.
          </p>
          <div className="saas_btn" typeof="submit" data-toggle="modal" data-target="#cotation">
            <button>Incluir meu novo veículo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureContent;