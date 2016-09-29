var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function (req, res, next) {
    try{

        var fileName = req.query.fileName;
        var fileUrl = 'app/documents/' + fileName;

        fs.unlink(fileUrl, function(error) {
            if(error) {
                throw error;
            }

            var response = {
                url: fileUrl,
                fileName: fileName,
                text: 'File deleted'
            };

            res.send(response)
                .status(200)
                .end();

            console.log('successfully deleted');
        });


    } catch(error) {
        console.log(error);
        res.send(error)
            .status(500)
            .end();
    }


});

module.exports = router;
