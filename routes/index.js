var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//-----------------------
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
//-----------------------
var AWS = require('aws-sdk');
var stream = require('stream');
	
router.get('/', function (req, res) {
    res.render('error');
});
 
router.post('/cargar', upload.single('file'),function(req,res){
	
	var s3Client = new AWS.S3({
    	accessKeyId: 'AKIASWIVSPOOAUMEJ42F',
   		secretAccessKey: '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',
		region : 'us-east-2'
	});

	var uploadParams = {
         Bucket: 'jabappdemo', 
         Key: '', // pass key
         Body: null, // pass file body
	};
	
	uploadParams.Key = req.file.originalname;
	uploadParams.Body = req.file.buffer;
		
	s3Client.upload(uploadParams, (err, data) => {
		if (err) {
			res.status(500).json({error:"Error -> " + err});
		}
		res.json({message: 'File uploaded successfully! -> keyname = ' + req.file.originalname});
	});
});


module.exports = router;
