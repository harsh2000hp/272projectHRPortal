var express = require('express');

var router = express.Router();

var database = require('../database');
const formatDate = str =>
    str.replace(/\w+ (\w+) (\d+) (\d+) (\d+):(\d+).*/, (_, M, d, y, h, m) =>
        `${
            1+"JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(M)/3
        }/${d}/${y} ${h % 12 || 12}:${m} ${"AP"[+(+h > 11)]}M`
        .replace(/\b\d\//, "0$&")
    );


router.get("/", function(request, response, next){

	var query = "SELECT * FROM employees LIMIT 5";

	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render('sample_data', {title:'Node.js MySQL CRUD Application', action:'list', sampleData:data, message:request.flash('success')});
		}

	});

});

router.get("/add", function(request, response, next){

	response.render("sample_data", {title:'Insert Data into MySQL', action:'add'});

});

router.post("/add_sample_data", function(request, response, next){

	var first_name = request.body.first_name;

	var last_name = request.body.last_name;

	
	var currentMaxEmployeeNumber = 'SELECT emp_no FROM employees ORDER BY emp_no DESC LIMIT 1';
	emp_no = request.body.emp_no;
	
	

	
	database.query(currentMaxEmployeeNumber, function(error, data){

		if(error)

		{	

			throw error;
		}	
		else
		{	
			console.log(data);
			emp_no = data +1;
		}

	});

	var gender = request.body.gender;
	var birth_date = request.body.birth_date;
	var hire_date = request.body.hire_date;
	birth_date = formatDate(birth_date);
	birth_date = birth_date.split(' ')[0]
	hire_date = formatDate(hire_date);
	hire_date = hire_date.split(' ')[0]
	

	var query = `
	INSERT INTO employees
	(first_name, last_name, birth_date, gender, hire_date, emp_no) 
	VALUES ("${first_name}", "${last_name}", "${birth_date}", "${gender}", "${hire_date}","${emp_no}")
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}	
		else
		{
			request.flash('success', 'Sample Data Inserted');
			response.redirect("/sample_data");
		}

	});

});

router.get('/edit/:emp_no', function(request, response, next){

	var emp_no = request.params.emp_no;

	var query = `SELECT * FROM employees WHERE emp_no = `;
	query += emp_no;

	database.query(query, function(error, data){

		response.render('sample_data', {title: 'Edit MySQL Table Data', action:'edit', sampleData:data[0]});

	});

});

router.post('/edit/:emp_no', function(request, response, next){

	var emp_no = request.params.emp_no;

	var first_name = request.body.first_name;

	var last_name = request.body.last_name;

	

	var gender = request.body.gender;
	var hire_date = request.body.hire_date;
	var birth_date = request.body.birth_date;
	birth_date = formatDate(birth_date);
	birth_date = birth_date.split(' ')[0]
	hire_date = formatDate(hire_date);
	hire_date = hire_date.split(' ')[0]
	console.log(birth_date);

	var query = `
	UPDATE employees 
	SET first_name = "${first_name}", 
	last_name = "${last_name}", 
	gender = "${gender}",
	emp_no = "${emp_no}",
	birth_date = "${birth_date}",
	hire_date = "${hire_date}"
	WHERE emp_no = "${emp_no}"
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
			request.flash('success', 'Sample Data Updated');
			response.redirect('/sample_data');
		}

	});

});

router.get('/delete/:emp_no', function(request, response, next){

	var emp_no = request.params.emp_no; 

	var query = `
	DELETE FROM employees WHERE emp_no = "${emp_no}"
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
			request.flash('success', 'Sample Data Deleted');
			response.redirect("/sample_data");
		}

	});

});

module.exports = router;