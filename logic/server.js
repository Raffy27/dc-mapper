const { By, Key, until } = require('selenium-webdriver'),
    { Parts } = require('./dynamic_parts');

async function wait(ms){
    return new Promise(r => setTimeout(r, ms));
}

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
    await wait(2500);
    const check = await drv.findElements(Parts.get('Invalid'));
    if(check.length > 0) return false;

    try {
        const x = await drv.wait(until.elementLocated(Parts.get('DialogX')), 3000);
        await x.click();
    } catch {}
    await wait(1700);

    return true;
}

async function leave(drv){
    await drv.findElement(By.css('header')).click();
    for(let i = 0; i < 2; i++){
        const btn = await drv.wait(until.elementLocated(Parts.get('Leave')));
        await drv.wait(until.elementIsVisible(btn));
        await btn.click();
    }
    await wait(700);
}

module.exports = {
    join,
    leave
};