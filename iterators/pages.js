const { Parts } = require('../logic/dynamic_parts'),
    { until } = require('selenium-webdriver');

/**
 * 
 * @param {import('selenium-webdriver').WebDriver} drv 
 */
module.exports = (drv) => {
    return {
        async *[Symbol.asyncIterator]() {
            let counter = 0;

            const status = await drv.wait(until.elementLocated(Parts.get('SearchStatus')));
            let text;
            await drv.wait(async _drv => {
                text = await status.getText();
                return !text.includes('Searching');
            });
            if(text.includes('No Results')) return;
            yield counter++;

            while(true){
                let next;
                try {
                    next = await drv.wait(until.elementLocated(Parts.get('Next')), 4000);
                } catch {
                    //No Next button, there had to be a single page
                    return;
                }
                if(!(await next.isEnabled())){
                    //This is the last page
                    return;
                }
                await next.click();
                yield counter++;
            }
        }
    };
};