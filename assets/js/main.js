
$(".dater").datepicker();

$('#hold_end_date').datepicker("setDate", new Date() );

function getDate() {
	$("#end_date").append("<p>" + start($("#start_date").val(), $("#sentence").val()) + "</p>")
}

crimes_data = []
out = []
$.getJSON("data/crimes.json", function (d) {
	crimes_data = d
	out = _.map(d, function (value, key, list) {
		// console.log(value.Offense)
		return {label:value.Offense + " " + value["Staircase Factor"], value:value.id}
	})
	$(".crimes").autocomplete({source: out})
})

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
	return false
});

function el (tag, attributes, content) {
	return "<" + tag + " " + attributes + ">" + content + "</" + tag + ">"
}

function getOffenseLevel(cid) {

	return _.findWhere(crimes_data, {id: parseInt(cid)})["Offense Seriousness Level"]
}