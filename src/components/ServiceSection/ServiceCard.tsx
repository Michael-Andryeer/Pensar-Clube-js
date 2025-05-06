import React from "react";


const ServiceCard = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="col-lg-4 col-md-6 wow fadeFromUp" 
      data-wow-delay={delay} 
      data-wow-duration="1500ms"
    >
      <div className="service_content_box relative-position">
        <div className="service_icon_box relative-position">
          <div className="upper_icon">
            <img src={icon} alt={`Ícone ${title}`} />
          </div>
          <div className="lower_icon" />
        </div>
        <div className="service_text_box saas2-headline pera-content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;