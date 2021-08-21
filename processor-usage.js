"use strict";
var fs = require('fs');

function ProcessUsageWatcher() {
    global.pubcrawler = global.pubcrawler || {};
    global.pubcrawler.processCpuUsage = 0;
}

ProcessUsageWatcher.prototype = {

    startWatching: function () {
        if (this.interval) {
            return;
        }

        var getUsage = function (cb) {
            fs.readFile("/proc/" + process.pid + "/stat", function (err, data) {
                var elems = data && data.toString().split(' ');
                var utime = elems && parseInt(elems[13]);
                var stime = parseInt(elems && elems[14]);

                cb(utime + stime);
            });
        };

        this.interval = setInterval(function () {
            getUsage(function (startTime) {
                setTimeout(function () {
                    getUsage(function (endTime) {
                        var delta = endTime - startTime;
                        var percentage = 100 * (delta / 500);
                        global.processCpuUsage = percentage;
                    });
                }, 5000);
            });
        }, 1000);
    },

    stopWatching: function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
};

var instance = new ProcessUsageWatcher();
exports.startWatching = instance.startWatching;
exports.stopWatching = instance.stopWatching;