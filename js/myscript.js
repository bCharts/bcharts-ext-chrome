var tableID;
var created = false;
var data;
var parsingHTML = false;

 function setSelection() {
  // console.log(window.getSelection().toString());
  var sel = window.getSelection().toString();
  if(sel.length)
      chrome.extension.sendRequest({'message':'setText','data': sel},function(response){})
}

// document.addEventListener('mouseup',function(event)
// document.addEventListener('mouseup',function(event) { setSelection(); })
// document.addEventListener('select',function(event) { setSelection(); })
document.addEventListener('selectionchange',function(event) { setSelection(); })

chrome.runtime.onMessage.addListener(
 function(request, sender) {
 	switch (request.message)
 	{
        case 'highlightCode':
           parsingHTML = true;
        break;

        default:
        	sendResponse({data: 'Invalid arguments'});
        break;
    }
  });



$(document).on("click", "#parseButton",function() {
	// replace just a table with ID of the right one
 	 parsingHTML = true;
});

$( 'table' ).mouseover(function(event) {
	if (parsingHTML){
		$(this).addClass("tableToCSV");
		var position = $(this).closest('table').offset();
		var width = $(this).closest('table').width();
		var height = $(this).closest('table').height();
		tableID =  $(this).attr("id");
	    var tag = '<div id="rect" name="rectname" style="position: absolute; padding: 0px; margin: 0px; border-style: dotted; border-width: 2px; border-color: #2980b9; background-color: #3498db; opacity: 0.3; top: ' + position.top + 'px; left: ' + position.left + 'px; width: ' + width + 'px; height: ' + height + 'px; z-index: "1147483646"></div>';
		var btnblock = '<div id="btn" style="position: absolute; padding: 0px; margin: 0px; top: ' + (position.top+10) + 'px; left: ' + (position.left+10) + 'px; z-index: "2147483646"><button id="grabber" style="font-family:Oswald">Copy</button></div>'
		if (!created) {
			$(tag).appendTo(document.body);
			$(btnblock).appendTo(document.body);
			created = true;
			$("#rect").on('click', function (event) {
   	 		}, false);
		}

	}

});

$(document).on("mouseout", "#rect",function(event) {
	if ((event.pageX<$("#rect").position().left) ||  (event.pageX>$("#rect").position().left+$("#rect").width()) || (event.pageY<$("#rect").position().top) || (event.pageY>$("#rect").position().top+$("#rect").height())){
 	 	$(this).remove();
 	 	$("#btn").remove();
 	 	$(".tableToCSV").removeClass("tableToCSV");
 		 created = false;
 	}
});


$(document).on("click", "#grabber",function() {
	// replace just a table with ID of the right one
 	 var txt = $(".tableToCSV").TableCSVExport();
 	 data = {
    'redirect_uri': "http://beta.bcharts.xyz/chartdesigner" ,
    'payload': txt,
    'redirect_type': 'redirect',
  }
  parsingHTML = false;
  chrome.extension.sendRequest({'message':'htmlParsed','data': data},function(response){})

});


