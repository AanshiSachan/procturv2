/**
 * @file Busy Config
 * @author yumao<yuzhang.lille@gmail.com>
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BusyConfig = (function () {
    function BusyConfig(config) {
        if (config === void 0) { config = {}; }
        for (var option in exports.BUSY_CONFIG_DEFAULTS) {
            this[option] = config[option] != null ? config[option] : exports.BUSY_CONFIG_DEFAULTS[option];
        }
    }
    return BusyConfig;
}());
exports.BusyConfig = BusyConfig;
exports.BUSY_CONFIG_DEFAULTS = {
    /* template: "\n        <div class=\"ng-busy-default-wrapper\">\n            <div class=\"ng-busy-default-sign\">\n                <div class=\"ng-busy-default-spinner\">\n                    <div class=\"bar1\"></div>\n                    <div class=\"bar2\"></div>\n                </div>\n                <div class=\"ng-busy-default-text\">{{message}}</div>\n            </div>\n        </div>\n    ", */
    template: "\n        <div class=\"ng-busy-default-wrapper\">\n            <div class=\"progress-container\">\n                                <div class=\"progress-materializecss\">\n    <div class=\"indeterminate\">\n         </div>\n        </div>\n            </div>\n        </div>\n    ",
    delay: 0,
    minDuration: 0,
    backdrop: false,
    message: 'Loading',
    wrapperClass: 'ng-busy'
};
//# sourceMappingURL=busy-config.js.map