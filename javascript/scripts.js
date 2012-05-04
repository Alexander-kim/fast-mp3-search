Events = {};

Events.enableFocusCall = function() {
	if (location.search !== "?foo") {
		location.search = "?foo";
		throw new Error;
	}
};

Events.submitFormOnEnter = function() {
	window.addEventListener("keydown", function(event) {
		if (event.keyCode == 13) {
			return Events.submitForm();
		}
	}, false);
};

Events.submitForm = function() {
	var q = document.getElementById('searchField').value;
	$("#musics").html("");
	$("#loading").show();

	$.ajax({
		url : 'http://mp3skull.com/search.php?q=' + escape(q),
		complete : function(data) {
			$("#loading").hide();
			var page = data.responseText;

			var aux = $("div[class*=show]", page);

			var musics = $.map($("div[class*=show]", page), function(musica) {
				var item = {};
				item.nome = $(musica).find('b').text();
				item.fileUrl = $(musica).find("a").attr("href");

				var moreInfo = $(musica).find('.left').html().replace(/<.*>/,
						'').replace(/<br>/g, '|').trim().split("|");

				$.map(moreInfo, function(valor) {
					if (valor.indexOf("kbps") != -1) {
						item.bitTrate = valor
					}
					if (valor.indexOf("mb") != -1) {
						item.size = valor
					}
					if (valor.indexOf(":") != -1) {
						item.length = valor
					}
				});
				return item;
			})
			renderResults(musics);

			$("#musics li").click(function() {

				chrome.tabs.create({
					'url' : $(this).find('.fileUrl').val()
				}, function(tab) {
					window.close();
				});

			})
		}
	})

	return false;
};

Events.typingInSearchField = function() {
	$.ajax({
		url : "http://www.google.com.br/s?q=" + $('#searchField').val(),
		complete : function(x) {
			var values = JSON.parse(x.responseText.replace(
					"window.google.ac.h(", '').replace(')', ''))[1];
			console.log(values);

			var renderList = $.map(values, function(item) {
				return "<li>" + item[0] + "</li>"
			}).join("");

			$("#autoComplete").html(renderList);

		}
	});
	return false;
};

function renderResults(musics){
	var list = "";

	var htmlPure =  $.map(musics,function(music,index){
		var shared4 = "";

		if (music.fileUrl.indexOf("4shared") != -1)
			shared4 = " shared4"

		return "<li class=\"item"+index%2+shared4+"\"><b>"+ music.nome + "</b><br>" 
			+ (music.size != null ?  ("<span><b>Filesize</b>"+music.size+"</span>") : '')
			+ (music.bitTrate != null ?  ("<span><b>Bitrate</b>"+music.bitTrate+"</span>") : '')
			+ (music.length != null ?  ("<span><b>Length</b>"+music.length+"</span>") : '')
			+ '<input type="hidden" class="fileUrl" value="'+music.fileUrl+'">'
			+ "</li>"

	}).join('');

	$("#musics").html(htmlPure);
}