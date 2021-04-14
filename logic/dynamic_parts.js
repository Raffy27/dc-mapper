const { By } = require('selenium-webdriver');

module.exports = {
    Parts: new Map([
        ['LoginQR', By.xpath('//img[@alt="Scan me!"]')],
        ['Servers', By.xpath('//div[@aria-label="Servers"]')],
        ['Header', By.xpath('//header/h1')],
        ['Search', By.xpath('//div[@aria-label="Search"]//div[@data-contents="true"]')],
        ['SearchStatus', By.xpath('//section[@aria-label="Search Results"]//div[@role="status"]')],
        ['Next', By.xpath('//nav//button[@rel="next"]')],
        ['Result', By.xpath('//div[@aria-label="Search Result"]')],
        ['Join', By.xpath('//div[@role="dialog"]//div[text()="Join a Server"]/..')],
        ['JoinInput', By.xpath('//div[@role="dialog"]//input')],
        ['DialogX', By.xpath('//div[@role="dialog"]//button')],
        ['Leave', By.xpath('//div[text()="Leave Server"]/..')]
    ])
};