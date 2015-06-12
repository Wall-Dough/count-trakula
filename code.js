/*
var counter = {
    name: "Counter Name",
    id: 10,
    value: 0,
    slug: "counterslug",
    groups: ["group1", "group2"]
    };
*/

var counters = [];

var groups = [];

function randomName() {
    var name = "";
    for (var j = 0; j < 5; j++) {
        name += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    return name;
}

for (var i = 0; i < 5; i++) {
    groups.push(randomName());
}

for (var i = 0; i < 100; i++) {
    var counter = {};
    counter["name"] = randomName();
    counter["id"] = i;
    counter["value"] = 0;
    counter["slug"] = "test" + i.toString();
    counter["groups"] = [];
    if (Math.random() < 0.5) {
        counter["groups"].push(groups[Math.floor(Math.random() * groups.length)]);
        if (Math.random() < 0.1) {
            counter["groups"].push(groups[Math.floor(Math.random() * groups.length)]);
        }
    }
    counters.push(counter);
}


var lookup;
var trie;

function createLookup(toIndex) {
	var lookup = {};
	for (var i = 0; i < toIndex.length; i++) {
		lookup[toIndex[i].slug] = toIndex[i];
	}
	return lookup;
}

function indexGroups(toIndex) {
    var groups = {};
    for (var i = 0; i < toIndex.length; i++) {
        for (var j = 0; j < toIndex[i]["groups"].length; j++) {
            if (groups[toIndex[i]["groups"][j]] == null) {
                groups[toIndex[i]["groups"][j]] = [];
            }
            groups[toIndex[i]["groups"][j]].push(toIndex[i]);
        }
    }
    return groups;
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
        // Groups list
        var groupsList = document.createElement("td");
        for (var j = 0; j < toLoad[i].groups.length; j++) {
            groupsList.innerHTML += toLoad[i].groups[j] + ", ";
        }
        groupsList.innerHTML = groupsList.innerHTML.substring(0, groupsList.innerHTML.length - 2);
        counterRow.appendChild(groupsList);
		counterTable.appendChild(counterRow);
	}
}

window.onload = function () {
	lookup = createLookup(counters);
	trie = createTrie(counters);
    groups = indexGroups(counters);
	loadCounters(counters);
}
