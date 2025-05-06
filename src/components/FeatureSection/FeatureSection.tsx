import React from 'react';
import FeatureContent from './FeatureContent';
import FeatureList from './FeatureList';
import './FeatureSection.css';

const FeatureSection = () => {
  return (
    <section id="saas_two_feature" className="saas_two_feature_section">
      <div className="container">
        <div className="s2-feature_content">
          <div className="row">
            <FeatureContent />
            <FeatureList />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;