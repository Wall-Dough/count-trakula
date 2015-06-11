var counters = [{"name": "abcdefg", "id": 0, "value": 0, "slug": "test1"}, {"name": "Foo Bar","id":1,"value":0,"slug":"test2"},{"name":"Change CSS","id":2,"value":0,"slug":"test3"},{"name":"Short Round","id":3,"value":0,"slug":"test4"},{"name":"Staples","id":4,"value":0,"slug":"test5"},{"name":"camelCase","id":5,"value":0,"slug":"test6"}];

var lookup;

function createLookup(toIndex) {
	var lookup = {};
	for (var i = 0; i < toIndex.length; i++) {
		lookup[toIndex[i].slug] = toIndex[i];
	}
	return lookup;
}

function addToTrie(counter, trie, position) {
	if (position >= counter.name.length) {
		return;
	}
	var character = counter.name.charAt(position).toLowerCase();
	if (trie[character] == null) {
		trie[character] = {};
	}
	if (trie[character]["counters"] == null) {
		trie[character]["counters"] = [];
	}
	trie[character]["counters"].push(counter);
	addToTrie(counter, trie[character], position + 1);
}

function createTrie(toIndex) {
	var trie = {};
	for (var i = 0; i < toIndex.length; i++) {
		addToTrie(toIndex[i], trie, 0);
	}
	return trie;
}

function incrementListener(e) {
	var link = e.currentTarget;
	var elementId = link.getAttribute("id");
	var counterSlug = elementId.substring(0, elementId.lastIndexOf("-up-link"));
	var counter = lookup[counterSlug];
	counter.value++;
	document.getElementById(counterSlug + "-value").innerHTML = counter.value.toString();
}

function incrementListener2(e) {
	var link = e.currentTarget;
	var elementId = link.getAttribute("id");
	var counterSlug = elementId.substring(0, elementId.lastIndexOf("-add-link"));
	var counter = lookup[counterSlug];
	counter.value++;
	document.getElementById(counterSlug + "-value").innerHTML = counter.value.toString();
}

function decrementListener(e) {
	var link = e.currentTarget;
	var elementId = link.getAttribute("id");
	var counterSlug = elementId.substring(0, elementId.lastIndexOf("-down-link"));
	var counter = lookup[counterSlug];
	counter.value--;
	document.getElementById(counterSlug + "-value").innerHTML = counter.value.toString();
}

function decrementListener2(e) {
	var link = e.currentTarget;
	var elementId = link.getAttribute("id");
	var counterSlug = elementId.substring(0, elementId.lastIndexOf("-subtract-link"));
	var counter = lookup[counterSlug];
	counter.value--;
	document.getElementById(counterSlug + "-value").innerHTML = counter.value.toString();
}

function setValue(e) {
	var button = e.currentTarget;
	var elementId = button.getAttribute("id");
	var slug = elementId.substring(0, elementId.lastIndexOf("-value-submit"));
	var textInput = document.getElementById(slug + "-value-input");
	var value = textInput.value;
	textInput.value = "";
	var counter = lookup[slug];
	counter.value = parseInt(value);
	document.getElementById(slug + "-value").innerHTML = counter.value.toString();
}

function getFilteredCounters(searchTerm, position, trie) {
	if (position >= searchTerm.length) {
		return trie["counters"];
	}
	var character = searchTerm.charAt(position).toLowerCase();
	if (trie[character] == null) {
		return [];
	}
	else {
		return getFilteredCounters(searchTerm, position + 1, trie[searchTerm.charAt(position)]);
	}
}

function updateFilter() {
	var searchTerm = document.getElementById("search").value;
	if (searchTerm == "") {
		loadCounters(counters);
		return;
	}
	var filtered = [];
	filtered = getFilteredCounters(searchTerm, 0, trie);
	loadCounters(filtered);
}

function loadCounters(toLoad) {
	var counterTable = document.getElementById("counter-table");
	counterTable.innerHTML = "";
	for (var i = 0; i < toLoad.length; i++) {
		// Initialize counter
		var counterRow = document.createElement("tr");
		counterRow.setAttribute("id", toLoad[i].slug + "-row");
		counterRow.setAttribute("class", "counter-row");
		// Arrows
		var counterArrows = document.createElement("td");
		counterArrows.setAttribute("id", toLoad[i].slug + "-arrows");
		counterArrows.setAttribute("class", "counter-arrows");
		// Up arrow
		var upLink = document.createElement("a");
		upLink.setAttribute("id", toLoad[i].slug + "-up-link");
		upLink.setAttribute("class", "counter-arrow-link");
		upLink.addEventListener("click", incrementListener);
		var upImg = document.createElement("img");
		upImg.setAttribute("src", "images/up-arrow.png");
		upImg.setAttribute("id", toLoad[i].slug + "-up-img");
		upImg.setAttribute("class", toLoad[i].slug + "-arrow-img");
		upLink.appendChild(upImg);
		counterArrows.appendChild(upLink);
		// Down arrow
		var downLink = document.createElement("a");
		downLink.setAttribute("id", toLoad[i].slug + "-down-link");
		downLink.setAttribute("class", "counter-arrow-link");
		downLink.addEventListener("click", decrementListener);
		var downImg = document.createElement("img");
		downImg.setAttribute("src", "images/down-arrow.png");
		downImg.setAttribute("id", toLoad[i].slug + "-down-img");
		downImg.setAttribute("class", toLoad[i].slug + "-arrow-img");
		downLink.appendChild(downImg);
		counterArrows.appendChild(downLink);
		counterRow.appendChild(counterArrows);
		// Counter value element
		var counterValue = document.createElement("td");
		counterValue.setAttribute("class", "counter-value");
		counterValue.setAttribute("id", toLoad[i].slug + "-value");
		counterValue.innerHTML = toLoad[i].value.toString();
		counterRow.appendChild(counterValue);
		// Counter name element
		var counterName = document.createElement("td");
		counterName.setAttribute("class", "counter-name");
		counterName.setAttribute("id", toLoad[i].slug + "-name");
		counterName.innerHTML = toLoad[i].name;
		counterRow.appendChild(counterName);
		// Value input element
		var valueSetCell = document.createElement("td");
		valueSetCell.setAttribute("class", "value-set");
		valueSetCell.setAttribute("id", toLoad[i].slug + "-value-set");
		var valueSetInput = document.createElement("input");
		valueSetInput.setAttribute("class", "value-input");
		valueSetInput.setAttribute("id", toLoad[i].slug + "-value-input");
		valueSetInput.setAttribute("type", "text");
		valueSetCell.appendChild(valueSetInput);
		// Value submit element
		var valueSetSubmit = document.createElement("input");
		valueSetSubmit.setAttribute("class", "value-submit");
		valueSetSubmit.setAttribute("id", toLoad[i].slug + "-value-submit");
		valueSetSubmit.setAttribute("type", "button");
		valueSetSubmit.setAttribute("value", "Set Value");
		valueSetSubmit.addEventListener("click", setValue);
		valueSetCell.appendChild(valueSetSubmit);
		counterRow.appendChild(valueSetCell);
		counterTable.appendChild(counterRow);
	}
}

window.onload = function () {
	lookup = createLookup(counters);
	trie = createTrie(counters);
	loadCounters(counters);
}
