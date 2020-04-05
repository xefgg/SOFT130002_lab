function refresh(){
    alert("alredy refreshed!");
}

function backToTop(){
    var currentScroll =  document.body.scrollTop || document.documentElement.scrollTop;
    if(currentScroll > 0 ){
        window.requestAnimationFrame(backToTop);
        window.scrollTo(0,currentScroll - (currentScroll/5));
    }
}