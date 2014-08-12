var page = "indigency";

$(document).bind("mobileinit", function(){
	$.mobile.defaultPageTransition = 'slide';
});

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function proper_ans () { 
	var radioview = $('input[name="radio-view"]:checked').val();
	if (radioview == "dist") {
		hide('county_prison_info');
		show('state_prison_info');
		hide('parole_info');		
	} else if (radioview == "sup") {
		show('county_prison_info');
		hide('state_prison_info');	
		show('parole_info');
	}
	show('credits_info');
} 

function reset_sent () {

	document.getElementById( "hold_start_date" ).value = null;
	document.getElementById( "hold_end_date" ).value = null;
	$("#priors_select option").remove();
	document.getElementById( "current" ).value = null;
	
	document.getElementById( "history_box" ).value = null;
	document.getElementById( "level_box" ).value = null;
	document.getElementById( "sentence_box" ).value = null;
	document.getElementById( "MinPrison" ).value = null;
	document.getElementById( "MaxPrison" ).value = null;
	document.getElementById( "MinHC" ).value = null;
	document.getElementById( "MaxHC" ).value = null;	
	document.getElementById( "credits_box" ).value = null;
	
	hide('county_prison_info');hide('state_prison_info');hide('credits_info');hide('parole_info');
}

function calculate () {
	var crimciv = $('input[name="crimciv"]:checked').val();
	var income =  document.getElementById('income').value; 
	var grossincome =  income; 
	var range = document.getElementById('range').value;
	var agross;
	var taxable_state;
	var sspaid;
	var bracket;
	var household = document.getElementById('household').value
	var threshold;
	var multiplier;
	var label;
	var explination = "";
		
	hide("civ_links");
	hide("lawyer_links");
	hide("supp_aff");
	hide("inmates");

	if ( household == 1 ) {
		threshold = 11670;
	} else if (household == 2) {
		threshold = 15730;
	} else if (household == 3) {
		threshold = 19790;
	} else if (household == 4) {
		threshold = 23850;
	} else if (household == 5) {
		threshold = 27910;
	} else if (household == 6) {
		threshold = 31970;
	} else if (household == 7) {
		threshold = 36030;
	} else if (household == 8) {
		threshold = 40090;
	}
	
	// weekly, monthly, quarterly, annually 
	if ( range == 1 ) {
		multiplier = 52;
	} else if (range == 2) {
		multiplier = 12;
	} else if (range == 3) {
		multiplier = 4;
	} else if (range == 4) {
		multiplier = 1;
	}
	
	income = income * multiplier;
	grossincome = grossincome * multiplier;

	// untaxed
	if ( document.getElementById('tax').checked == false ) {
		agross = income - 5850 - 3800 * household;
		if (agross < 0) {
			agross = 0;
		}
		if (document.getElementById('contractor').checked == true) {
			ssrate = 0.084 * 0.958;
			medrate = 0.029;
		} else {
			ssrate = 0.042;
			medrate = 0.0145;
		}
		if (income > 24000) {
			if (agross*ssrate > 2000) {
				sspaind = 2000;
			} else {
				sspaind = 0;
			}
			taxable_state = income - 4400 - agross*ssrate;
		} else {
			taxable_state = 0;
		}
		if (taxable_state < 0) {
			taxable_state = 0;
		}
		if (income < 8701) {
			bracket = 0;
		} else if (income >= 8701 && income < 35350) {
			bracket = 0.15;	
		} else if (income > 35351 && income < 85650) {
			bracket = 0.25;	
		} else if (income > 85650 && income < 178650) {
			bracket = 0.28;	
		} else if (income > 178650) {
			bracket = 0.35;	
		}
		
		income = income - agross*(bracket+ssrate+medrate) - (taxable_state*0.053);
	}

	indgent=threshold*1.25;
	indgentbutable=threshold*2.5;
	indgent=indgent.toFixed(2);		
	indgentbutable=indgentbutable.toFixed(2);		
		
	grossincome = grossincome.toFixed(2);		
	income = income.toFixed(2);

	
	if (crimciv == "crim" && (income <= threshold*1.25 || document.getElementById('assist').checked == true || document.getElementById('bail').checked == true || document.getElementById('custody').checked == true || document.getElementById('treatment').checked == true)) { 
		label = "<p style=\"background:#ddffdd;padding:10px;text-align:center;\"><font size=+2>Indigent</font></p>";

		if (income <= threshold*1.25) {
			explination = explination + "According to Rule 3:10 &sect;1(f), a party is Indigent if (s)he is \"receiving an annual income, after taxes, one hundred twenty five percent [$"+ addCommas(indgent)+ "] or less of the then current poverty threshold....\"";
		}

		if (document.getElementById('assist').checked == true) {
			explination = explination + "<p>According to Rule 3:10 &sect;1(f), a party is Indigent if (s)he is \"receiving one of the following types of public assistance: Aid to Families with Dependent Children (AFDC), Emergency Aid to Elderly, Disabled and Children (EAEDC), poverty related veterans' benefits, food stamps, refugee resettlement benefits, Medicaid, or Supplemental Security Income (SSI);\"</p>";
		} 

		if (document.getElementById('bail').checked == true) {
			explination = explination + "<p>According to Rule 3:10 &sect;1(f)(v), a party is Indigent if (s)he is \"held in custody in jail and has no available funds.\" According to Rule 3:10 &sect;1(b)(i), available funds are \"calculated after provision is made for the party's bail obligations.\" Consequently, if a party is unable to make his/her bail obligation, it may be reasonable to argue that (s)he has no available funds as evidenced by his/her inability to make bail.</p>";
		} 		

		if (document.getElementById('custody').checked == true) {
			explination = explination + "<p>According to Rule 3:10 &sect;1(f)(iv) and (v), a party is Indigent if (s)he is \"serving a sentence in a correctional institution and has no available funds; or [(s)he is] held in custody in jail and has no available funds.\"</p>";
		}

		if (document.getElementById('treatment').checked == true) {
			explination = explination + "<p>According to Rule 3:10 &sect;1(f)(iii), a party is Indigent if (s)he is \"residing in a tuberculosis treatment center or a public or private mental health, mental retardation or long term care facility, including the Bridgewater State Hospital and the Treatment Center, or the subject of a proceeding in which admission or commitment to such a center or facility is sought, or who is the subject of a proceeding in which a substituted judgment determination concerning treatment is sought, provided, however, that where the judge has reason to believe that the party is not indigent, a determination of indigency shall be made in accordance with Section 4 and other applicable provisions of this rule. The provisions of paragraph (b) of Section 1 of this rule notwithstanding, for purposes of such determination \"available funds\" shall not include the liquid assets or disposable net monthly income of any member of the party's family.\"</p>";
		} 		
		

	} else if (crimciv == "civ" && (income <= threshold*1.25 || document.getElementById('assist').checked == true || document.getElementById('deprive').checked == true)) { 
		label = "<p style=\"background:#ddffdd;padding:10px;text-align:center;\"><font size=+2>Indigent</font></p>";

		if (income <= threshold*1.25) {
			explination = explination + "According to Chapter 261 sec 27A, a party is Indigent if his/her \"... income, after taxes, is 125 per cent [$"+ addCommas(indgent)+ "] or less of the current poverty threshold established annually by the Community Services Administration pursuant to section 625 of the Economic Opportunity Act, as amended...\"";
		}

		if (document.getElementById('assist').checked == true) {
			explination = explination + "<p>According to Chapter 261 sec 27A, a party is Indigent if (s)he \"...receives public assistance under aid to families with dependent children, program of emergency aid for elderly and disabled residents or veterans’ benefits programs or who receives assistance under Title XVI of the Social Security Act or the medicaid program, 42 U.S.C.A. 1396, et seq....\"</p>";
		} 

		if (document.getElementById('deprive').checked == true) {
			explination = explination + "<p>According to Chapter 261 sec 27A, a party is Indigent if (s)he \"...is unable to pay the fees and costs of the proceeding in which he is involved or is unable to do so without depriving himself or his dependents of the necessities of life, including food, shelter and clothing...\"</p>";
			show("supp_aff");
		} 		
		
		show("civ_links");

	} else if (crimciv == "crim" && income > threshold*1.25 && income < threshold*2.5) {
		label = "<p style=\"background:#ffffdd;padding:10px;text-align:center;\"><font size=+2>Indigent but Able to Contribute</font></p>";
		explination = explination + "<p>According to Rule 3:10 &sect;1(g), a party is Indigent but Able to Contribute if (s)he \"has an annual income, after taxes, of more than one hundred twenty five percent [$"+ addCommas(indgent)+ "] and less than two hundred fifty percent [$"+ addCommas(indgentbutable)+ "] of the then current poverty threshold....\"</p>";

	} else if (crimciv == "crim") {
		label = "<p style=\"background:#FA8072;padding:10px;text-align:center;\"><font size=+2>Not Indigent</font></p>";
		explination = "<p>At first glance, the party does not seem to meet the definition of Indigent or Indigent But Able to Contribute under Rule 3:10 &sect;1(f)-(g).</p>";

		if (document.getElementById('felony').checked == true) {
			explination = explination + "<p style=\"background:yellow;padding:5px;\">However, according to Rule 3:10 &sect;1(g)(ii), a party is Indigent but Able to Contribute if (s)he \"is charged with a felony within the jurisdiction of the Superior Court and whose available funds are insufficient to pay the anticipated cost of counsel for the defense of the felony but are sufficient to pay a portion of that cost.\" So one might want to look into this.</p>";
		} 	

		show("lawyer_links");
				
	} else if (crimciv == "civ") {
		label = "<p style=\"background:#FA8072;padding:10px;text-align:center;\"><font size=+2>Not Indigent</font></p>";
		explination = "<p>At first glance, the party does not seem to meet the definition of Indigent or Indigent But Able to Contribute under Chapter 261 sec 27A.</p>";
		
		show("civ_links");
		show("lawyer_links");		
	}
	
	if (crimciv == "civ" && document.getElementById('suing').checked == true) {
		explination = explination + "<p>According to Chapter 261 sec 27A, however, \"...an inmate shall not be adjudged indigent pursuant to section 27C unless the inmate has complied with the procedures set forth in section 29 and the court finds that the inmate is incapable of making payments under the plans set forth in said section 29....\"</p>";
		show("inmates");
	} 
	
	
	if ( document.getElementById('tax').checked == false) {
		footnote = "<sup>&dagger;</sup>";
		
		explination = explination + "<p><b>" + footnote + "</b> This is an after-tax estimate based on a gross income of $"+addCommas(grossincome)+" and a number of assumptions that might not apply.</p>";
	} else {
 	 	footnote ="";
	}
	
	resultDocument = "Assuming a household of " + household + ", an annual after-tax income of \$" + addCommas(income) + "," + footnote + " and the selections you made on the last page, the party may be:" + label + explination;	

	$('#ans_v').html(resultDocument).trigger("create");
  	//$.mobile.changepage('#ans');
	document.location.href='#ans';
	$('#ans').div('refresh');

} // end load_sub

function load_ans () {
	if (page != 'ans') {
		$.mobile.changePage('#indigency', { transition: "fade"});
	}	
} // end load_sub

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

//show funtion
function show(id) { 
    
    if (document.getElementById) { // DOM3 = IE5, NS6
            document.getElementById(id).style.display = 'block';
    } else { 
        if (document.layers) {  
                document.id.display = 'block';
        } else {
                document.all.id.style.display = 'block';
        }
    }
}

//hide funtion
function hide(id) { 
    if (document.getElementById) { // DOM3 = IE5, NS6
            document.getElementById(id).style.display = 'none';         
    } else { 
        if (document.layers) {  
                document.id.display = 'none';
        } else {
                document.all.id.style.display = 'none';
        }
    }
}