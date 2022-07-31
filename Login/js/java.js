document.getElementById('click').addEventListener("click", function(){
	alert("You are HACKED!!! 😈");
});

document.getElementById('forgot').addEventListener("click", function(){
    prompt("Enter new password");
    alert("Your password is changed. Now login here.");
});

document.getElementById('account').addEventListener("click", function(){
	prompt("Create Username");
	prompt("Create Password");
	alert("Your account is created. Now login here.");
});