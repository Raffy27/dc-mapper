const { By } = require('selenium-webdriver');

module.exports = {
    Parts: new Map([
        ['Body', By.xpath('//body')],
        ['LoginQR', By.xpath('//img[@alt="Scan me!"]')],
        ['Servers', By.xpath('//div[@aria-label="Servers"]')],
        ['Header', By.xpath('//header/h1')],
        ['Search', By.xpath('//div[@aria-label="Search"]//div[@data-contents="true"]')],
        ['Results', By.id('search-results')],
        ['Message', By.xpath('div[@role="group"]')]
    ])
};