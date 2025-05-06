import React from 'react';
import BannerButtons from './BannerButtons';

const BannerContent = () => {
  return (
    <div className="s2-banner_content saas2-headline pera-content">
      <h1>
        
        <span>Associação sem fins lucrativos pensada</span> para você!
      </h1>
      <p>
        A Pensar Clube é uma associação de socorro mútuo, que tem por objetivo proporcionar aos
        seus associados os melhores benefícios para a garantia de dias mais tranquilos.
      </p>
      <p>
        Assistência 24h: <span className="negrito">0800 943 0303</span>
      </p>
      <BannerButtons />
    </div>
  );
};

export default BannerContent;