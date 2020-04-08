var express = require('express');
var app = express();
app.use(express.json())
app.set('view engine', 'ejs');


//link css and js σερβίρισμα στατικών στοιχέιων ιστοσελίδας.
//https://stackoverflow.com/questions/24582338/how-can-i-include-css-files-using-node-express-and-ejs
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


var mysql = require('mysql');

//Δημιουργία connection pool
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : '35.202.249.58',
  user            : 'user1',
  password        : 'toor',
  database        : 'mydb'
});






//Κεντρική σελίδα
app.get('/', function(req, res,next){
  res.render('frontend');
});


//Αναζήτηση βιβλίου

app.get('/books',function(req,res){

  var param=req.query.param;


  if(param==null || param.match(/^[a-zA-Z0-9ά-ωΑ-ώ\. ]+$/)==null){

    res.send({code:410,err:"Bad request , empty or illegal characters detected"});

  }else{


    pool.query(`SELECT * FROM books WHERE  author LIKE '%${param.trim()}%'
    or title like '%${param.trim()}%' `,function(err,rows,fields){

      if(err){
        console.log(err);
      }else{

        response=[];

        for(var i=0;i<rows.length;i++){

          response.push({id:rows[i].id,author:rows[i].author,
          title:rows[i].title,gendre:rows[i].genre,price:rows[i].price})

        }

        res.send(response);

      }

    });

  }



});


//Εισαγωγή βιβλίου
app.post('/books',function(req,res){

  var book=req.body;

  var errMsg="";

  //Έλεγχος στο backend ότι το request είναι το αναμενόμενο
  //Μια μικρή προσπάθεια για να αποφύγουμε πιθανά sql injections δεν μας σώζει από έναν έμπερο hacker αλλά ίσως τον δυσκολέψει
  //  https://stackoverflow.com/questions/23327302/javascript-regex-to-remove-special-characters-but-also-keep-greek-characters

  if( book.price.trim().match(/^[0-9]+\.{0,1}[0-9]*$/)==null){
    errMsg="Not a valid price. A valid price should be a number ";
    res.send({code:404,err:errMsg});
    return;
  }

  if(book.author.trim().match(/^[a-zA-Z0-9ά-ωΑ-ώ ]+$/)==null || book.title.trim().match(/^[a-zA-Z0-9ά-ωΑ-ώ ]+$/)==null
   || book.gendre.trim().match(/^[a-zA-Z0-9ά-ωΑ-ώ ]+$/)==null ){

     errMsg="Illegal characters detected.Allowed only characters numbers and spaces";

     res.send({code:404,err:errMsg});
     return;

   }

   //Έλεγχος ότι δεν υπάρχει βιβλίο με τα ίδια ακριβώς στοιχεία.


   pool.query(`SELECT COUNT(*) as result FROM books WHERE  author='${book.author.trim()}' and title='${book.title.trim()}'
   and genre='${book.gendre.trim()}' and price= ${book.price.trim()}`,function(err,rows,fields){

     if(err){

       console.log(err);
     }

     if(rows[0].result>0){

       res.send({code:400,err:errMsg="There is allready this book on system"});//Υπάρχει ήδη βιβλίο με τα ίδια ακριβώς πεδία


     }
     else{// Δεν υπάρχει το βιβλίου

       pool.query(`INSERT INTO books VALUES(NULL,'${book.author}','${book.title}','${book.gendre}','${book.price}')`,function(err,rows,fields){

         if(err){

           console.log('error occured when trying to insert a book'+err);

           res.send({code:403,err:"Failed to save book on system"});

         }else{

           res.send({code:200,msg:"Succesfully inserted book"});
         }

       });


     }

   });






   console.log("A new post book requst maded with the following details");
   console.log(book);



});




console.log('Node server started');

app.listen(3000);
