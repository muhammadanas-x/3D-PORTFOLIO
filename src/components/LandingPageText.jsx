import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';

const LandingPageText = ({ setShowMore }) => {
  const [disabled, setDisabled] = useState(false);

  // Handle button click
  const handleClick = () => {
    if (!disabled) {
      setShowMore((prevState) => !prevState);
      setDisabled(true);
    }
  };

  return (
    <div className='mainContainer'>
      <h1 className={`main-title ${disabled ? 'disabled' : ''}`}>
        MUHAMMAD ANAS
      </h1>
      <h2 className={`sub-title ${disabled ? 'disabled' : ''}`}>
        A Creative Developer Portfolio
      </h2>

     
    </div>
  );
};

export default LandingPageText;
