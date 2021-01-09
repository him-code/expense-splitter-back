const sendResponse = async (res, statusCode, message, data, header) => {
  try {
    if (header) {
      const head = Object.keys(header)[0];
      return res
        .header(head, header[head])
        .send({ status: statusCode, message: message, data: data || {} });
    }
    return res
      .status(statusCode)
      .send({ status: statusCode, message: message, data: data || {} });
  } catch (err) {
    console.log("Error executing sendResponse",err);
  }
};

module.exports = { sendResponse };
