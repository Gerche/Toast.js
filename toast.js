var toasts = []; // Holds all toast that need to be displayed (since we can only display one at a time).

// When the DOM is loaded insert our toastContainer at the end
window.addEventListener("DOMContentLoaded", function() {
	document.body.innerHTML+='<div id="toastContainer"></div>';
}, false);

/**
 * Creates a toast, when a toast is already being displayed the new one will wait for all previous toasts to finish.
 * @param {[String]}	text         [The message to be displayed to the user.]
 * @param {[int]}	time         [The amount of time that the message should be displayed in ms. Note: the value 0 will be handled as if it was omitted.]
 * @param {[function]}	undoCallback [A callback function that should be executed when the user clicks the undo button.]
 */
function Toast (text, time, undoCallback) {
	var toast = {}; // The toast object.
	toast.time = time || 4000; // If no time was passed set it to 4 seconds.

	// Create the toast element (html)
	toast.content = document.createElement("div");
	var toastText = document.createTextNode(text);
	toast.content.innerHTML = "<span>" + text + "</span>";
	toast.content.className = "toast";

	// Add an undo button and onclick handler if a callback was provided.
	if (undoCallback) {
		var undoButton = document.createElement("button");
		var buttonText = document.createTextNode("UNDO");
		undoButton.appendChild(buttonText);
		undoButton.className = "undo";
		undoButton.onclick = undoCallback;
		toast.content.appendChild(undoButton);
	}

	// Add the new toast to our toasts array
	toasts.push(toast);

	// If this is the only toast inside the array insert it.
	if (toasts.length === 1) {
		insertToast(toasts[0]);
	}

	// Insert the toast in HTML.
	// Attach eventlisteners on the toast to interupt the timer when the user hovers over the toast.
	// When the timer reaches 0 hide the toast.
	// 1000ms after the timer reached 0 the toast will be removed from the DOM and the toasts array.
	// If there are other toasts in toasts array show the next one.
	function insertToast(toast){
		document.getElementById("toastContainer").appendChild(toast.content);

		// Create new timer
		var timer = new Timer(function() {
			toast.content.style.animationName = "hideToast";

			setTimeout(function(){
				toast.content.outerHTML = null;
				toasts.shift();
				if (toasts.length >= 1) {
					insertToast(toasts[0]);
				}
			}, 1000);
		}, toasts[0].time);

		toast.content.addEventListener("mouseenter",function(){
			timer.pause();
		});
		toast.content.addEventListener("mouseleave",function(){
			timer.resume();
		});
	}
}

// A timer function that supports pause() and resume().
function Timer(callback, delay) {
	var timerId, start, remaining = delay;

	// Pause the timer
	this.pause = function() {
		window.clearTimeout(timerId);
		remaining -= new Date() - start;
	};

	// Resume the timer
	this.resume = function() {
		start = new Date();
		window.clearTimeout(timerId);
		timerId = window.setTimeout(callback, remaining);
	};

	this.resume();
}
