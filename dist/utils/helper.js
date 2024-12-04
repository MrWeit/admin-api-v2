"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showSuccess = exports.showError = void 0;
//--------------Response Functions
//Validation error
const showError = (req, res, message, options = {}) => {
    //If translations is undefined
    if (options.translation === undefined) {
        options.translation = true;
    }
    let resData = {
        status: "error" /* ResponseStatus.error */,
        message: message,
        error_code: 5001 /* ResponseErrorCodes.common */,
        error_description: options.error_description,
        error: options.error,
    };
    res.status((options === null || options === void 0 ? void 0 : options.status_code) || 400).json(resData);
};
exports.showError = showError;
//Success Response
const showSuccess = (req, res, message, options = {}) => {
    //If translations is undefined
    if (options.translation === undefined) {
        options.translation = true;
    }
    let resData = {
        status: "success" /* ResponseStatus.success */,
        message: message,
        data: options.data,
    };
    res.status(options.status_code || 200).json(resData);
};
exports.showSuccess = showSuccess;
