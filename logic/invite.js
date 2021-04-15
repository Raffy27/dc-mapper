const got = require('got'),
    tunnel = require('tunnel'),
    proxy = require('./proxy');

module.exports = {

    getCode(url){
        url = url.split('/');
        if(!url.length){
            throw new Error('Invalid invite url');
        }
        return url.pop();
    },

    async getDetails(code){
        try {
            const p = proxy.get();
            let options = {
                responseType: 'json',
                retry: 0
            };
            if(p){
                options.agent = {
                    https: tunnel.httpsOverHttp({
                        proxy: p
                    })
                };
            }
            const { body } = await got(`https://discord.com/api/v8/invites/${code}?with_counts=true`, options);
            return body;
        } catch (err) {
            if(err instanceof got.HTTPError){
                switch(err.response.statusCode){
                    case 429:
                        const wait = Number(err.response.headers['retry-after']);
                        await proxy.rotate(wait);
                        return await this.getDetails(code);
                    case 404:
                        throw new Error('Invalid');
                }
            }
            if(err instanceof got.RequestError){
                //Proxy server doesn't like us
                await proxy.rotate();
                return await this.getDetails('code');
            }
            throw err;
        }
    }

};