
if (document.querySelector(".login")){
    document.querySelector(".login").addEventListener("mouseover", function(){
        document.querySelector(".open").classList.toggle("fa-door-closed");
        document.querySelector(".open").classList.toggle("fa-door-open");
    });

    document.querySelector(".login").addEventListener("mouseout", function(){
        document.querySelector(".open").classList.toggle("fa-door-closed");
        document.querySelector(".open").classList.toggle("fa-door-open");
    });
}

