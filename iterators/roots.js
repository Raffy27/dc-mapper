const { By, Key } = require('selenium-webdriver'),
    { Parts } = require('../logic/dynamic_parts');

/**
 * 
 * @param {import('selenium-webdriver').WebDriver} drv 
 */
module.exports = (drv) => {

    const asyncIterator = {
        next: async () => {
            let ch, url = await drv.getCurrentUrl();
            const body = drv.findElement(By.css('body'));
            await body.sendKeys(Key.CONTROL, Key.ALT, Key.ARROW_DOWN, Key.NULL);
            await drv.wait(async _drv => {
                ch = await _drv.getCurrentUrl();
                return ch != url;
            });
    
            if(ch.includes('/channels/@me')){
                return Promise.resolve({ done: true });
            }
    
            return Promise.resolve({
                value: {
                    id: ch.split('/').slice(-2)[0],
                    name: await (await drv.findElement(Parts.get('Header'))).getText()
                },
                done: false
            });
        }
    };

    const servers = {
        [Symbol.asyncIterator]: () => asyncIterator
    };

    return servers;

};