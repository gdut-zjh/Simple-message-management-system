$(document).ready(function(){
    
    //- 点击新增信息按钮淡入 -----------------------------------------------------------------------------------------------------
    $("#addSysBtn").click(function(){
        // 设置“新增信息弹出框”阴影的高度
        $("#addSysBlock").height($(document).height());
        $("#addSysBlock").fadeIn(200);
    });
    // 点击取消淡出
    $("#addSysCancelBtn").click(function(){
        $("#addflag").val("");
        $("#addtitle").val("");
        $("#addcontent").val("");
        $("#addSysBlock").fadeOut(200);
    });
    // 点击确定
    $("#addSysComfirmBtn").click(function(){
        var addflag = $("#addflag").val();
        var addtitle = $("#addtitle").val();
        var addcontent = $("#addcontent").val();
        if(addflag == ""){
            layer.msg("请输入标签",{offset: '300px'});
            $("#flag").focus();
        }else if(addtitle == ""){
            layer.msg("请输入标题",{offset: '300px'});
            $("#title").focus();
        }else if(addcontent == ""){
            layer.msg("请输入内容",{offset: '300px'});
            $("#addcontent").focus();
        }else{
            $.ajax({
                type: "POST",
                url: host + "addSys",
                data: {
                    "flag" : addflag,
                    "title" : addtitle,
                    "content" : addcontent
                },
                success: function(data){
                    layer.msg("添加成功",{offset: '300px'});
                    $("#addSysBlock").fadeOut(200);
                    listSys();
                    $("#addflag").val("");
                    $("#addtitle").val("");
                    $("#addcontent").val("");
                },
                error: function(err){
                    console.log("失败");
                }
            });
        }   
    });
    
    //- 获取主页信息的函数----------------------------------------------------------------------------------------------------------
    function listSys(keywords){
        // 刷新主页，sessionStorage有记录，即已登录时则显示信息列表，否则跳转到登录页
        if(sessionStorage.getItem("id") == null){ 
            window.location.href = "login.html";  
        }else{
            $.ajax({
                type: "POST",
                url: host + "listSys",
                data: {
                    "keywords" : keywords
                },
                success: function(data){ 
                    console.log(data);
                    var allNode = '';
                    for(var i = 0; i < data.data.length; i++){
                        allNode += '<tr id=' + data.data[i]["id"] + '>'+ 
                                        '<td>' + data.data[i]["flag"] + '</td>' + 
                                        '<td>' + data.data[i]["title"] + '</td>' +
                                        '<td>' + data.data[i]["content"] + '</td>' + 
                                        '<td>\
                                        <input type="button" value="修改" class="btn editBtn" id="editInfo">\n' + 
                                        '<input type="button" value="删除" class="btn delBtn" id="delInfo">'
                                        '</td>' +
                                    '</tr>'          
                    }
                    $("#tableBody").html(allNode);
                },
                error: function(err){
                    console.log("失败");
                }
            });
        }
    }
    // 登录完后进入页面先刷新一次
    listSys();

    //- 删除信息的端口-------------------------------------------------------------------------------------------------------------
    function del(id){
        $.ajax({
            url: host + "delSys",
            data: {
                "id" : id
            },
            success: function(data){
                layer.msg("删除成功",{offset: '300px'});
                listSys();
            },
            error: function(err){
                console.log("错误");
            }
        });
    }  
    // 为每个删除按钮添加点击事件（delegate）
    $("body").delegate("#delInfo", "click", function(){
        var infoid = $(this).parents("tr").attr("id");
        del(infoid);
        listSys();
    });

    //- 修改信息的端口---------------------------------------------------------------------------------------------------------
    var getid; // 保存点击修改按钮后得到的id，用于修改信息接口传参
    // 为每个修改按钮添加点击事件(点击弹出修改页面框)
    $("body").delegate("#editInfo", "click", function(){
        var infoid = $(this).parents("tr").attr("id");
        $("#editSysBlock").height($(document).height());
        $("#editSysBlock").fadeIn(200);
        // 获取该id对应的信息，并修改到输入框
        $.ajax({
            type: "POST",
            url: host + "getSys",
            data: {
                "id" : infoid
            },
            success: function(data){
                $("#editflag").val(data.data["flag"]);
                $("#edittitle").val(data.data["title"]);
                $("#editcontent").val(data.data["content"]);
                getid = infoid;
            },
        }); 
    });  
    // 修改信息页面的确定按钮
    $("#editSysComfirmBtn").click(function(){
        var editflag = $("#editflag").val();
        var edittitle = $("#edittitle").val();
        var editcontent = $("#editcontent").val();
        $.ajax({
            type: "POST",
            url: host + "editSys",
            data: {
                "id" : getid,
                "flag" : editflag,
                "title" : edittitle,
                "content" : editcontent
            },
            success: function(data){
                layer.msg(data.message);
                listSys();
                $("#editSysBlock").fadeOut(200);
            },
        });
    });
    // 点击修改信息页面的取消之后淡出
    $("#editSysCancelBtn").click(function(){
        $("#editSysBlock").val("");
        $("#editSysBlock").val("");
        $("#editSysBlock").val("");
        $("#editSysBlock").fadeOut(200);
    });

    //- 搜索信息---------------------------------------------------------------------------------------------------------
    $("#searchBtn").click(function(){
        var searchInp = $("#searchInp").val();
        listSys(searchInp);
        if(searchInp != ""){
            layer.msg("搜索成功");
        }
    });
    
});



