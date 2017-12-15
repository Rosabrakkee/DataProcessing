/**
 * Rosa Brakkeee
 * DataProc Week 6
 *
 * the queue for loading in the data
 *
 **/

 // load the data and start making the map
window.onload = function() {
    queue()
        .defer(d3.json, "Data/populatie.json")
        .defer(d3.json, "Data/inkomen.json")
        .await(makePage);

    function makePage(error, data1, data2) {
        if (error) throw error;
        makeMap(data1, data2);
    };
};
