/*** ✰✰✰ Konstantin Aleksandrov ✰✰✰ ***/

/*
 ================================
 ===      STATIC SERVER       ===
 ================================
*/

'use strict';

if (parseInt(process.versions.node) < 4 || parseFloat(process.versions.v8) < 4.5) {
    /* jshint -W101 */
    console.log('*********************************************\n*  Для запуска требуется Node.js v4 и выше  *\n*  Для запуска требуется V8 v4.5 и выше     *\n*  Пожалуйста обновитесь.                   *\n*********************************************');
    process.exit();
}

const Static    = require('node-static');
const file      = new Static.Server('./dist', {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'

    },
    gzip: true,
    indexFile: '/assets/index.html'
});

require('http').createServer((request, response) => {
    request.addListener('end', () => {
        file.serve(request, response, (e, res) => {
            if (e && (e.status === 404)) {
                file.serveFile('/assets/index.html', 404, {}, request, response);
            }
        });
    }).resume();
}).listen(3000);

console.log('SERVER LISTENING ON PORT 3000');