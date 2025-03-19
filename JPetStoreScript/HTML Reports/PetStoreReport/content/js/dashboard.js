/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.79730042868729, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48473011363636365, 500, 1500, "1-Open Pets Store"], "isController": false}, {"data": [0.9966740576496674, 500, 1500, "3-Searrch for Item"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "03-06 Click on Item ID then Add to Cart"], "isController": true}, {"data": [1.0, 500, 1500, "04-10 Click on Sign out"], "isController": true}, {"data": [0.5, 500, 1500, "03-01-open URL"], "isController": true}, {"data": [1.0, 500, 1500, "03-04- Click on Category"], "isController": true}, {"data": [1.0, 500, 1500, "04-05- Click on Product ID "], "isController": true}, {"data": [0.5, 500, 1500, "04-01-Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "04- 08 Add the payment Details and click continue"], "isController": true}, {"data": [1.0, 500, 1500, "04-10 Click on Sign out-1"], "isController": false}, {"data": [1.0, 500, 1500, "03-07 Sign off-1"], "isController": false}, {"data": [1.0, 500, 1500, "03-07 Sign off-0"], "isController": false}, {"data": [0.9924132947976878, 500, 1500, "02-Search"], "isController": true}, {"data": [0.5, 500, 1500, "04-03- Add The Credentials"], "isController": true}, {"data": [1.0, 500, 1500, "04-03- Add The Credentials-0"], "isController": false}, {"data": [1.0, 500, 1500, "04-03- Add The Credentials-1"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "01- Open URL"], "isController": true}, {"data": [1.0, 500, 1500, "04- 07 Click on Proceed to checkout"], "isController": true}, {"data": [1.0, 500, 1500, "03-02-Click sign in"], "isController": false}, {"data": [0.9928825622775801, 500, 1500, "02_03_Click on Product ID"], "isController": true}, {"data": [1.0, 500, 1500, "03-05 Click on Product ID"], "isController": true}, {"data": [0.9938936781609196, 500, 1500, "2-Enter the store"], "isController": false}, {"data": [0.75, 500, 1500, "04-02- Click on Sign in"], "isController": true}, {"data": [1.0, 500, 1500, "03-02-Click Sign in"], "isController": true}, {"data": [0.7407407407407407, 500, 1500, "03-03 Enter the Credentials"], "isController": false}, {"data": [1.0, 500, 1500, "04- 09- Click on Confirm"], "isController": true}, {"data": [0.5, 500, 1500, "03-01-01-open URL"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "02_02_Click on Category"], "isController": true}, {"data": [0.7551020408163265, 500, 1500, "03-07 Sign off"], "isController": true}, {"data": [0.9962264150943396, 500, 1500, "02_04_Click on Item ID"], "isController": true}, {"data": [1.0, 500, 1500, "04-10 Click on Sign out-0"], "isController": false}, {"data": [1.0, 500, 1500, "04-04 Click on Category"], "isController": true}, {"data": [0.48089171974522293, 500, 1500, "02_01_OpenURL"], "isController": true}, {"data": [1.0, 500, 1500, "03-03 Enter the Credentials-0"], "isController": false}, {"data": [0.7586206896551724, 500, 1500, "03-03 Enter the credentials"], "isController": true}, {"data": [1.0, 500, 1500, "04- 06 Click on Add to Cart"], "isController": true}, {"data": [0.9814814814814815, 500, 1500, "03-03 Enter the Credentials-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5133, 0, 0.0, 484.00350672121516, 0, 5362, 254.0, 1036.0, 1150.3000000000002, 1587.6599999999999, 51.42565171218466, 172.51099740830446, 34.0398473191386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["1-Open Pets Store", 1408, 0, 0.0, 992.8551136363636, 721, 4376, 951.0, 1200.1000000000001, 1321.7499999999998, 1964.7400000000011, 14.106237601939608, 20.002204099625306, 7.02148770149979], "isController": false}, {"data": ["3-Searrch for Item", 1353, 0, 0.0, 240.23059866962308, 179, 1716, 212.0, 320.0, 361.29999999999995, 467.3000000000002, 14.113597246127368, 49.20731016598863, 13.39696244393157], "isController": false}, {"data": ["03-06 Click on Item ID then Add to Cart", 52, 0, 0.0, 308.5384615384616, 0, 1556, 232.0, 407.0, 830.5999999999937, 1556.0, 0.6637817689784143, 3.038103028185195, 0.4168830738840169], "isController": true}, {"data": ["04-10 Click on Sign out", 2, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 0.8084074373484236, 4.1667719280517375, 0.9970884700889248], "isController": true}, {"data": ["03-01-open URL", 32, 0, 0.0, 888.375, 739, 1285, 828.0, 1128.3, 1218.0499999999997, 1285.0, 0.3322466100463069, 1.6695878844197107, 0.18453638619515336], "isController": true}, {"data": ["03-04- Click on Category", 54, 0, 0.0, 186.3703703703704, 176, 217, 184.0, 200.0, 209.5, 217.0, 0.6990562740300593, 2.744898264657527, 0.43344624224888995], "isController": true}, {"data": ["04-05- Click on Product ID ", 3, 0, 0.0, 136.66666666666669, 0, 205, 205.0, 205.0, 205.0, 205.0, 0.06451612903225806, 0.1812415994623656, 0.027973790322580645], "isController": true}, {"data": ["04-01-Open URL", 4, 0, 0.0, 850.0, 761, 939, 850.0, 939.0, 939.0, 939.0, 0.07745333436604446, 0.4022808191658276, 0.04201692113314228], "isController": true}, {"data": ["04- 08 Add the payment Details and click continue", 2, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 0.609942055504727, 2.8114516620921015, 0.7505146386093321], "isController": true}, {"data": ["04-10 Click on Sign out-1", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 24.404393564356432, 3.0312113242574257], "isController": false}, {"data": ["03-07 Sign off-1", 24, 0, 0.0, 281.0416666666667, 178, 473, 202.0, 430.0, 462.5, 473.0, 0.32810641584753986, 1.6174620968734192, 0.20378484421780796], "isController": false}, {"data": ["03-07 Sign off-0", 24, 0, 0.0, 242.70833333333331, 180, 338, 235.0, 310.5, 331.5, 338.0, 0.32802569534613546, 0.07367764641563589, 0.20661774755689194], "isController": false}, {"data": ["02-Search", 1384, 0, 0.0, 243.67991329479761, 0, 2312, 211.0, 321.5, 364.75, 948.1500000000001, 14.215721519767454, 48.453206128604, 13.19165344749222], "isController": true}, {"data": ["04-03- Add The Credentials", 4, 0, 0.0, 651.0, 565, 737, 651.0, 737.0, 737.0, 737.0, 0.07613681786169746, 0.40380767363953024, 0.12394538610883758], "isController": true}, {"data": ["04-03- Add The Credentials-0", 2, 0, 0.0, 247.0, 195, 299, 247.0, 299.0, 299.0, 299.0, 0.04245293031351489, 0.009535326144637134, 0.03992399598819809], "isController": false}, {"data": ["04-03- Add The Credentials-1", 2, 0, 0.0, 403.5, 369, 438, 403.5, 438.0, 438.0, 438.0, 0.04238904667034039, 0.21529827317621125, 0.02914246958585901], "isController": false}, {"data": ["01- Open URL", 1408, 0, 0.0, 1235.8366477272723, 721, 5478, 1185.0, 1485.0, 1648.1999999999998, 2414.2200000000034, 14.093247652793627, 88.24329048993553, 14.902426249424458], "isController": true}, {"data": ["04- 07 Click on Proceed to checkout", 2, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 0.5988023952095808, 3.280548278443114, 0.3789296407185629], "isController": true}, {"data": ["03-02-Click sign in", 29, 0, 0.0, 238.51724137931035, 183, 354, 223.0, 329.0, 342.0, 354.0, 0.3412607820755716, 1.3647558330587557, 0.20528968921733606], "isController": false}, {"data": ["02_03_Click on Product ID", 281, 0, 0.0, 250.41281138790032, 0, 2284, 222.0, 331.8, 352.69999999999993, 754.7000000000128, 3.102024595412095, 11.864006475890314, 1.9678296039123044], "isController": true}, {"data": ["03-05 Click on Product ID", 54, 0, 0.0, 185.48148148148152, 173, 208, 183.0, 199.0, 202.0, 208.0, 0.6992192052208367, 2.921126819264784, 0.454917356174494], "isController": true}, {"data": ["2-Enter the store", 1392, 0, 0.0, 245.76580459770096, 175, 3871, 212.0, 327.70000000000005, 372.6999999999998, 544.3499999999997, 14.269751612010374, 69.9088066478129, 8.077981562471168], "isController": false}, {"data": ["04-02- Click on Sign in", 4, 0, 0.0, 850.0, 230, 1470, 850.0, 1470.0, 1470.0, 1470.0, 0.07742484950544877, 0.30962378781719996, 0.04657588603062153], "isController": true}, {"data": ["03-02-Click Sign in", 31, 0, 0.0, 223.1290322580645, 0, 354, 221.0, 325.6, 339.59999999999997, 354.0, 0.3381068199417584, 1.2649076307164593, 0.19027029458920022], "isController": true}, {"data": ["03-03 Enter the Credentials", 27, 0, 0.0, 542.5185185185185, 377, 824, 508.0, 746.4, 814.4, 824.0, 0.34860750668164386, 1.8489134460820391, 0.5675085094124027], "isController": false}, {"data": ["04- 09- Click on Confirm", 2, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 0.3830683777054204, 2.0275689523079867, 0.23380638287684352], "isController": true}, {"data": ["03-01-01-open URL", 32, 0, 0.0, 888.34375, 738, 1285, 828.0, 1128.3, 1218.0499999999997, 1285.0, 0.3322500597011826, 1.6696052194407816, 0.18453830220219491], "isController": false}, {"data": ["02_02_Click on Category", 300, 0, 0.0, 242.27999999999997, 0, 5202, 207.0, 328.0, 343.95, 481.7000000000003, 3.096806160579722, 11.205397926688276, 1.8564909379709726], "isController": true}, {"data": ["03-07 Sign off", 49, 0, 0.0, 513.1428571428572, 0, 722, 500.0, 669.0, 702.0, 722.0, 0.6247688992592026, 3.1545251118846345, 0.7656208162796925], "isController": true}, {"data": ["02_04_Click on Item ID", 265, 0, 0.0, 251.04150943396232, 0, 5362, 224.0, 308.0, 341.7, 500.0, 3.0959752321981426, 11.121574529762253, 1.926998145335592], "isController": true}, {"data": ["04-10 Click on Sign out-0", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.8672176640926641, 2.3980453667953667], "isController": false}, {"data": ["04-04 Click on Category", 4, 0, 0.0, 288.5, 182, 395, 288.5, 395.0, 395.0, 395.0, 0.07693639283722183, 0.3098493008405301, 0.04763444634648305], "isController": true}, {"data": ["02_01_OpenURL", 314, 0, 0.0, 985.4681528662414, 749, 2583, 916.0, 1182.0, 1478.0, 2160.0, 3.2161586365126187, 16.033801513591854, 1.7961260140117994], "isController": true}, {"data": ["03-03 Enter the Credentials-0", 27, 0, 0.0, 257.07407407407413, 189, 414, 241.0, 371.8, 401.5999999999999, 414.0, 0.3495145631067961, 0.07850424757281553, 0.3286938713592233], "isController": false}, {"data": ["03-03 Enter the credentials", 29, 0, 0.0, 505.10344827586204, 0, 824, 494.0, 733.0, 812.0, 824.0, 0.34204970336034346, 1.6890201492339265, 0.518430600031846], "isController": true}, {"data": ["04- 06 Click on Add to Cart", 2, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 0.38483740619588225, 1.8306084038868577, 0.25142209447758324], "isController": true}, {"data": ["03-03 Enter the Credentials-1", 27, 0, 0.0, 285.2222222222223, 187, 541, 199.0, 452.2, 513.7999999999998, 541.0, 0.3494964662023973, 1.7751280475768243, 0.24027882051414812], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5133, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
