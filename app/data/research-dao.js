/* The ResearchDAO must be constructed with a connected database object */
const logger = require('../utils/logger');

function ResearchDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ResearchDAO)) {
        logger.warn("Warning: ResearchDAO constructor called without 'new' operator");
        return new ResearchDAO(db);
    }

    this.getBySymbol = (symbol, callback) => {

        const searchCriteria = () => {

            if (symbol) {
                logger.warn("in if symbol");
                return {
                    symbol
                };
            }
        }
    }
}

module.exports = { ResearchDAO };
