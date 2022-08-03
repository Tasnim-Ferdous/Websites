var kg = document.getElementById('kg');
var pound = document.getElementById('lb');

kg.addEventListener("input", function () {
	let k = this.value;
	let p = k*2.20;
	if (!Number.isInteger(p)) {
		p = p.toFixed(2);
	};
	pound.value = p;
});

pound.addEventListener("input", function () {
	let p = this.value;
	let k = p/2.20;
	if (!Number.isInteger(k)) {
		k = k.toFixed(2);
	};
	kg.value = k;
});

var meter = document.getElementById('meter');
var feet = document.getElementById('ft');

meter.addEventListener("input", function () {
	let m = this.value;
	let f = m*3.28;
	if (!Number.isInteger(f)) {
		f = f.toFixed(2);
	};
	feet.value = f;
});

feet.addEventListener("input", function () {
	let f = this.value;
	let m = f/3.28;
	if (!Number.isInteger(m)) {
		m = m.toFixed(2);
	};
	meter.value = m;
});

var joule = document.getElementById('joule');
var cal = document.getElementById('cal');

joule.addEventListener("input", function () {
	let j = this.value;
	let c = j*0.23;
	if (!Number.isInteger(c)) {
		c = c.toFixed(2);
	};
	cal.value = c;
});

cal.addEventListener("input", function () {
	let c = this.value;
	let j = c/0.23;
	if (!Number.isInteger(j)) {
		j = j.toFixed(2);
	};
	joule.value = j;
});

var kpl = document.getElementById('kpl');
var mpg = document.getElementById('mpg');

kpl.addEventListener("input", function () {
	let kl = this.value;
	let mg = kl*2.35;
	if (!Number.isInteger(mg)) {
		mg = mg.toFixed(2);
	};
	mpg.value = mg;
});

mpg.addEventListener("input", function () {
	let mg = this.value;
	let kl = mg/2.35;
	if (!Number.isInteger(kl)) {
		kl = kl.toFixed(2);
	};
	kpl.value = kl;
});

var deg = document.getElementById('deg');
var rad = document.getElementById('rad');

deg.addEventListener("input", function () {
	let d = this.value;
	let r = d*(3.1416/180);
	if (!Number.isInteger(r)) {
		r = r.toFixed(3);
	};
	rad.value = r;
});

rad.addEventListener("input", function () {
	let r = this.value;
	let d = r*(180/3.1416);
	if (!Number.isInteger(d)) {
		d = d.toFixed(3);
	};
	deg.value = d;
});

var atm = document.getElementById('atm');
var pas = document.getElementById('pas');

atm.addEventListener("input", function () {
	let a = this.value;
	let p = a*101325;
	if (!Number.isInteger(p)) {
		p = p.toFixed(3);
	};
	pas.value = p;
});

pas.addEventListener("input", function () {
	let p = this.value;
	let a = p/101325;
	if (!Number.isInteger(a)) {
		a = a.toFixed(3);
	};
	atm.value = a;
});

var kph = document.getElementById('kph');
var mph = document.getElementById('mph');

kph.addEventListener("input", function () {
	let kh = this.value;
	let mh = kh/1.609;
	if (!Number.isInteger(mh)) {
		mh = mh.toFixed(2);
	};
	mph.value = mh;
});

mph.addEventListener("input", function () {
	let mh = this.value;
	let kh = mh*1.609;
	if (!Number.isInteger(kh)) {
		kh = kh.toFixed(2);
	};
	kph.value = kh;
});

var cel = document.getElementById('cel');
var far = document.getElementById('far');

cel.addEventListener("input", function () {
	let ce = this.value;
	let fa = (ce*9/5)+32;
	if (!Number.isInteger(fa)) {
		fa = fa.toFixed(1);
	};
	far.value = fa;
});

far.addEventListener("input", function () {
	let fa = this.value;
	let ce = (fa-32)*5/9;
	if (!Number.isInteger(ce)) {
		ce = ce.toFixed(1);
	};
	cel.value = ce;
});

var ltr = document.getElementById('ltr');
var gal = document.getElementById('gal');

ltr.addEventListener("input", function () {
	let l = this.value;
	let g = l/3.785;
	if (!Number.isInteger(g)) {
		g = g.toFixed(2);
	};
	gal.value = g;
});

gal.addEventListener("input", function () {
	let g = this.value;
	let l = g*3.785;
	if (!Number.isInteger(l)) {
		l = l.toFixed(2);
	};
	ltr.value = l;
});

window.addEventListener("scroll", function() {
	var height = window.innerHeight;
	var arrow = document.getElementById('arrow');
	if(window.pageYOffset > 200) {
		arrow.style.display="block";
	} else {
		arrow.style.display="none";
	};
});