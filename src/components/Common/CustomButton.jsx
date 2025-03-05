import { Button } from "antd";
import PropTypes from "prop-types";

const CustomButton = ({ 
  type = "primary", 
  className = "", 
  onClick, 
  children,
  danger = false,
  icon
}) => {
  return (
    <Button
      type={type}
      className={`${className}`}
      onClick={onClick}
      danger={danger}
      icon={icon}
    >
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  danger: PropTypes.bool,
  icon: PropTypes.node
};

export default CustomButton; 