import * as React from "react";

interface AddressProps {
  address: {
    line1?: string;
    line2?: string;
    postalCode?: string;
  };
}

const Address: React.FC<AddressProps> = ({ address }) => {
  return (
    <>
      <address>
        <div className="address-row">
          <span>{address.line1}</span>
        </div>
        <div className="address-row">
          <span>{address.line2}</span>
        </div>
        <div className="address-row">
          <span>{address.postalCode}</span>
        </div>
      </address>
    </>
  );
};

export default Address;
