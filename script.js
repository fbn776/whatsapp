//Loacal storage:
function hasStoredItem(name) {
	return localStorage.getItem(name) !== null
}

function getStoredItem(name) {
	return localStorage.getItem(name);
}

function storeItem(name, value) {
	localStorage.setItem(name, value);
}

function removeStoredItem(name) {
	localStorage.removeItem(name);
}

function s(x) {
	return document.querySelector(x)
};

function css(x, y) {
	return window.getComputedStyle(x).getPropertyValue(y);
};
//Strings functions
function small(x) {
	return x.toLowerCase()
};

function big(x) {
	return x.toUpperCase()
};

function jsonS(x) {
	return JSON.stringify(x);
};

function jsonP(x) {
	return JSON.parse(x);
};

//Objects and array functions
Object.prototype.getKeys = function() {
	return Object.getOwnPropertyNames(this);
};
Object.prototype.getValues = function() {
	let keys = this.getKeys();
	let arr = [];
	for (let n of keys) { arr.push(this[n]) };
	return arr;
};
Array.prototype.max = function() {
	return Math.max.apply(null, this);
};
Array.prototype.min = function() {
	return Math.min.apply(null, this);
};
Array.prototype.randomItem = function() {
	return this[Math.floor(Math.random() * this.length)];
};
Object.prototype.randomItem = function() {
	let keys = this.getValues();
	return keys.randomItem();
};
Object.prototype.hasProp = function(key) {
	return this ? Object.prototype.hasOwnProperty.call(this, key) : false;
}




function showAlert(o, c) {
	this.o = o;
	var elm = document.createElement("div");
	elm.setAttribute("class", "alertBox");
	elm.innerHTML = this.o;
	document.body.appendChild(elm);
	var posW = elm.getBoundingClientRect();
	var width = posW.width;
	elm.style.left = "calc(50% - " + width / 2 + "px)";
	elm.style.visibility = "visible";
	elm.style.transform = "translateY(0px)";
	elm.style.opacity = 1;
	setTimeout(function() {
		elm.style.transform = "translateY(40px)";
		elm.style.opacity = 0;
		setTimeout(function() {
			elm.style.visibility = "hiddden";
			elm.remove();
		}, 200);
	}, 2000);
}

function isActive(elm) {
	return elm.checked;
}



var header_height = parseInt(css(s(".header"), "height"));

s(".rest").style.top = `${header_height}px`;
s(".rest").style.height = `calc(100% - ${header_height}px)`;

function clearInput(t) {
	setTimeout(() => {
		var input = t.previousElementSibling;
		input.value = "";
	}, 100);
};

//Settings
var random_check = s("#random_check");
var rand = {
	len: s("#rand_length"),
	AZ: s("#alpha_cap"),
	az: s("#alpha_small"),
	num: s("#num"),
	spec: s("#spec"),
};
var number_elm = s("#number");
var message_elm = s("#message");
var repeat = s("#repeat");
var space_btw = s("#space_btw");

random_check.oninput = function() {
	let vals = rand.getValues();
	if (this.checked) {
		for (let val of vals) {
			val.disabled = false;
		}
		message_elm.disabled = true;
	} else {
		for (let val of vals) {
			val.disabled = true;
		}
		message_elm.disabled = false;
	}
};

var chars = {
	AZ: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
}
chars.az = [];
for (i of chars.AZ) {
	chars.az.push(small(i));
};
chars.num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
chars.spec = [",", "'", '"', ".", ":", ";", "!", "?", "(", ")", "/", "_", "&", "#", "@", "+", "-", "{", "}", "<", ">"];
/*
AZ
az
num
spec
*/
function sendMessage() {
	var number = number_elm.value;

	if (number != "") {
		let message = "";
		let country_code = 91;
		if (number.length > 10) {
			country_code = "";
		}

		if (random_check.checked) {
			let sub_arr = [];
			for (y of rand.getKeys()) {
				let vals = rand[y];
				if (isActive(vals)) {
					sub_arr = sub_arr.concat(chars[y]);
				};
			};
			if (sub_arr.length != 0) {
				let len = parseInt(rand.len.value);
				if (len > 0) {
					var mid = "";
					if (space_btw.checked) { mid = " " };


					for (let i = 0; i < len; i++) {
						let n = Math.floor(Math.random() * sub_arr.length);
						message += sub_arr[n] + mid;
					}
				} else {
					showAlert("Length cannot be less than 1");
					return false;
				}

			} else {
				showAlert("No keys specified");
				return false;
			}
		} else {
			if (message_elm.value != "") {
				message = message_elm.value;
			} else {
				showAlert("Message is empty");
				return false;
			}
		}
		if (message) {
			let final_msg = "";
			if (isActive(repeat)) {
				let mid = "";
				if (isActive(space_btw)) { mid = " " };
				for (let i = 0; i < 65000 / message.length; i++) {
					final_msg += message + mid;
				}
			} else {
				final_msg = message;
			}
			final_msg = encodeURI(final_msg);
			let url = "https://wa.me/" + country_code + parseInt(number) + "?text=" + final_msg;
			window.open(url);
		} else {
			showAlert("Error");
			return false;
		}
	} else {
		showAlert("Number is empty");
	}
}

var help_win = s(".add_help");
var padd_label = s(".padd_label_top");

function winOp(win, stuff) {
	if (win) {
		if (stuff == "open") {
			win.style.visibility = "visible";
			win.style.opacity = 1;
			win.style.transform = 'translateY(0px) scale(1)';
		} else if (stuff == "close") {
			win.style.opacity = 0;
			win.style.transform = 'translateY(200px) scale(0.5)';
			setTimeout(() => {
				win.style.visibility = "hidden";
			}, 300);
		}
	}
}
rand.len.addEventListener('input', function() {
	if (parseInt(this.value) > 6500) {
		this.value = 6500;
	}
});

function createCheckBox(title, id, elm, crs, dis) {
	var div = document.createElement("div");
	div.setAttribute("class", "label flex_s");
	div.style.transition = "transform 0.2s 0s";
	div.style.transform = "translateX(50px) scale(0.5)";
	var c = document.createElement("c");
	c.innerHTML = title + ":";
	div.appendChild(c);
	var input = document.createElement("input");
	input.setAttribute('type', 'checkbox');
	input.setAttribute('id', id);
	div.appendChild(input);
	input.disabled = dis;

	rand[id] = input;
	chars[id] = crs;

	setTimeout(() => {
		div.style.transform = "translateX(0px) scale(1)";
	}, 10);
	elm.appendChild(div);
}

var add_new_inputs = {
	name: s(".new_list_name"),
	list: s(".new_list_list"),
};

function clearAddInputs() {
	add_new_inputs.name.value = "";
	add_new_inputs.list.value = "";
};

function openAddMenu() {
	winOp(s(".add_new_opt"), "open");
}

function openAddHelp() {
	winOp(s(".add_help"), "open");
}

function cancelAdd() {
	winOp(s(".add_new_opt"), "close");
	clearAddInputs();
}


for (let i of rand_check_data.getKeys()) {
	let val = rand_check_data[i];
	let dis = !random_check.checked;
	if (val) {
		createCheckBox(val.name, val.id, padd_label, val.arr, dis);
	}
}

function createAdd() {
	var input_list;
	var val = add_new_inputs.list.value;
	if (add_new_inputs.name.value) {
		if (val) {
			let arr = val.split(',');
			let name = add_new_inputs.name.value;
			let dis = !random_check.checked;
			let id = name + "_id";

			for (let a of rand.getKeys()) {
				if (name === a) {
					showAlert("Duplicate name found");
					return false;
				};
			};
			for (let a of chars.getValues()) {
				if (arr === a) {
					showAlert("Duplicate list found");
					return false;
				};
			};
			rand_check_data[name] = {
				name: name,
				id: id,
				arr: arr,
			};
			localStorage.setItem("rand_check_data", jsonS(rand_check_data));
			clearAddInputs();
			winOp(s(".add_new_opt"), "close");
			createCheckBox(name, id, padd_label, arr, dis);
		} else {
			showAlert("List is empty");
			return false;
		}
	} else {
		showAlert("Name is empty");
		return false;
	}
}