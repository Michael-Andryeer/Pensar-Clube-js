import React from 'react';

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  delay: string;
  className: string;
}

const FeatureItem = ({ icon, title, description, delay, className }: FeatureItemProps) => {
  return (
    <div 
      className={className}
      data-wow-delay={delay}
      data-wow-duration="1500ms"
    >
      <div className="s2-feature_icon text-center relative-position">
        <img src={icon} alt={`Ícone ${title}`} />
      </div>
      <div className="s2-feature_text_box saas2-headline pera-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureItem;