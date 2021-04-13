const axios = require('axios').default;

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
            const res = await axios.get(`https://discord.com/api/v8/invites/${code}?with_counts=true`);
            return res.data;
        } catch (err) {
            switch(err.response?.status){
                case 429:
                    console.log('Rate limit:', err.response.headers['retry-after']);
                    //Change proxy
                    return await this.getDetails(code);
                    break;
                case 404:
                    throw new Error('Invalid Invite');
                default:
                    throw err;
            }
        }
    }

};