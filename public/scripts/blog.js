
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

if (document.querySelector(".btn.delete")){
    var deleteBtn = document.querySelectorAll(".btn.delete");
    for (var i = 0; i < deleteBtn.length; i++){
        deleteBtn[i].addEventListener("mouseenter", function(){
            this.innerHTML = "<i class='fas fa-trash'></i>";
        });
        deleteBtn[i].addEventListener("mouseleave", function(){
            this.innerHTML = "Delete";
        });
    }
}
