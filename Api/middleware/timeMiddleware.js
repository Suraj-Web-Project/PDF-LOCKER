const DEPLOYMENT_TIME = Date.now();
const TWENTY_MINUTES = 20 * 60 * 1000;

const checkTimeLimit = (req, res, next) => {
  const timeElapsed = Date.now() - DEPLOYMENT_TIME;

  if (timeElapsed > TWENTY_MINUTES) {
    return res.status(403).json({
      message: "Resume submission time has expired.",
    });
  }

  next();
};

const getStatus = (req, res) => {
  const timeElapsed = Date.now() - DEPLOYMENT_TIME;
  res.json({ isExpired: timeElapsed > TWENTY_MINUTES });
};

module.exports = { checkTimeLimit, getStatus };