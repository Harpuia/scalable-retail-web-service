/*
lineReader will extract the records from amazon-meta.txt one at a time as
file is too large to read all at once.  In order to add records to a database you need to add code below to insert records

This code depnds on "line-reader"

You need to install line-reader by using the following command:
npm install line-reader

*/

//This assumes that you're using mysql.  You'll need to change this if you're using another database
var mysql      = require('mysql'),
    co         = require('co'),
    wrapper    = require('co-mysql');
var query;
var jsonRecord;
var execute = true;
var query;
var totalRecords = 0;

var lineReader = require('line-reader');


/*************************You need to change this to be appropriate for your system************************************************************/
var connection = mysql.createConnection({
  //host     : '127.0.0.1',
  host: 'ediss-db.cektrjgecscm.us-east-1.rds.amazonaws.com',
  port     : '3306',
  user     : 'root',
  //password : 'root',
  password: 'ediss_is_awesome',
  database : 'e_commerce',
  multipleStatements: 'true'
});

var sql = wrapper(connection);

var values = ""; //The records read from the file.
var numRecords = 0; //The current number of records read from the file.

/********************************You might need to adjust the block size.  This specifies how many records to insert at once***********************/
var recordBlock = 500; //The number of records to write at once.

lineReader.eachLine('./test/Phase4/productRecordsLarge.json', function(line, last) {
  execute = false;
  currentLine = line.toString().replace(/'/g, "\"", "g");
  try{
    jsonRecord = JSON.parse(currentLine);

    if (numRecords) {
      values += ', ';
    }
    if(jsonRecord.description == null){
      jsonRecord.description = "";
    }
    if (jsonRecord.categories == null) {
    	jsonRecord.description = [""];
    }
    values += `('${jsonRecord.title}', '${jsonRecord.categories[0]}', '${jsonRecord.description}', '${jsonRecord.asin}')`;
    numRecords++;

//****************************************************Change the query to align with your schema******************************************************/
    if (numRecords == recordBlock) {
      query = `INSERT INTO products (productName, pgroup, productDescription, asin) VALUES ${values};`; //Template, replaces ${values} with the value of values.
      values = "";
      numRecords = 0;
      execute = true;
      //console.log(query);
    }
  }catch(err) {
    execute = false;//there was a quote in the text and the parse failed ... skip insert
    // ======== //console.log(err);
  }
  if(execute){
    co(function* () {
      // //console.log("****************************************************in execute**************************************************************************************");
        var resp = yield sql.query(query);
        //======== //console.log("resp = " + resp);
        totalRecords += recordBlock;
        //console.log(totalRecords + " records inserted.");
    });
  }//if(execute)
});//lineReader.eachLine