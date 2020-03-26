const prometheusPort = 9090;
const minFrameLength = 30000;
const db_connector_endpoint = "http://" + document.location.hostname + ":8080/metrics";
console.log(db_connector_endpoint);
const db_connector_endpoint1 = "http://" + document.location.hostname + ":9090/metrics";
//const db_connector_endpoint = 'http://db_connector:8080/metrics';
//const db_connector_endpoint = 'http://localhost:8080/metrics';

var xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:9090/metrics", true);
xhr.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
xhr.setRequestHeader("Content-Type", "application/x-www-formurlencoded");
xhr.withCredentials = true;
xhr.send();
console.log(xhr.responseText)

x = new XMLHttpRequest();
x.open("GET","http://localhost:9090/metrics",false)
x.send()
console.log(x.responseText)

function getData() {
    document.getElementById('dataBtn').disabled = true;
    var innerHTML = window.location.href.split('/');
    innerHTML.pop();
    innerHTML = innerHTML.join('/');

    var serviceArray = new Array();
    var table = document.getElementById('output_table');
    var workflow = JSON.parse(table.getAttribute("workflow"));

    // serviceArray.sort((a, b) => (a.startTime > b.endTime) ? 1 : (a.startTime > b.endTime) ? -1 : 0);
    var name;
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows.item(i);

        if (!row.cells[0].childNodes[0].checked) {
            name = row.getAttribute("data-rest");
            wfObject.services = wfObject.services.filter(x => x.name !== name);
        }
    }
    console.log(wfObject)
    var promiseArray = connectDB(wfObject);
    console.log(promiseArray)
    Promise.all(promiseArray)
        .then(values => {
            var resultData = new Object();
            values.forEach((value, i) => {
                resultData[promiseArray[i].resourceID] = value.data;
            });

            console.log(JSON.stringify(resultData));
            visualizeData(formatData(resultData, wfObject.workflow));
        })
        .catch(err => {
            console.log(err.stack);
        });
}

function connectDB(wfObject) {
    var promiseArray = new Array();
    var set = new Set();

    wfObject.services.forEach(element => {
        if (!set.has(element.resource)) {
            set.add(element.resource);

            var prm = retrieveData(element.endpoint, wfObject.workflow);
            console.log(prm)
            prm.resourceID = element.resource;
            promiseArray.push(prm);
        }
    });

    return promiseArray;
}

function formatData(resultData, workflow) {    
    var result = new Object();

    result.resources = new Array();
    for (var key in resultData) {
        if (resultData.hasOwnProperty(key)) {
            result.resources.push(key);
        }
    }

    result.cpu = new Array();
    result.mem = new Array();
    result.net_in = new Array();
    result.net_out = new Array();

    var timeRange = getTimeRange(workflow);
    timeRange[0] += 1;
    var difference = timeRange[1] - timeRange[0];
    for(var i = 0; i <= difference; i++){        
        result.cpu[i] = [new Date((i + timeRange[0]) * 1000)];
        result.mem[i] = [new Date((i + timeRange[0]) * 1000)];
        result.net_in[i] = [new Date((i + timeRange[0]) * 1000)];
        result.net_out[i] = [new Date((i + timeRange[0]) * 1000)];

        result.resources.forEach(resource => {
                result.cpu[i].push(parseFloat(resultData[resource].cpu[i][1]));
                result.mem[i].push(parseFloat(resultData[resource].mem[i][1] * 0.00000095367432));
                result.net_in[i].push(parseFloat(resultData[resource].net_in[i][1]));
                result.net_out[i].push(parseFloat(resultData[resource].net_out[i][1]));
        });
    }

    console.log(result);
    return result;
}

function getTimeRange(workflow){
    var difference = workflow.endTime - workflow.startTime;
    if (difference < minFrameLength) {
        difference += (minFrameLength - difference) / 2
        difference = Math.round(difference + 0.5);
    }else{
        difference = 0;
    }

    var startSec = Math.round((workflow.startTime - difference) / 1000);
    var endSec = Math.round((workflow.endTime + difference) / 1000);
    return [startSec, endSec];
}

function retrieveData(endpoint, workflow) {
    console.log(endpoint);
    console.log(workflow);
    var endpointURL = endpoint.replace(/:[0-9]+(?:\/.*)?/, ':' + prometheusPort);
    console.log(endpointURL);
    var timeRange = getTimeRange(workflow);
    console.log(timeRange);
    console.log(db_connector_endpoint1);
    var url = new URL(db_connector_endpoint1);
    console.log(url);
    url.searchParams.append('endpoint', endpointURL);
    url.searchParams.append('startTime', timeRange[0]);
    url.searchParams.append('endTime', timeRange[1]);
    console.log(url);
    return axios.get(url, {headers: {'Access-Control-Allow-Origin': '*','Content-Type': 'application/x-www-formurlencoded'}});
    console.log('here');
}