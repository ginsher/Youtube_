// 숙제는 해당 객체지향 유튜브 예제에서 createPop()함수를 등록하여 프로토타입에 연결
//유튜브팝업만드는 것 프로토 타입에 연결하여 기능 동작. (객체지향 변환)
// 서브페이지 레이아웃에 추가로 방금한 유튜브를 연결
// 윗줄은 안해도 괜찮으나 첫번째는 필수적으로 할 것.
//지금까지 만든 서브페이지 레이아웃 압축하여 올릴 것.

//PL https://youtube.com/playlist?list=PLNXrlCj6SYKfN5h5JXxauAAvxm0LyP006
//Youtube AIzaSyA7eddsOCe0xWAQtHGn1_yN8pmmMYH53ok
//Kakao f50c6075b816de5dc656db0e02a87d52

//매개변수 = 파라미터(parameter). 를 통해 전달되는 값은 인수(argument).

function Youtube(){
    //데이터 호출 함수
    this.frame = $("#vidGallery");
    this.key = "AIzaSyA7eddsOCe0xWAQtHGn1_yN8pmmMYH53ok";
    this.playList = "PLNXrlCj6SYKfN5h5JXxauAAvxm0LyP006";
    this.count = 5;
    
    this.bindingEvent();
}

Youtube.prototype.bindingEvent = function(){
    this.callData();

    //클릭시 hidden
    $("body").on("click", "article a", function (e){
        e.preventDefault();
        //console.log(e.currentTarget);
        this. vidId = $(e.currentTarget).attr("href");

        this.createPop({
            width: "100%",
            height: "100vh",
            bg: "rgba(0,0,0,0.9)",
            vidId: this.vidId
        });

        $("body").css({ overflow: "hidden"})
    }.bind(this));
    //이벤트문 밖에서 인스턴스 this값을 연결된 함수 안쪽의 this값으로 지정

    //클릭시 auto
    $("body").on("click", ".pop .close", function(e){
        e.preventDefault(); 
        $(this).parent(".pop").remove(); 

        $("body").css({ overflow: "auto"})
    });
}

Youtube.prototype.callData = function(){
    $.ajax({
        url : "https://www.googleapis.com/youtube/v3/playlistItems",
        dataType : "jsonp", //보안 관련 = jsonp 구글, 페북같은 대형 어쩌구들...
        data : {
            part: "snippet",
            key: this.key,
            playlistId: this.playList,
            maxResults: this.count
        }
    })
    .success(function(data){
        var items = data.items;
        this.createList(items);
    }.bind(this))
    .error(function(err){
        console.error(err);
    })
}

//동적 리스트 생성함수
Youtube.prototype.createList = function(items){
    $(items).each(function(index, data){
        console.log(data);
        var tit = data.snippet.title;
        var txt = data.snippet.description;
        var date = data.snippet.publishedAt.split("T")[0];
        var imgSrc = data.snippet.thumbnails.high.url;
        var vidId = data.snippet.resourceId.videoId;
        if(txt.length>200) {
            txt = txt.substr(0,50)+"...";
        }

        this.frame
            .append(
                $("<article>")
                    .append(
                        $("<a class='pic'>")
                            .attr({href: vidId})
                            .css({backgroundImage: "url("+imgSrc+")"}),
                        $("<div class='con'>")
                            .append(
                                $("<h2>").text(tit),
                                $("<p>").text(txt),
                                $("<span>").text(date)
                            )
                    )
            )
    }.bind(this))
}

Youtube.prototype.createPop = function(opt){
    $("body")
        .append(
            $("<aside class='pop'>")
                .css({
                    width:opt.width,
                    height:opt.height,
                    backgroundColor:opt.bg,
                    position:"fixed",
                    top:"50%",
                    left:"50%",
                    transform:"translate(-50%,-50%)",
                    boxSizing:"border-box",
                    padding:50
                })
                .append(
                    $("<a href='#' class='close'>")
                        .text("close")
                        .css({
                            position:"absolute",
                            top:20, 
                            right:20, 
                            color:"#fff"
                        }),
                    $("<img src='img/loading.gif'>")
                        .css({
                            width:400,
                            position:"absolute",
                            top:"50%",
                            left:"50%",
                            transform:"translate(-50%,-50%)"
                        }),
                    $("<div class='con'>")
                        .css({
                            width:"100%",
                            height:"100%",
                            position:"relative",
                            display:"none"
                        })
                        .append(
                            $("<iframe>")
                                .attr({
                                    src: "https://www.youtube.com/embed/"+ opt.vidId,
                                    frameborder:0, 
                                    allowfullscreen:true,
                                    width:"100%",
                                    height:600
                                })
                        )
                )
        )

    setTimeout(function(){
        $(".pop .con").fadeIn(500, function(){
            $(this).prev().remove(); 
        })
    }.bind(this), 1000)
}

/*
.bind(this) : 생성자 함수에서 인스턴스 this값을 적용해야 될 때
= this값이 다른 값을 참조하는 경우 강제로 인스턴스 this로 값을 고정하기 위함.

1. 이벤트문에 연결
2. each문에 연결
3. setTimeout()에 연결
4. success()에 연결
*/