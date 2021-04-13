const proxies = require('../config/proxy.json');

for(let i = 0; i < proxies.length; i++){
    proxies[i].uses = 0;
    proxies[i].blocked = false;
}

let index = -1;

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
        if(index > -1){
            proxies[index].blocked = true;
            let r = new Date();
            r.setSeconds(r.getSeconds() + retry);
            proxies[index].retry = r;
            console.log(proxies[index]);
        }

        if(index < proxies.length - 1){
            index++;
        } else {
            index = 0;
        }

        if(proxies[index].blocked){
            console.log('All proxies are blocked');
            let wait = proxies[index].retry - new Date();
            if(wait > 0){
                console.log('Waiting', wait, 'ms');
                await new Promise(r => setTimeout(r, wait));
                console.log('Waiting done');
            }
            proxies[index].blocked = false;
        }
    }

};