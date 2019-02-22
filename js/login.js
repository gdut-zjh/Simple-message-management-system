$(document).ready(function(){
    
    // 点击验证码重新获取
    function getPicCode(){
        $("#picCode").attr("src", host + "getPicCode?"+new Date().getTime());
    }
    $("#picCode").attr("src", host + "getPicCode");
    $("#picCode").click(getPicCode);

    // 点击登录
    $("#loginBtn").click(function(){
        var account = $("#accountInp").val();
        var password = $("#passwordInp").val();
        var picCode = $("#picCodeInp").val();
        
        if(account == ""){
            layer.msg("请输入账号",{offset: '300px'});
            $("#accountInp").focus();
        }else if(password == ""){
            layer.msg("请输入密码",{offset: '300px'});
            $("#passwordInp").focus();
        }else if(picCode == ""){
            layer.msg("请输入验证码",{offset: '300px'});
            $("#picCodeInp").focus();
        }else{
            $.ajax({
                type: "POST",
                url: host + "checkLogin",
                data:{
                    "account" : account, 
                    "password": password, 
                    "vcode" : picCode
                },
                xhrFields : {
                    withCredentials : true
                },
                success: function(data){ 
                    console.log(data);
                    if(!data.status){
                        layer.msg(data.message,{offset: '300px'});
                        getPicCode();
                    }else{
                        sessionStorage.setItem("id", data.data["id"]);
                        window.location.href = "main.html";
                    }
                },
                error: function(err){
                    console.log(1);
                }
            });
        } 
    });
    
});