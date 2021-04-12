const { Parts } = require('./dynamic_parts'),
    { until, Key } = require('selenium-webdriver');

/**
 * 
 * @param {import('selenium-webdriver').WebDriver} drv 
 */
async function initSearch(drv){
    const sb = await drv.wait(until.elementLocated(Parts.get('Search')));
    await sb.sendKeys('discord.gg', Key.ENTER);
}

module.exports = initSearch;