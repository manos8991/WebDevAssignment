


document.getElementById('addMyBookButton').addEventListener('click',function(){


		var authorInput = document.getElementById("author").value;
		var titleInput = document.getElementById("title").value;
		var genreInput = document.getElementById("genre").value;
		var priceInput = document.getElementById("price").value;

		if ((authorInput=="") || (titleInput=="") || (genreInput=="") || (priceInput=="")) {
				alert("Please complete all the fields");
		}else if (priceInput<0) {
				alert("Invalid price number");
		}else{

				console.log('here');
				var xhttp = new XMLHttpRequest();
				xhttp.open('POST','books',true);
				xhttp.setRequestHeader('Content-type','application/json');

				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
							response=JSON.parse(this.responseText);

							if(response.err==null){
								alert('book Succesfully inserted on system');
							}else{

								alert('error occured book could not be saved \nreason :'+response.err);
							}


					}else{
						console.log('error');
					};


				}
		xhttp.send(JSON.stringify({author:authorInput,title:titleInput,
		gendre:genreInput,price:priceInput}));
	}

});


function searchBook(){



        var searchValue = document.getElementById("search").value;
        parent.location.hash = "?keyword="+searchValue;




        if (searchValue=="") {
            alert("please complete all the fields");
        }else{
            var xhttp = new XMLHttpRequest();
						xhttp.open('GET',`books?param=${searchValue}`,true);
						xhttp.setRequestHeader('Content-type','application/json');
            xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
              //  document.getElementById('searchArea').innerHTML=this.responseText;

							if(document.getElementById('resultsDiv')!=null){//Αν υπάρχει ήδη table results σβήστο και ανανέωσε το

								document.getElementById('resultsDiv').remove();
							}

									var response=JSON.parse(this.responseText);

									if(response.length==0){

										alert("No matching books found");
									}else{

										var table;

										table=document.createElement("TABLE");
										table.setAttribute('id',"resultsTable");

										table.setAttribute("style","margin-left:30%;margin-top:5px;");

										tr=document.createElement('TR');


										th=document.createElement('TH');
										th.setAttribute('style',"padding:10px;")

										th.textContent="Id";
										tr.appendChild(th);
										th=document.createElement('TH');
										th.setAttribute('style',"padding:40px;")
										th.textContent="Author"
										tr.appendChild(th);

										th=document.createElement('TH');
										th.setAttribute('style',"padding:40px;")

										th.textContent="Title";
										tr.appendChild(th);
										th=document.createElement('TH');
										th.setAttribute('style',"padding:40px;")

										th.textContent="Gendre";
										tr.appendChild(th);
										th=document.createElement('TH');
										th.setAttribute('style',"padding:40px;")

										th.textContent="Price";
										tr.appendChild(th);

										table.appendChild(tr);

										var div=document.createElement("DIV");

										div.appendChild(table);

										div.setAttribute('id','resultsDiv');

										var h3=document.createElement('H3');
										h3.innerHTML="Results";
										h3.style="margin-left:42%;margin-top:50px;"

										div.prepend(h3);

										document.getElementsByTagName('body')[0].appendChild(div);


										for(var i=0;i<response.length;i++){

											tr=document.createElement('TR');


											td=document.createElement('TD');
											td.textContent=response[i].id;
											td.style="text-align:center;"
											tr.appendChild(td);

											td=document.createElement('TD');
											td.textContent=response[i].author;
											td.style="text-align:center;"
											tr.appendChild(td);

											td=document.createElement('TD');
											td.textContent=response[i].title;
											td.style="text-align:center;"
											tr.appendChild(td);

											td=document.createElement('TD');
											td.textContent=response[i].gendre;
											td.style="text-align:center;"
											tr.appendChild(td);

											td=document.createElement('TD');
											td.textContent=response[i].price;
											td.style="text-align:center;"
											tr.appendChild(td);

											table.appendChild(tr);

										}



									}

					  	}
            };

            xhttp.send();

        }

}
