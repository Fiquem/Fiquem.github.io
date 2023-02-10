// ABOUT
function about_me() {
	let main = document.querySelector('main')
	main.textContent = "Hi :) Welcome to my page :)"
}

// GRAPHICS
function grfx() {
	let main = document.querySelector('main')
	main.innerHTML = `
	<a href="/grfx/FYP/">FYP IMPLEMENTATION</a> | <a href="/grfx/FYP/report.pdf">FYP REPORT</a><br>
    <a href="/grfx/outline/">COOL SHADER + TOUCH AND GAMEPAD CONTROLS (FF + CHROME)</a><br>
    <a href="/grfx/RTR/">DYNAMIC REFLECTIONS</a><br>
    `
}

// PUBLICATIONS
function pubs() {
	let main = document.querySelector('main')
	main.innerHTML = `
    <a href="MIG2016crowds.pdf">MIG 2016 CROWDS</a><br>
    <a href="MIG2016blendshapes.pdf">MIG 2016 BLENDSHAPES</a><br>
    <a href="EG2018blendshapes.pdf">EG 2018 BLENDSHAPES</a><br>
    <a href="ICMI2018facevoice.pdf">ICMI 2018 FACE/VOICE</a><br>
    `
}

// CONTACT
function contact() {
	let main = document.querySelector('main')
	main.innerHTML = `
    Twitter: <a href="http://www.twitter.com/emmacarrigan">@emmacarrigan</a><br>
    `
}