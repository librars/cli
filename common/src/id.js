/**
 * id.js
 * Andrea Tino - 2020
 * 
 * Handling unique ids.
 */

const uuidv4 = require("uuid").v4;

/**
 * Generates a unique ID.
 * 
 * @param {boolean} withTimestamp A value indicating whether the id should include the timestamp.
 * @returns {string} The unique ID.
 */
export function generateId(withTimestamp) {
    withTimestamp = withTimestamp || false;

    const id = uuidv4();

    return withTimestamp ? `${getCurrentTimestampAsId()}_${id}` : `${id}`;
}

function getCurrentTimestampAsId() {
    const pad = (x) => x.length < 1 ? `0${x}` : `${x}`;

    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; // Months range in 0-11
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const seconds = dateObj.getUTCSeconds();
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();

    return `${year}${pad(month)}${pad(day)}T${pad(hours)}${pad(minutes)}${pad(seconds)}`;
}
