let currentUser = "";


// 登録
async function register(){

    await fetch("/api/register",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:
            regUser.value,

            password:
            regPass.value

        })

    });


    alert("登録しました");

}



// ログイン
async function login(){

    const res =
    await fetch("/api/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:
            loginUser.value,

            password:
            loginPass.value

        })

    });


    const data =
    await res.json();


    if(data.success){

        currentUser=data.username;

        alert(
            "ログイン成功"
        );

    }else{

        alert(
            "失敗"
        );

    }

}



// 投稿
async function post(){

    await fetch("/api/posts",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:currentUser,

            content:
            postText.value

        })

    });


    loadPosts();

}



// 投稿読み込み
async function loadPosts(){

    const res =
    await fetch("/api/posts");


    const posts =
    await res.json();


    timeline.innerHTML="";


    posts.forEach(p=>{

        timeline.innerHTML += `

        <div class="post">

        <b>${p.username}</b>

        <p>${p.content}</p>

        <small>
        ${p.created_at}
        </small>

        </div>

        `;

    });

}


loadPosts();
