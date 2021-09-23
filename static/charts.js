// Grab a reference to the dropdown select element
function init() {
  //Selection of the menu dropdown in HTML
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

// Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/samples.json").then((data) => {
	// 3. Create a variable that holds the samples array.   
  var metadata = data.metadata;
  // 4. Create a variable that filters the samples for the object with the desired sample number.
    var meta = metadata.filter(ID => ID.id == sample);
  //  5. Create a variable that holds the first sample in the array.
    var MetaNo = meta[0];
    var wfreq = parseFloat(MetaNo.wfreq);
    var samples = data.samples;
    var selected = samples.filter(ID => ID.id == sample);
    var SampleNo = selected[0];

// 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = SampleNo.otu_ids;
    var otu_labels = SampleNo.otu_labels;
    var sample_values = SampleNo.sample_values;

    var tenOTU = otu_ids.slice(0, 10).reverse();
    var Count = tenOTU.map(OTU => ("OTU " + OTU + " -"));

// 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
// 8. Create the trace for the bar chart. 
    var yticks = [{
      x: sample_values.slice(0, 10).reverse(),
      y: Count,
      text: otu_labels.reverse(),
      type: "bar",
      orientation: "h"
     }  
    ];

// 9. Create the layout for the bar chart.
    var barData = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      xaxis: {title: 'Colony Count'}
    };

// 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", yticks, barData);

// 1. Create the trace for the bubble chart.
var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker:{ size: sample_values, color:otu_ids}
     }
    ];

 // 2. Create the layout for the bubble chart.
 var bubbleLayout = {
      title: { text: "<b>Bacteria Cultures Per Sample</b>"},
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
	    automargin: true,
    };

// 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    
// 4. Create the trace for the gauge chart.
    var gaugeData = [{value:wfreq, 
      type:'indicator',
      mode:'gauge+number',
      title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week" },
      gauge: { axis: { range: [0, 10] }, 
	  threshold: { value:wfreq, line:{color: "red", width: 6}},
      bar: { color: "yellow" },
      steps: [
        { range: [0, 1], color: "#ddeeee" },
		{ range: [1, 2], color: "#cce6e6" },
        { range: [2, 3], color: "#bbdddd" },
        { range: [3, 4], color: "#aad5d5" },
        { range: [4, 5], color: "#98cdcd" },
        { range: [5,6], color: "#87c4c4" },
        { range: [6,7], color: "#76bcbc" },
        { range: [7,8], color: "#65b3b3" },
        { range: [8,9], color: "#54abab" },
        { range: [9,10], color: "#4b9a9a" }
      ]}
    }];

// 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, height: 500, 
	  margin: { t: 2, b: 2 },      
    };

// 6. Use Plotly to plot the gauge data and layout.    
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}