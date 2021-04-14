const { By, Key, until } = require('selenium-webdriver'),
    { Parts } = require('./dynamic_parts');

/**
 * 
 * @param {import('selenium-webdriver').WebDriver} drv 
 * @param {*} inv 
 */
async function join(drv, inv){
    const body = drv.findElement(By.css('body'));
    await body.sendKeys(Key.CONTROL, Key.SHIFT, 'N', Key.NULL);
    const btn = drv.findElement(Parts.get('Join'));
    await drv.wait(until.elementIsVisible(btn));
    await btn.click();
    const txt = drv.findElement(Parts.get('JoinInput'));
    await txt.sendKeys(inv, Key.ENTER);
    await new Promise(r => setTimeout(r, 1000));
    const x = drv.findElement(By.xpath('//div[@role="dialog"]//button'));
    await x.click();
}

async function leave(drv){
    await drv.findElement(By.css('header')).click();
    const btn = drv.findElement(Parts.get('Leave'));
    await drv.wait(until.elementIsVisible(btn));
    await btn.click();
    await drv.findElement(By.css('body')).sendKeys(Key.ENTER);
}

module.exports = {
    join,
    leave
};