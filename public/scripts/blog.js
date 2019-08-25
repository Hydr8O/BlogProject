
if (document.querySelector(".login")){
    var door = document.querySelector(".open");
    document.querySelector(".login").addEventListener("mouseover", function(){
        door.classList.toggle("fa-door-closed");
        door.classList.toggle("fa-door-open");
    });

    document.querySelector(".login").addEventListener("mouseout", function(){
        door.classList.toggle("fa-door-closed");
        door.classList.toggle("fa-door-open");
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

if (document.querySelector(".arrow-down")){
    var arrowDown = document.querySelector(".arrow-down");
    document.querySelector(".navbar-toggler").addEventListener("click", function(){
        arrowDown.classList.toggle("fa-sort-down");
        arrowDown.classList.toggle("fa-sort-up");
    });
    
    // arrowDown.addEventListener("mouseleave", function(){
    //     arrowDown.classList.toggle("fa-sort-down");
    //     arrowDown.classList.toggle("fa-sort-up");
    // });
}
