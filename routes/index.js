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

let model = require('../models/contactoModel');

router.get('/ingresar', function (req, res) {
	res.render('index');
});

router.get('/', function (req, res) {
    model.find({}).exec(function(err,data){
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				res.render('listar',{lista:data});
			}
		});
});

router.get('/filtro', function (req, res) {
    model.find({"email" : "leidy@gmail.com"}).exec(function(err,data){
			if(data){
				res.render('listar',{lista:data});
			}else{
				res.redirect('/');
			}
		});
});

router.get('/delete/:id', function (req, res) {
	var id = req.params.id;
    model.deleteOne({"_id" : id}).exec(function(err,data){
    		res.redirect('/');
		});
});
router.post('/cargar', upload.single('file'),function(req,res){

	let obj = new model;
	var d = new Date(req.body.date);
	obj.nombre = req.body.nombre;	
	obj.apellido= req.body.apellido;
	obj.email = req.body.email;
	obj.date = d.toDateString();



	var s3Client = new AWS.S3({
    	accessKeyId: 'AKIASWIVSPOOAUMEJ42F',
   		secretAccessKey: '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',
		region : 'us-east-2'
	});

	var uploadParams = {
         Bucket: 'jabappdemo', 
         Key: '', // pass key
         Body: null, // pass file body
         ACL: 'public-read-write'
	};
	
	var name = Date.now()+"_"+req.file.originalname;

	obj.perfil= name;
	uploadParams.Key = name;
	uploadParams.Body = req.file.buffer;
		
	s3Client.upload(uploadParams, (err, data) => {
		if (err) {
			res.status(500).json({error:"Error -> " + err});
		}
	});
	
	obj.save(function(err,newData){
			if(err){
				console.log(err);
				res.sendStatus(500);
			}else{
				res.redirect('/');
			}
	});
});


module.exports = router;
