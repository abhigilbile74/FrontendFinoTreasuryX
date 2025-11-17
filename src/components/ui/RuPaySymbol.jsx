// src/components/common/RuPaySymbol.jsx
import React from 'react';

// You can customize the logo URL or even import a local image if you have one.
const RUPAY_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/8/88/RuPay_Logo.svg";

// A reusable RuPay symbol component
const RuPaySymbol = ({ showLogo = true, showRupee = true, size = 20 }) => {
  return (
    <span className="inline-flex items-center gap-1">
      {showLogo && (
        <img
          src={RUPAY_LOGO_URL}
          alt="RuPay Logo"
          width={size}
          height={size}
          className="inline-block align-middle"
        />
      )}
      {showRupee && <span className="text-base font-semibold">₹</span>}
    </span>
  );
};

export default RuPaySymbol;
