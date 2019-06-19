
$("#messagepanel").hide();
fillGroupLinks();
fillTotalPrice();
sessionStorage.setItem("group","");
sessionStorage.setItem("product","");

function fillTotalPrice() {
    jQuery.ajax({
        url: 'http://localhost:8889/api/price',
        method: 'POST',
        success: function (json) {
            $("#totalprice").empty();
            $("#totalprice").append("Total price: "+json);
        }
    });
}

function fillGroupLinks(){
    $("#grouplist").empty();
    $("#grouplist").append("<p class='title'>Witch Shop</p>\n" +
        "    <hr style='margin: 5px;'>\n" +
        "    <button onclick='addGroup()' class='btn btn-outline-secondary btn-sm'>+new</button><br>");
        jQuery.ajax({
        url: 'http://localhost:8889/api/allgroups',
        method: 'GET',
        success: function (json) {
            var array = JSON.parse(json);
            for(var i=0; i<array.length; i++){
                var ar = array[i].split("#");
                $("#grouplist").append("<a id='group"+(i)+"' onclick='clickOnGroup("+ar[1]+")' class='grouplinks btn btn-link btn-sm' href=#grouplist'>"+ar[0]+"</a><br>")

            }
        }
    });

}
function clickOnGroup(groupid) {
    sessionStorage.setItem("group",groupid);
    sessionStorage.setItem("product","");
    jQuery.ajax({
        url: "http://localhost:8889/api/group/"+groupid,
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
        },
        cache: 'no-cache',
        success: function (json) {
            json = json.replace(/'/g,'"');
            var obj = JSON.parse(json);
            $("#productlist").empty();
            $("#productlist").append("<p class='title'> "+ obj["groupname"]+"</p><hr style='margin: 5px;'><button onclick='addProduct("+groupid+")' class='btn btn-outline-secondary btn-sm'> +new</button><br>");
            $("#groupinfo").empty();
            $("#groupinfo").append("<button onclick='deleteGroup("+groupid+")' class='btn btn-outline-danger btn-sm delete ' >delete</button>" +
                "<p class='title'> "+ obj["groupname"]+"</p><hr style='margin: 5px;'>" +
                "<button onclick='editGroup("+groupid+","+json+")' class='btn btn-outline-secondary btn-sm edit'> &#9998;</button><br>" +
                "<p style='font-size: 12px;'>"+obj["description"]+"</p><p>Total group price: "+obj["totalprice"]+"</p><button class='btn btn-outline-info btn-sm'>all group info</button>");

            $.ajax({
                url: "http://localhost:8889/api/products/"+groupid,
                method: 'GET',
                success: function (json) {
                    var array = JSON.parse(json);
                    for(var i=0;i<array.length;i++){
                        var ar = array[i].split("#");
                        $("#productlist").append("<a href='#body' class='btn btn-link btn-sm' onclick='clickOnProduct("+ar[1]+")'>"+ar[0]+"</a><br>");
                    }
                }
            });
        }
    });

}

function deleteGroup(groupid) {
    if(!confirm("Do you really want to delete this group?"))
        return;
    $.ajax({
        url: "http://localhost:8889/api/group/"+groupid,
        method: 'DELETE',
        success: function () {
            $("#productlist").empty();
            $("#groupinfo").empty();
            $("#productinfo").empty();
            sessionStorage.setItem("group","");
            sessionStorage.setItem("product","");
            fillGroupLinks();
        }
    });
}

function clickOnProduct(productid) {
    sessionStorage.setItem("product",productid);
    jQuery.ajax({
        url: "http://localhost:8889/api/good/"+productid,
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
        },
        cache: 'no-cache',
        success: function (json) {
            json = json.replace(/'/g,'"');
            var obj = JSON.parse(json);
            $("#productinfo").empty();
            $("#productinfo").append("<button class='btn btn-outline-danger btn-sm delete ' style='left:19%;'>delete</button><p class='title'> "+ obj.prodname+"</p>" +
                "<hr style='margin: 5px;'><button class='btn btn-outline-secondary btn-sm edit' onclick='editProduct("+productid+","+json+")'>&#9998;</button>" +
                "<p style='font-size: 16px'>"+obj.description+"</p>" +
                "<a> Price:"+obj.price+"</a><br><a>Amount: "+obj.amount+"</a><br><a>Producer: "+obj.producer+"</a><br>" +
                "<input type='number' class='form-control form-control-sm' min='0'>" +
                "<button class='btn btn-outline-info btn-sm'>sell</button><button class='btn btn-outline-success btn-sm'>buy</button>");

        }
    });
   }
function editGroup(groupid, obj) {
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Group name:</span><br><input id='entry_groupname' type='text' value='"+obj.groupname+"' maxlength='20'>" +
        "<span>Description:</span><br><input id='entry_groupdesc' type='text' value='"+obj.description+"' style='margin-bottom: 10px;' class='form-control'>" +
        "<a onclick='editGroupInDB("+groupid+")' href='#content' class='btn btn-success entry_long'>Change</a>");

}
function editGroupInDB(groupid) {
    var name = $("#entry_groupname").val();
    var desc = $("#entry_groupdesc").val();
    if(desc=="" || name==""){
        alert("Uncorrect data!");
        return;
    }
    $("#backbutton").click();
    var url = 'http://localhost:8889/api/group?id='+groupid;
        url += '&groupname='+name;
        url += '&description='+desc;
    jQuery.ajax({
        url: url,
        method: 'POST',
        success: function (data) {
            fillGroupLinks();
            clickOnGroup(groupid);
            if(sessionStorage.getItem("product")!="")
                clickOnProduct(sessionStorage.getItem("product"));
        }
    });
}
function editProduct(prodid, obj) {
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Product name:</span><br><input id='entry_prodname' type='text' value='"+obj.prodname+"' maxlength='20'>" +
        "<span>Description:</span><br><input id='entry_proddesc' type='text' value='"+obj.description+"' style='margin-bottom: 10px;' class='form-control'>" +
        "<span>Price:</span><br><input id='entry_prodprice' type='number' value='"+obj.price+"' style='margin-bottom: 10px;' class='form-control'>" +
        "<span>Amount:</span><br><input id='entry_prodamount' type='number' value='"+obj.amount+"' style='margin-bottom: 10px;' class='form-control'>" +
        "<span>Producer:</span><br><input id='entry_producer' type='text' value='"+obj.producer+"' style='margin-bottom: 10px;' class='form-control'>" +
        "<a onclick='editProductInDB("+prodid+")' href='#content' class='btn btn-success entry_long'>Change</a>");
}

function editProductInDB(prodid) {
    var name = $("#entry_prodname").val();
    var desc = $("#entry_proddesc").val();
    var price = $("#entry_prodprice").val();
    var amount = $("#entry_prodamount").val();
    var producer = $("#entry_producer").val();
    if(price<0 || amount<0 || desc=="" || name=="" || producer==""){
        alert("Uncorrect data!");
        return;
    }
    $("#backbutton").click();
    var url = 'http://localhost:8889/api/good?id='+prodid;
    url += '&prodname='+name;
    url += '&description='+desc;
    url += '&price='+price;
    url += '&amount='+amount;
    url += '&producer='+producer;
    jQuery.ajax({
        url: url,
        method: 'POST',
        success: function (data) {
            fillGroupLinks();
            clickOnGroup(sessionStorage.getItem("group"));
            clickOnProduct(prodid);
        }
    });
}

function addGroup(){
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Groupn ame:</span><br><input id='entry_groupname' type='text' val='' maxlength='20'>" +
        "<span>Description:</span><br><input id='entry_groupdesc' type='text' val='' style='margin-bottom: 10px;' class='form-control'>\n" +
        "<a onclick='addGroupToDB()' href='#content' class='btn btn-success entry_long'>Add</a>");

}
function addProduct(groupid){
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Product name:</span><br><input id='entry_prodname' type='text' val='' maxlength='20'>" +
        "<span>Description:</span><br><input id='entry_proddesc' type='text' val='' style='margin-bottom: 10px;' class='form-control'>\n" +
        "<span>Price:</span><br><input id='entry_prodprice' type='number' min='1' val='' style='margin-bottom: 10px;' class='form-control'>"+
        "<span>Amount:</span><br><input id='entry_prodamount' type='number' min='1' val='' style='margin-bottom: 10px;' class='form-control'>"+
        "<span>Producer:</span><br><input id='entry_produser' type='text' val='' style='margin-bottom: 10px;' class='form-control'>"+
        "<a onclick='addProductToDB("+groupid+")' href='#content' class='btn btn-success entry_long'>Add</a>");
}

$("#backbutton").click(function () {
    $("#messagepanel").hide();
    $("#messagebox").empty();

});
function addGroupToDB() {
    var name = $("#entry_groupname").val();
    var desc = $("#entry_groupdesc").val();
    if(desc=="" || name==""){
        alert("Uncorrect data!");
        return;
    }
    $("#backbutton").click();
    $.ajax({
        url: "http://localhost:8889/api/good?description="+desc+"&groupname="+name,
        method: "PUT",
        success: function (json) {
            alert("New group added successfully");
            fillGroupLinks();
        }
    });
}

function addProductToDB(groupid) {
    var name = $("#entry_prodname").val();
    var desc = $("#entry_proddesc").val();
    var price = $("#entry_prodprice").val();
    var amount = $("#entry_prodamount").val();
    var producer = $("#entry_producer").val();
    if(price<0 || amount<0 || desc=="" || name=="" || producer==""){
        alert("Uncorrect data!");
        return;
    }
    $("#backbutton").click();
    $.ajax({
        url: "http://localhost:8889/api/good?description="+desc+"&prodname="+name+"&price="+price+"&amount="+amount+"&groupid="+groupid+"&producer="+producer,
        method: "PUT",
        success: function (json) {
            alert("New group added successfully");
            clickOnGroup(groupid);
        }
    });
}



