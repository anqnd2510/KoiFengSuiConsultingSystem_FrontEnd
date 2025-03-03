import React from "react";
import PropTypes from "prop-types";

const Header = ({ title, description, className = "" }) => {
  return (
    <div className={`bg-[#B89D71] p-4 ${className}`}>
      <h1 className="text-white text-xl font-semibold">
        {title}
      </h1>
      {description && (
        <p className="text-white/80 text-sm">
          {description}
        </p>
      )}
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
};

export default Header; 