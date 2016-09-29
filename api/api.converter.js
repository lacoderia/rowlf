var express = require('express');
var router = express.Router();
var html5pdf = require('html5-to-pdf');
var fs = require('fs');

router.post('/', function (req, res, next) {
    try{

        var htmlString = req.body.htmlString;
        var projectName = req.body.projectName;
        var filename = new Date().getTime() + '_' + projectName + '.pdf';
        var fileUrl = req.protocol + '://' + req.get('host') + '/documents/' + filename;

        html5pdf().from.string(htmlString).to('app/documents/' + filename, function () {

            var response = {
                url: fileUrl,
                filename: filename,
                name: projectName
            };
            res.send(response)
                .status(200)
                .end();
            }
        );

    } catch(error) {
        console.log(error);
        res.send(error)
            .status(500)
            .end();
    }


});

module.exports = router;
