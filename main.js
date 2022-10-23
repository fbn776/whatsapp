/*****UTILS*****/
Object.prototype.getKeys = function() {
	return Object.getOwnPropertyNames(this);
};

HTMLElement.prototype.setAttr = function(obj) {
	if (obj) {
		let keys = obj.getKeys();
		for (let i of keys) {
			this.setAttribute(i, obj[i]);
		}
	}
};
/**
 * Creates elements with type and assigns the attributes given by attr and appends the childs
 * @param {String} type The type of elements
 * @param {Object} attr The attributes of the elements
 * @param {Array} childs The childs to append
 */
function createElm(type, attr, childs) {
	if (type) {
		let elm = document.createElement(type);
		if (attr) {
			if (attr.text) {
				elm.innerHTML = attr.text;
			}
			elm.setAttr(attr);
			if (childs) {
				for (let child of childs) {
					elm.appendChild(child);
				}
			}
		}
		return elm;
	}
	throw new Error("Undefined type")
}

function round(value, precision) {
	let multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
};


function getTimeElapsed(time) {
	let diff = Date.now() - time;
	let secs = diff / 1000;
	let mins = secs / 60;
	let hrs = mins / 60;
	let days = hrs / 24;
	let weeks = days / 7;
	let months = weeks / 4;
	let years = months / 12;

	return {
		seconds: secs,
		minutes: mins,
		hours: hrs,
		days: days,
		weeks: weeks,
		months: months,
		years: years,
	}
};

function timedStr(time) {
	let elsped = getTimeElapsed(time);
	let result = elsped.seconds;
	let unit = "seconds";

	if (elsped.minutes >= 1) {
		result = elsped.minutes;
		unit = "minutes"
	}
	if (elsped.hours >= 1) {
		result = elsped.hours;
		unit = "hours"
	}
	if (elsped.days >= 1) {
		result = elsped.days;
		unit = "days"
	}
	if (elsped.weeks >= 1) {
		result = elsped.weeks;
		unit = "weeks"
	}
	if (elsped.months >= 1) {
		result = elsped.months;
		unit = "months"
	}
	if (elsped.years >= 1) {
		result = elsped.years;
		unit = "yrs"
	}
	return round(result, 1) + " " + unit;
}

/****Main code starts here***/

const HISTORY_KEY = "history-records";

function historyEmptySetter() {
	if (history.length > 0) {
		history_cont.setAttribute("empty", "false")
	} else {
		history_cont.setAttribute("empty", "true")
	}
}

function createEntry(num, txt, time) {
	let main = createElm("div", { class: "entry-cont" });
	let top = createElm("div", { class: "top" });

	let num_cont = createElm("div", { class: "value" });
	let text_cont = createElm("div", { class: "value" });
	num_cont.innerHTML = `Number: <b class="number-val">${num}</b>`;
	text_cont.innerHTML = `Text: <b class="text-val">${txt || "--"}</b>`;

	top.appendChild(num_cont);
	top.appendChild(text_cont);
	main.appendChild(top);

	let timed = timedStr(time);

	let bottom = createElm("div", { class: "bottom" });
	let time_elm = createElm("div", { class: "time", text: timed + " ago" });
	let right = createElm("div", { class: "right" });
	let use_btn = createElm("div", { text: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><use href="#play_btn"></use></svg>` })
	let del_btn = createElm("div", { text: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><use href="#trash_btn"></use></svg>` })
	right.appendChild(use_btn)
	right.appendChild(del_btn)
	bottom.appendChild(time_elm)
	bottom.appendChild(right)
	main.appendChild(bottom);
	/***Animate the entry***/
	setTimeout(() => {
		main.style.transform = "scale(1)";
		main.style.opacity = 1;
	}, 0);

	del_btn.onclick = function() {
		let confo = confirm("Are you sure you want to delete this?");
		if (confo) {
			for (let i = 0; i < history.length; i++) {
				if (time === history[i][2]) {
					history.splice(i, 1);
					/***Remove animation***/
					main.style.height = "0px";
					main.style.opacity = 0;
					/***Element removal***/
					setTimeout(() => {
						main.remove();
					}, 200);
					/***Update the storage and display empty if is-empty**/
					localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
					historyEmptySetter();
					break;
				}
			}
		}
	};
	use_btn.onclick = function() {
		let confo = confirm("Do you want to use this?");
		if (confo) {
			number_input.value = num;
			text_input.value = txt;
		}
	};
	return main;
}

function storeHistory(num, txt, time) {
	history = history.concat([[num, txt, time]]);
	localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/***Variable that stores the history.
	At declaration it checks if it already exists
	if it does then it takes that value
	
	format -> [[num, text, date],...]
**/
let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');

/***On load, this creates the history elements if it exists***/
if (history.length > 0) {
	history_cont.setAttribute("empty", "false")
	for (let entry of history) {
		let elm = createEntry(...entry);
		history_cont.prepend(elm)
	}
}

function refreshHistory() {
	if (history.length > 0) {
		history_cont.setAttribute("empty", "false");
		history_cont.innerHTML = "";
		for (let entry of history) {
			let elm = createEntry(...entry);
			history_cont.prepend(elm);
		}
	}
}

function clearHistory() {
	let confo = confirm("Do you want to clear history?");
	if (confo) {
		history = [];
		localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
		for (let a of history_cont.children) {
			a.remove();
		}
		history_cont.innerHTML = "";
		history_cont.setAttribute("empty", "true")

	}
}

function sendMessage() {
	let num = ogNum = number_input.value;
	let text = ogText = text_input.value;
	let ctry_code = "91";

	/**Num input correctness checker**/
	if (num.length < 10 || num.length > 12) {
		alert("The given number is invalid");
		return false;
	}
	if (num.length === 12) {
		ctry_code = num.substring(0, 2);
		num = num.substring(2)
	}

	text = encodeURI(text);
	let lastEntry = [ogNum, ogText, Date.now()];
	storeHistory(...lastEntry);
	history_cont.prepend(createEntry(...lastEntry));

	historyEmptySetter();

	let url = "https://wa.me/" + ctry_code + parseInt(num) + "?text=" + text;
	window.open(url);
	number_input.value = "";
	text_input.value = "";
}