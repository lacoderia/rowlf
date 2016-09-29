var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function (req, res, next) {
    try{
        var filename = req.body.filename;
        var fileUrl = 'app/documents/' + filename;

        fs.unlink(fileUrl, function(error) {
            if(error) {
                throw error;
            }

            var response = {
                url: fileUrl,
                filename: filename,
                text: 'File deleted'
            };

            res.send(response)
                .status(200)
                .end();

        });


    } catch(error) {
        console.log(error);
        res.send(error)
            .status(500)
            .end();
    }


});

module.exports = router;
