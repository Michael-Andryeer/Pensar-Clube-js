import React from 'react';
import FeatureItem from './FeatureItemProps';
import { featureItems } from './FeatureItems';

const FeatureList = () => {
  return (
    <div className="col-lg-6 col-md-12">
      <div className="s2-feature_right">
        {featureItems.map((item, index) => (
          <FeatureItem 
            key={index}
            {...item}
            delay={`${index * 100}ms`}
            className={`s2-feature_list ${item.className || ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureList;