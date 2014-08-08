crimes_data = []

sentencing_grid = []

out = []
out2 = []

current_charge_level = "";
MaxHC = "";
MinHC = "";
MaxPrison = "";
MinPrison = "";

$.getJSON("data/sentencing_grid.json", function (dat) {
		//console.log( "HELLO WORLD");
		sentencing_grid = dat;
		} )

$.getJSON("data/offense_list.json", function (d) {
		crimes_data = d
		out = _.map(d, function (value, key, list) {
			// console.log(value.Offense)
			return {label:value.Offense + " " + value["Staircase Factor"], value:value.id}
		})
		$(".crimes").autocomplete({source: out})
	} )

		//out = _.map(d, function (value, key, list) {
		//	console.log( value, key, list );
		//	// console.log(value.Offense)
		//	return {label:value, value:value.id}
		//})
		//$(".crimes").autocomplete({source: out})
// How do I load this on page load?

$("#priors").on("autocompleteselect", function( event, ui ) {
	$("#priors_select").append(el("option", "selected='selected' value='" + ui.item.value + "'",ui.item.label))
	$(this).val("")
	$(".crimes").autocomplete({source: out})
	return false
});

$("#current").on("autocompleteselect", function( event, ui ) {
	$(this).val(ui.item.label)
	$("#current_place").html(el("input","id='current_charge' type='hidden' name='current_charge' value='" + ui.item.value + "'",""))
	$(".crimes").autocomplete({source: out})
	console.log("The Current Offense Level IS: " + getOffenseLevel(ui.item.value))
	current_charge_level = getOffenseLevel( ui.item.value );
	MaxHC = getMaxHC( ui.item.value );	
	MinHC = getMinHC( ui.item.value );	
	MaxPrison = getMaxPrison( ui.item.value );	
	MinPrison = getMinPrison( ui.item.value );	
	console.log( MaxHC, MinHC, MaxPrison, MinPrison );
	return false
});

// This is the function that returns
function getDate() {
	var priors_in = $("#priors_select").val()
    var date_range = $("#hold_start_date").val()
	//var current_charge = getOffenseLevel( $("#current").val() )
	//console.log( current_charge )
	console.log( current_charge_level)
	var sentence_info = ( get_history_axis( priors_in, current_charge_level ) );
	document.getElementById( "sentence_box" ).value = sentence_info["Range"] + " months";
    county = $('input:radio[name=radio-view]:checked').val();
    minmax = getParoleRangePs(new Date(), county, sentence_info, date_range)
    rangeString = "Minimum Parole Eligibility Date: " + minmax[0] + ". Maximum Parole Eligibility Date: " + minmax[1]
	console.log(rangeString)
    $("#sentence_range_box").val(rangeString)
	//console.log(get_history_axis(priors_in))
}

function getParoleRangePs (start_date, county, sentence_info, hold_range) {
    parole_range = sentence_info["Range"]
    parole = parole_range[parole_range.length -1].split("-")
    parole_min = parole[0]
    if (county == "sup") {
        parole_max = parseInt(parole[1]) / 2
    }
    else {
        parole_max = parole[1]
    }
    min = start(start_date, "0/"+parole_min+"/0", true, "yes", hold_range)
    max = start(start_date, "0/"+parole_max+"/0", true, "yes", hold_range)
    return [min, max]
}

function el (tag, attributes, content) {
	return "<" + tag + " " + attributes + ">" + content + "</" + tag + ">"
}

function getOffenseLevel(cid) {
	return _.findWhere(crimes_data, {id: parseInt(cid)})["Offense Seriousness Level"]
}

function getMaxHC(cid) {
	return _.findWhere(crimes_data, {id: parseInt(cid)})["Max H/C"]
}

function getMinHC(cid) {
	return _.findWhere(crimes_data, {id: parseInt(cid)})["Min H/C"]
}

function getMaxPrison(cid) {
	return _.findWhere(crimes_data, {id: parseInt(cid)})["Max Prison"]
}

function getMinPrison(cid) {
	return _.findWhere(crimes_data, {id: parseInt(cid)})["Min Prison"]
}


function get_history_axis (priors_in, current_charge_level ) {
    var priors = makePriors()
    
    if ( priors_in != null ) {
    priors_in.forEach(function (elem, index, array) {
        var level = getOffenseLevel(elem);
        priors[level].push(index)
    	})

    }
    //getAxis(priors, current_charge)
    //return priors
    return getAxis(priors, current_charge_level )
}

function makePriors() {
    var f = new Array();
    for (i=0;i<9;i++) {
        f[i]=new Array();
    }
    return f
}

function getAxis (priors, current_charge_level ) {
	
	var conviction_counts = new Array();
	_.each( priors, function( elem, index, array ) {
		conviction_counts.push( elem.length );
		//console.log( elem.length, index );
	} );


	//console.log( "sentence counts" );
	//console.log( conviction_counts );

	//insert logic here
	// E
	var criminal_history_group = "";
    if ( conviction_counts[6] + conviction_counts[7] + conviction_counts[8] >= 2 ) {
        criminal_history_group = "E";
    }

    // D
    else if ( conviction_counts[6] + conviction_counts[7] + conviction_counts[8] >= 1 ) {
        criminal_history_group = "D";
    }    

    else if ( conviction_counts[4] + conviction_counts[5] >= 2 ) {
        criminal_history_group = "D";
    }
    else if ( conviction_counts[2] + conviction_counts[3] + conviction_counts[4] + conviction_counts[6] >= 6 ) {
        criminal_history_group = "D";
    }    

    // C
    else if ( conviction_counts[4] + conviction_counts[5] >= 1 ) {
        criminal_history_group = "C"
    }
    else if ( conviction_counts[2] + conviction_counts[3] >= 3 ) {
        criminal_history_group = "C"
    }

    // B
    else if ( conviction_counts[2] + conviction_counts[3] >= 1 ) {
        criminal_history_group = "B";
    }
    else if ( conviction_counts[0] + conviction_counts[1] >= 6 ) {
        criminal_history_group = "B";
    }
    // A
    else if ( conviction_counts[0] + conviction_counts[1] >= 1 ) {
        criminal_history_group = "A";
    }
    else {
        criminal_history_group = "A"
    }
    
    console.log( "Criminal History Group ", criminal_history_group );
    console.log( "Current Charge Level ", current_charge_level );

    var grid_index = ""
    if ( criminal_history_group == "A" ) {
    	grid_index = 0
    }
    else if ( criminal_history_group == "B" ) {
    	grid_index = 1
    }

    else if ( criminal_history_group == "C" ) {
    	grid_index = 2
    }

    else if ( criminal_history_group == "D" ) {
		grid_index = 3
    }

    else if ( criminal_history_group == "E" ) {
		grid_index = 4	
    }
    //console.log( grid_index );
    //console.log( current_charge_level );
    //console.log( sentencing_grid[grid_index]["Level"][current_charge_level] );

  	return { "MinPrison": MinPrison, "MaxPrison": MaxPrison, "MinHC": MinHC, "MaxHC": MaxHC, "Range": sentencing_grid[grid_index]["Level"][current_charge_level]  }




}