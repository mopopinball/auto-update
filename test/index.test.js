const {AutoUpdater, EVENTS} = require('../src/index');
const expect = require('chai').expect;

describe('test', () => {
    let updater = null;

    const config = {
        intervalMs: 5 * 1000 * 60,
        releaseUrl: 'https://api.github.com/repos/semantic-release/semantic-release/releases/latest',
        version: '0.0.0',
        outputDir: '/tmp/out'
    };

    beforeEach(() => {
        updater = new AutoUpdater(config);
    });

    it('runs', async () => {
        let eventFired = false;
        updater.on(EVENTS.UPDATED, () => {
            eventFired = true;
        });
        const updateOccurred = await updater.check();

        expect(updateOccurred).to.be.true;
        expect(eventFired).to.be.true;
    });
});