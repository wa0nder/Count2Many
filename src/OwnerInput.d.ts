import React from "react";
import PropTypes from "prop-types";
export declare const UPDATE_OWNER = "UPDATE_OWNER";
export declare function ownerInputReducer(state: any, action: any): any;
declare function OwnerInput(): React.JSX.Element;
declare namespace OwnerInput {
    var propTypes: {
        updateOnwer: PropTypes.Validator<(...args: any[]) => any>;
    };
}
export default OwnerInput;
