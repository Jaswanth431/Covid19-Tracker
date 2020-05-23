var  options;
fetch("https://api.covid19api.com/countries").then(function(response){
  return response.json();
}).then(function(obj){
  options = "jas";
}).catch(function(error){
  alert(error);
});

console.log(options);