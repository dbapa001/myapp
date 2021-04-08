//calculate the total

var total = document.querySelector(".calculate");
total.addEventListener("click", ()=> {
                //C C F P S S
    var totals = [0,0,0,0,0,0]//initializing sums to 0 in array

    document.querySelectorAll(".checkbox").forEach(t=>{
        var row = t.parentNode.parentElement;
        var amount = row.querySelector(".amount").value;
        var calories = parseFloat(row.querySelector(".calories").innerHTML)*amount;
        var carbs = parseFloat(row.querySelector(".carbs").innerHTML)*amount;
        var fat = parseFloat(row.querySelector(".fat").innerHTML)*amount;
        var protein = parseFloat(row.querySelector(".protein").innerHTML)*amount;
        var salt = parseFloat(row.querySelector(".salt").innerHTML)*amount;
        var sugar = parseFloat(row.querySelector(".sugar").innerHTML)*amount;


        if(t.checked){
            totals[0]+=calories
            totals[1]+=carbs
            totals[2]+=fat
            totals[3]+=protein
            totals[4]+=salt
            totals[5]+=sugar
        }        

    })

    var totalCalories = document.querySelector(".totalCalories");
    var totalCarbs = document.querySelector(".totalCarbs");
    var totalFat = document.querySelector(".totalFat");
    var totalProtein = document.querySelector(".totalProtein");
    var totalSalt = document.querySelector(".totalSalt");
    var totalSugar = document.querySelector(".totalSugar");


    totalCalories.innerHTML =totals[0] 
    totalCarbs.innerHTML= totals[1]
    totalFat.innerHTML= totals[2]
    totalProtein.innerHTML = totals[3];
    totalSalt.innerHTML= totals[4]
    totalSugar.innerHTML= totals[5]


}
)