import React from 'react';
import BannerContent from './BannerContent';
import BannerMockup from './BannerMockups';
import BannerShapes from './BannerShapes';

const Banner = () => {
  return (
    <section id="saas_two_banner" className="saas_two_banner_section relative-position">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="s2-banner_area relative-position">
              <BannerContent />
              <BannerMockup />
            </div>
          </div>
        </div>
      </div>
      <BannerShapes />
    </section>
  );
};

export default Banner;