//function to retrive data from api
async function fetchData(url){
  try{
      var response = await fetch(url);
      var data = await response.json();
      return data;
  }catch(error){
    console.log("Failed to load page! Try agian");
  }
}

/*****Deals with world and india map*****************/
//world corona cases map
fetchData('https://api.covid19api.com/summary').then(worldRawData=>{
  var covidWorldData = [], temp, min=1, max =1;
  //updating global statistics
  document.querySelector('.global-stats .confirmed-box .number-count').innerHTML = worldRawData.Global.TotalConfirmed;
  document.querySelector('.global-stats .recovered-box .number-count').innerHTML = worldRawData.Global.TotalRecovered;
  document.querySelector('.global-stats .deaths-box .number-count').innerHTML = worldRawData.Global.TotalDeaths;
  document.querySelector('.global-stats .active-box .number-count').innerHTML = worldRawData.Global.TotalConfirmed - worldRawData.Global.TotalRecovered - worldRawData.Global.TotalDeaths;
  worldRawData.Countries.forEach(function(item){
    temp = new Object()
    temp.countryName = item.Country;
    temp.countryCode = item.CountryCode;
    temp.value = item.TotalConfirmed;
    temp.recovered = item.TotalRecovered;
    temp.deaths = item.TotalDeaths;
    temp.newConfirmed = item.NewConfirmed;
    temp.newRecovered = item.NewRecovered;
    temp.newDeaths = item.NewDeaths;
    covidWorldData.push(temp);
    max = Math.max(temp.value, max);
  });
  Highcharts.mapChart('world-map', {
    chart: {
      map: 'custom/world'
    },
    title: {
      text: 'World Map with confirmed cases'
    },

    legend: {
      title: {
        text: 'Corona confirmed cases',
        style: {
          color: ( // theme
            Highcharts.defaultOptions &&
            Highcharts.defaultOptions.legend &&
            Highcharts.defaultOptions.legend.title &&
            Highcharts.defaultOptions.legend.title.style &&
            Highcharts.defaultOptions.legend.title.style.color
          ) || 'black'
        }
      }
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },

    tooltip: {
      backgroundColor: '#fff',
      borderWidth:'2px',
      borderColor:'#D33C00',
      shadow: true,
      useHTML: true,
      padding: 0,
      pointFormat: "<div class='tooltip_hover'><span class='country-name'>{point.countryName}</span><span class='confirmed total'>Confirmed: {point.value} <span class='new'>(+{point.newConfirmed})</span></span><span class='recovered total'>Recovered: {point.recovered} <span class='new'>(+{point.newRecovered})</span></span><span class='deaths total'>Deaths&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {point.deaths}<span class='new'> (+{point.newDeaths})</span></span></div>"
    },

    colorAxis: {
      min: min,
      max: max,
      type: 'logarithmic',
      maxColor:'#d33c00',
      minColor:'#fff'
    },

    series: [
        { data: covidWorldData,
         joinBy: ['iso-a2', 'countryCode'],
          name:'Corona cases',
          states: {
              hover: { 
                enabled:false
               }
            }
         }
        ]
  });
})

//india corona cases map
fetchData('https://api.covid19india.org/data.json').then(indiaRawData=>{
  //updating indian statistics
  document.querySelector('.indian-stats .confirmed-box .number-count').innerHTML = indiaRawData.statewise[0].confirmed;
  document.querySelector('.indian-stats .recovered-box .number-count').innerHTML =indiaRawData.statewise[0].recovered;
  document.querySelector('.indian-stats .deaths-box .number-count').innerHTML = indiaRawData.statewise[0].deaths;
  document.querySelector('.indian-stats .active-box .number-count').innerHTML = indiaRawData.statewise[0].active  ;
    var covidIndiaData = [], st = new Object();

   indiaRawData.statewise.forEach(function(item){
            var temp = new Object();
            temp.stateName = item.state.toLowerCase();
            temp.stateCode = item.statecode;
            temp.value = item.confirmed;
            temp.recovered = item.recovered;
            temp.deaths = item.deaths;
            temp.newConfirmed = item.deltaconfirmed;
            temp.newRecovered = item.deltarecovered;
            temp.newDeaths = item.deltadeaths;
            covidIndiaData.push(temp);

            st[temp.stateCode] = new Object();
            st[temp.stateCode].confirmed = item.confirmed;
            st[temp.stateCode].recovered =item.recovered;
            st[temp.stateCode].deaths =  item.deaths;
    });
    getStateData(st);
    var max = covidIndiaData[1].value;
    //creating the chart
    Highcharts.mapChart('india-map', {
        title: {
            text: 'Indian map with confirmed Cases'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        tooltip: {
          backgroundColor: '#fff',
          borderWidth:'2px',
          borderColor:'#D33C00',
          shadow: true,
          useHTML: true,
          padding: 0,
          pointFormat: "<div class='tooltip_hover'><span class='country-name'>{point.stateName}</span><span class='confirmed total'>Confirmed: {point.value} <span class='new'>(+{point.newConfirmed})</span></span><span class='recovered total'>Recovered: {point.recovered} <span class='new'>(+{point.newRecovered})</span></span><span class='deaths total'>Deaths&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {point.deaths}<span class='new'> (+{point.newDeaths})</span></span></div>"
        },
        colorAxis: {
            min: 1,
            max:max,
            type:'logarithamic',
            maxColor:'#d33c00',
            minColor:'#fff'
        },

        series: [{
            data: covidIndiaData,
            mapData:Highcharts.maps["custom_india"],
            joinBy:['hc-key', 'stateName'],
            name: 'Random data',
            borderColor:"#000",
            states: {
                hover: {
                    enabled:false
                }
            }
        }]
    });
 });


/*******Deals with getting world countries and indian states and updating them*******/
//get countries, codes and update select countries element
fetchData('https://api.covid19api.com/countries').then(countriesData =>{
  var  options = "<option value=''>Select Country</option>";
  countriesData.forEach(item=>options += `<option value='${item.Slug}'>${item.Country}</option>`);
  //updating the select element country list
  document.getElementById('select-country').innerHTML = options;
});

//get states, codes and update select states element
fetchData('https://jaswanth431.github.io//indian-states.json').then(statesData =>{
  var  options = "<option value=''>Select State/Union Teritory</option>";
  statesData.state.forEach(item=>options += `<option value='${item.key}'>${item.name}</option>`);
  //updating the select element country list
  document.getElementById('select-state').innerHTML = options;
});


/***** Event handlers for dispaying daily corona cases for selected countries and states*******/
//event handler for button that fetches country wise stats
document.getElementById('get-country-stats-btn').addEventListener('click', ()=>{
  var value = document.getElementById('select-country').value;
  if(value == ""){
    document.getElementById('select-country').focus();
    return;
  }
  var data = {
    name:"",
    date:[],
    confirmed:[],
    active:[],
    recovered:[],
    deaths:[]
  };
  var months = {
    '01':"Jan",
    '02':"Feb",
    '03':"Mar",
    '04':"Apr",
    '05':"May",
    '06':"Jun",
    '07':"Jul",
    '08':"Aug",
    '09':"Sep",
    '10':"Oct",
    '11':"Nov",
    '12':"Dec"
  };
  //country wise cases graph
  fetchData(`https://api.covid19api.com/total/country/${value}`).then(dayWiseCasesData=>{
    //updating global statistics
  try{
    document.querySelector('.country-stats .confirmed-box .number-count').innerHTML = dayWiseCasesData[dayWiseCasesData.length-1].Confirmed;
  document.querySelector('.country-stats .recovered-box .number-count').innerHTML = dayWiseCasesData[dayWiseCasesData.length-1].Recovered;
  document.querySelector('.country-stats .deaths-box .number-count').innerHTML = dayWiseCasesData[dayWiseCasesData.length-1].Deaths;
  document.querySelector('.country-stats .active-box .number-count').innerHTML = dayWiseCasesData[dayWiseCasesData.length-1].Active;
  }catch(error){
    console.log(error);
  }
  
    dayWiseCasesData.forEach(item=>{
      data.name = item.Country;
      data.confirmed.push(item.Confirmed);
      data.active.push(item.Active);
      data.recovered.push(item.Recovered);
      data.deaths.push(item.Deaths);
      data.date.push(`${item.Date.substring(8,10)} ${months[item.Date.substring(5,7)]}`);
    });
    Highcharts.chart('country-cases-graph', {
      chart: {
          type: 'line'
      },
      title:{
          text:`Covid19 stistics of ${data.name}`
      },
      xAxis:{
          tickInterval:5,
          title:{
              text:"Timeline"
          },
          categories: data.date
      },
      yAxis:{
          title:{
              text:"Cases"
          }
      },
      plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    },
      series:[{
                  name: 'Confirmed',
                  data: data.confirmed
               }, {
                  name: 'active',
                  data: data.active
                },
                 {
                  name: 'recovered',
                  data: data.recovered
               } , {
                  name: 'deaths',
                  data: data.deaths
            }]
    });
  });
}); 

//even handler for button that fetchet state wise covid stats
function getStateData(data){
  document.getElementById('get-state-stats-btn').addEventListener('click', ()=>{
    var value = document.getElementById('select-state').value;
    if(value == ""){
      document.getElementById('select-state').focus();
      return;
    }
    document.querySelector('.state-stats .confirmed-box .number-count').innerHTML = data[value].confirmed;
    document.querySelector('.state-stats .recovered-box .number-count').innerHTML =data[value].recovered;
    document.querySelector('.state-stats .deaths-box .number-count').innerHTML = data[value].deaths;
    document.querySelector('.state-stats .active-box .number-count').innerHTML = data[value].confirmed - data[value].recovered-data[value].deaths;
  });
}

