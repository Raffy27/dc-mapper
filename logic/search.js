const { Parts } = require('./dynamic_parts'),
    { until, Key } = require('selenium-webdriver');

async function wait(ms){
    return new Promise(r => setTimeout(r, ms));
}

/**
 * 
 * @param {import('selenium-webdriver').WebDriver} drv 
 */
async function initSearch(drv){
    const sb = await drv.wait(until.elementLocated(Parts.get('Search')));
    await drv.wait(until.elementIsVisible(sb));
    await sb.sendKeys('discord.gg', Key.ENTER);
    await wait(700);
}

module.exports = initSearch;