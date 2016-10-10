var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/', function (req, res, next) {

    try{

        var filename = req.body.filename;
        var fileUrl = 'app/documents/' + filename;

        fs.exists(fileUrl, function(exists) {
            if (exists) {
                fs.unlink(fileUrl, function(error) {
                    if(error) {
                        return next(error);
                    } else {
                        var response = {
                            url: fileUrl,
                            filename: filename,
                            message: 'File deleted'
                        };

                        res.status(200)
                            .send(response)
                            .end();
                    }

                });
            } else {
                var error = {
                    code: '500',
                    message: 'File does not exist'
                };

                return next(error);
            }
        });

    } catch(error) {
        return next(error);
    }

});

router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = router;
