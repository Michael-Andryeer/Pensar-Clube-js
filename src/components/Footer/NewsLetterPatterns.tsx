import React from 'react';

const NewsletterPatterns = () => {
  return (
    <>
      <div className="newsletter_pattern_1">
        <img src="/images/cotação.png" alt="" />
      </div>
      <div 
        className="cloud_anim newsletter_pattern_2"
        style={{backgroundImage: "url(https://old3.commonsupport.com/emu/wp-content/uploads/2021/02/cloud-2.png)"}}
      />
      <div 
        className="cloud_anim newsletter_pattern_3"
        style={{backgroundImage: "url(https://old3.commonsupport.com/emu/wp-content/uploads/2021/02/cloud-5.png)"}}
      />
      <div 
        className="newsletter_pattern_4"
        style={{backgroundImage: "url(/images/cotação.png)"}}
      />
      <div 
        className="newsletter_pattern_5"
        style={{backgroundImage: "url(/images/cotação.png)"}}
      />
    </>
  );
};

export default NewsletterPatterns;