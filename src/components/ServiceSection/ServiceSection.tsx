import ServiceCard from './ServiceCard';
import SectionTitle from './SectionTitle';
import { servicesData } from './servicesData';
import React from "react";

const ServicesSection = () => {
  return (
    <section id="servico" className="saas_two_service_section">
      <div className="container">
        <SectionTitle />
        <div className="service_content">
          <div className="row justify-content-md-center">
            {servicesData.map((service, index) => (
              <ServiceCard 
                key={index}
                {...service}
                delay={`${(index % 3) * 300}ms`}
              />
            ))}
          </div>
        </div>
        <div className="service_read_more text-center">
          <button type="submit" data-toggle="modal" data-target="#cotation">
            Upgrade de plano!
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;