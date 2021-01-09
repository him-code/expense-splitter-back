const { sendResponse } = require("../utils/responseHandler");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("xauth");

    if (!token) return sendResponse(res, 400, "Missing token", {});

    if (token != '12345678') return sendResponse(res, 400, "Invalid token", {});

    // const decoded = await verifyAuthToken(token);
    // if(decoded['error'])
    //     throw {error: new Error('Token is invalid or expired!'), code: 401};

    // var authEntry = await authModel.getAuthEntry(decoded);
    // if(authEntry['error'])
    //     throw {error: new Error(authEntry.error['message']), code:authEntry.error['code']};

    req.user = authEntry;

    next();
  } catch (err) {
    console.log(`Error while authenticating user!`);
    return sendResponse(res, 400, "Request cannot be completed!", {});
  }
};

export default authenticate;
