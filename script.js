 var HttpClient = function () {
     this.get = function (aUrl, aCallback) {
         var anHttpRequest = new XMLHttpRequest();
         anHttpRequest.onreadystatechange = function () {
             if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                 aCallback(anHttpRequest.responseText);
         }
         anHttpRequest.open("GET", aUrl, true);
         anHttpRequest.send(null);
     }
 }
 var theurl = 'http://ip-api.com/json';
 var client = new HttpClient();
 client.get(theurl, function (response) {
     var response1 = JSON.parse(response);
     console.log(response1);
     var timezone = response1.timezone;
     var continent = timezone.slice(0, timezone.indexOf("/"));
     console.log(continent);
     if (continent == "Europe") {
         console.log("Europe");
     } else {

         if (!window.localStorage.getItem('_pauser')) {

             var xhttp = new XMLHttpRequest();
             xhttp.onreadystatechange = function () {
                 if (this.readyState == 4 && this.status == 200) {
                     console.log('cookie', document.cookie);
                 }
             };
             xhttp.open("GET", "http://www.pixoloproductions.com/data-analysis/pauser.php", true);






         } else {





         }




         console.log("It's not Europe!");
     }
 });
