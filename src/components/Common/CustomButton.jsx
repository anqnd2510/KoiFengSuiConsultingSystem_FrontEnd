import { Button } from "antd";
import PropTypes from "prop-types";

const CustomButton = ({ 
  type = "primary", 
  className = "", 
  onClick, 
  children,
  danger = false,
  icon,
  htmlType,
  loading,
  size
}) => {
  return (
    <Button
      type={type}
      className={`${className}`}
      onClick={onClick}
      danger={danger}
      icon={icon}
      htmlType={htmlType}
      loading={loading}
      size={size}
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
  icon: PropTypes.node,
  htmlType: PropTypes.string,
  loading: PropTypes.bool,
  size: PropTypes.string
};

export default CustomButton; 