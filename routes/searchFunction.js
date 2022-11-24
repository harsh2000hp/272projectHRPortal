var express = require('express');
var router = express.Router();
var database = require('../database');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('searchFunction', { title: 'Express' });
//});

router.get("/", function(request, response, next){
	function containsNumbers(str) {
		return /[0-9]/.test(str);
	  }
	  
  
var query = "SELECT * FROM employees WHERE emp_no = ";
  var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
  var fun = fullUrl.split("search=");
  emp_no = fun[1];
  if (!containsNumbers(emp_no)) {
	query = "SELECT * FROM employees WHERE first_name = '"
	query += emp_no;
	query += "'";
	
  }
  else {
	query = "SELECT * FROM employees WHERE emp_no = ";
	parseInt(emp_no);
  console.log(emp_no);
  query += emp_no;
  }
  




	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render('searchFunction', {title:'Node.js MySQL CRUD Application', action:'list', sampleData:data, message:request.flash('success')});
		}

	});

});

module.exports = router;