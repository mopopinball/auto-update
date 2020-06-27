const axios = require('axios');
const semver = require('semver');
const tar = require('tar');
const EventEmitter = require('events');

const EVENTS = {
    UPDATED: 'updated'
}

class AutoUpdater extends EventEmitter {
    constructor(updateConfig) {
        super();
        this.config = updateConfig;
    }

    init() {
        this.interval = setInterval(() => this.check(), this.config.intervalMs);
    }

    async check() {
        console.info('Performing update check');
        const latest = await axios.get(this.config.releaseUrl);

        if (semver.gt(latest.data.tag_name, this.config.version)) {
            const responseStream = await axios({
                url: latest.data.tarball_url,
                method: 'GET',
                responseType: 'stream'
            });
            responseStream.data.pipe(
                tar.x({
                    strip: 1,
                    C: this.config.outputDir
                  })
            );
            this.emit('updated');
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = {AutoUpdater, EVENTS};
