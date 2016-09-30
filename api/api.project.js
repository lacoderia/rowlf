var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function (req, res, next) {

    var filename = req.body.filename;
    var fileUrl = 'app/documents/' + filename;

    fs.exists(fileUrl, function(exists) {
        if (exists) {
            fs.unlink(fileUrl, function(error) {
                if(error) {
                    console.log(error);
                    res.status(500)
                        .send(error)
                        .end();
                } else {
                    var response = {
                        url: fileUrl,
                        filename: filename,
                        text: 'File deleted'
                    };

                    res.status(200)
                        .send(response)
                        .end();
                }

            });
        } else {
            var error = {
                code: '500',
                text: 'File does not exist'
            };

            res.status(500)
                .send(error)
                .end();
        }
    });

});

module.exports = router;
