var http = require("http"),
	url = require("url"),
	filesys = require("fs");

module.exports = {
	start : function(httpPort){

		http.createServer(function(request,response){ // simple http server
			writeFile(request, response);
		}).listen(httpPort);
		console.log("HTTP Server's Running on "+httpPort);
	}
};

function writeFile(req, res){
	var myPath = url.parse(req.url).pathname;
	var fullPath = fixEmptyUrl(process.cwd() + myPath);
	
	filesys.exists(fullPath, function(exists){
		if(!exists){
			filesys.readFile("404.html", "binary", function(err, file){
			    if(err){
					httpResponse(res, "Server error<br/>" + err, 500, "", {"Content-Type": "text/html"});
			    }
				else{
					httpResponse(res, file, 404, "binary");
				}
			});
		}
		else{
			filesys.readFile(fullPath, "binary", function(err, file){
			    if(err){
					httpResponse(res, "Server error<br/>" + err, 500, "", {"Content-Type": "text/html"});
			    }
				else{
					httpResponse(res, file, 200, "binary");
				}
			});
		}
	});
}

function fixEmptyUrl(url){
	try{
		if(filesys.statSync(url).isDirectory()) url += "/index.html";
	}
	catch(e){
		url = "404.html";
	}
	
	return url;
}

function httpResponse(res, body, code, type, header){
	res.writeHeader(code||200, header||"");
	res.write(body||"", type||"");
	res.end();
}