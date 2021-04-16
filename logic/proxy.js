const proxies = require('../config/proxy.json'),
    { setTimeout } = require('timers/promises');

for(let i = 0; i < proxies.length; i++){
    proxies[i].uses = 0;
    proxies[i].blocked = false;
}

let index = 0;

module.exports = {
    
    get(){
        if(index < 0) return false;
        proxies[index].uses++;
        return {
            host: proxies[index].host,
            port: proxies[index].port
        }
    },

    async rotate(retry){
        if(index > -1 && typeof retry != 'undefined'){
            proxies[index].blocked = true;
            let r = new Date();
            r.setSeconds(r.getSeconds() + retry);
            proxies[index].retry = r;
        }

        //Find a proxy that has not been blocked
        index = proxies.findIndex(v => !v.blocked);
        if(index > -1){
            process.stdout.write(`...\n[Switching proxies --> ${proxies[index].host}]\n\t\t\t\t`);
            return;
        }
        //If every proxy is blocked, find the one we have to wait for the least
        index = 0;
        let minWait = proxies[0].retry;
        for(let j = 1; j < proxies.length; j++){
            if(proxies[j].retry < minWait){
                index = j;
                minWait = proxies[j].retry;
            }
        }
        let wait = new Date() - minWait;
        process.stdout.write(`...\n[Waiting for a free proxy --> ${proxies[index].host} (${wait}ms)]\n\t\t\t\t`);
        global.ac = new AbortController();
        await setTimeout(wait, null, { signal: global.ac.signal });
        proxies[index].blocked = false;
    }

};