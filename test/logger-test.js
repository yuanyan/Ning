var assert = require('assert');
var logger = require('../service/logger');

logger.info("logger info test");
logger.warn("logger warn test");
logger.error("logger error test");

noexist();