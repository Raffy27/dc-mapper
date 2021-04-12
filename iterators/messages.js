const { Parts } = require('../logic/dynamic_parts'),
    { until } = require('selenium-webdriver');

/**
 * 
 * @param {import('selenium-webdriver').WebDriver} drv 
 */
module.exports = (drv) => {
    return {

        async getMessages(){
            await drv.wait(until.elementLocated(Parts.get('Result')));
            let arr = await drv.findElements(Parts.get('Result'));
            for(let i = 0; i < arr.length; i++){
                arr[i] = await arr[i].getText();
            }
            if(arr.length == 0){
                await new Promise(r => setTimeout(r, 15000));
            }
            return arr;
        },

        async getInvites(){
            let set = new Set();
            let messages = await this.getMessages();
            for(const msg of messages){
                let invs = msg.match(/discord\.gg\/[a-zA-Z0-9]+/gm);
                if(!invs) continue;
                for(const inv of invs){
                    set.add(inv);
                }
            }
            return set;
        }

    }
};