
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
            json = decrypt(json);
            $("#totalprice").empty();
            $("#totalprice").append("Total price: $"+json);
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
            json = decrypt(json);
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
            json = decrypt(json);
            json = json.replace(/'/g,'"');
            var obj = JSON.parse(json);
            $("#productlist").empty();
            $("#productlist").append("<p class='title'> "+ obj["groupname"]+"</p><hr style='margin: 5px;'><button onclick='addProduct("+groupid+")' class='btn btn-outline-secondary btn-sm'> +new</button><br>");
            $("#groupinfo").empty();
            $("#groupinfo").append("<p id='groupname_in_prodlist' class='title'> "+ obj["groupname"]+"</p><hr style='margin: 5px;'>" +
                "<button onclick='editGroup("+groupid+","+json+")' class='btn btn-outline-secondary btn-sm edit'> &#9998;</button><br>" +
                "<p style='font-size: 13px;'>"+obj["description"]+"</p><p id='total_group_price_field' style='font-size: 18px;'>Total group price: $"+obj["totalprice"]+"</p><button onclick='getAllGroupInfo("+groupid+")' " +
                "class='btn btn-outline-info btn-sm'>all group info</button><br><br><button onclick='deleteGroup("+groupid+")' class='btn btn-outline-danger btn-sm delete ' >delete</button>");

            $.ajax({
                url: "http://localhost:8889/api/products/"+groupid,
                method: 'GET',
                success: function (json) {
                    json = decrypt(json);
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
function changeGroupProductsList(groupid) {
    var groupname = $("#groupname_in_prodlist").html();
            $("#productlist").empty();
            $("#productlist").append("<p class='title'> "+groupname+"</p><hr style='margin: 5px;'><button onclick='addProduct("+groupid+")' class='btn btn-outline-secondary btn-sm'> +new</button><br>");

            $.ajax({
                url: "http://localhost:8889/api/products/"+groupid,
                method: 'GET',
                success: function (json) {
                    json = decrypt(json);
                    var array = JSON.parse(json);
                    for(var i=0;i<array.length;i++){
                        var ar = array[i].split("#");
                        $("#productlist").append("<a href='#body' class='btn btn-link btn-sm' onclick='clickOnProduct("+ar[1]+")'>"+ar[0]+"</a><br>");
                    }
                }
            });
}

function changeTotalGroupPrice(groupid){
    $.ajax({
        url: "http://localhost:8889/api/price/"+groupid,
        method: 'GET',
        success: function (json) {
           $("#total_group_price_field").empty();
            $("#total_group_price_field").append("Total group price: $"+json+"");
        }
    });
}

$("#allinfo").click(function () {
    $("#messagepanel").show();
    $("#messagebox").empty();
    $.ajax({
        url: "http://localhost:8889/api/allgroups",
        method: 'POST',
        success: function (json) {
            json = decrypt(json);
            var array = json.split("#:#");
            for(var i=0; i<array.length; i++){
                addAllGroupInfoToMessBox(array[i]);
            }
            $("#messagebox").append("<button class='btn btn-info btn-block' onclick='back()'>OK</button>");
        }
    });
});
function getAllGroupInfo(groupid) {
    $("#messagebox").empty();
    $("#messagepanel").show();
    $.ajax({
        url: "http://localhost:8889/api/products/"+groupid,
        method: 'POST',
        success: function (json) {
            json = decrypt(json);
            addAllGroupInfoToMessBox(json);
            $("#messagebox").append("<button class='btn btn-info btn-block' onclick='back()'>OK</button>");
        }
    });
}

function addAllGroupInfoToMessBox(json) {
    json = json.replace(/'/g,'"');
    var obj = JSON.parse(json);
    $("#messagebox").append("<p class='finded_title'>"+obj.groupname+"</p><hr style='margin: 5px;'><p class='alldesc'>"+obj.description+"</p>");
    try {
        var names = obj.prodnames.split('|').join('"');
        names = JSON.parse(names);
        var descs = obj.descriptions.split('|').join('"');
        descs = JSON.parse(descs);
        var prices = obj.prices;
        prices = JSON.parse(prices);
        var amounts = obj.amounts;
        amounts = JSON.parse(amounts);
        var producers = obj.producers.split('|').join('"');
        producers = JSON.parse(producers);
        var ids = JSON.parse(obj.ids);

        for (var i = 0; i < names.length; i++) {
            $("#messagebox").append("<div class='allproduct'><p><span class='all_prodname'>" + names[i].toUpperCase() + "</span> " + prices[i] + "$</p>" +
                "<p class='all_proddesc'>" + descs[i] + "</p><p>In storage: <span class='all_prodam'>" + amounts[i] + "</span> from " +
                "<span class='all_producer'>" + producers[i] + "</span></p></div>");
        }
    }catch(err){
        $("#messagebox").append("<div style='margin: 20px; color: #737373'>No products in this group</div>");
    }
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
            fillTotalPrice();
        }
    });
}
function deleteProduct(prodid) {
    if(!confirm("Do you really want to delete this product?"))
        return;
    $.ajax({
        url: "http://localhost:8889/api/good/"+prodid,
        method: 'DELETE',
        success: function () {
            $("#productinfo").empty();
            sessionStorage.setItem("product","");
            changeGroupProductsList(sessionStorage.getItem("group"));
            changeTotalGroupPrice(sessionStorage.getItem("group"));
            fillTotalPrice();
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
            json = decrypt(json);
            json = json.replace(/'/g,'"');
            var obj = JSON.parse(json);
            $("#productinfo").empty();
            $("#productinfo").append("<p class='title'> "+ obj.prodname+"</p>" +
                "<hr style='margin: 5px;'><button class='btn btn-outline-secondary btn-sm edit' onclick='editProduct("+productid+","+json+")'>&#9998;</button>" +
                "<a style='font-size: 13px'>"+obj.description+"</a>" +
                "<p style='font-size: 18px; margin: 10px;' > Price:$"+obj.price+"<br>Amount: <span id='product_price_field'>"+obj.amount+"</span><br>Producer: "+obj.producer+"<p>" +
                "<input id='change_amount' type='number' style='margin-top: 0px;' class='form-control form-control-sm' min='0'>" +
                "<button onclick='sellProduct("+productid+","+obj.amount+")' class='btn btn-outline-info btn-sm sellbuy'>sell</button><button onclick='buyProduct("+productid+","+obj.amount+")' class='btn btn-outline-success btn-sm sellbuy'>buy</button>" +
                "<br><br><button onclick='deleteProduct("+productid+")' class='btn btn-outline-danger btn-sm delete ' style='left:19%;'>delete</button>");

        }
    });
   }
function changeProductAmount(amount) {
    $("#product_price_field").empty();
    $("#product_price_field").append(amount);
    $("#change_amount").val("");
}
function buyProduct(prodid, amount) {
    var am = $("#change_amount").val();
    if(am=="")
        return;
    am = +amount + +am;
    var query = 'amount='+am;
    query = encrypt(query);
    var url = 'http://localhost:8889/api/products/'+prodid+'?'+query;
    jQuery.ajax({
        url: url,
        method: 'PUT',
        success: function (data) {
            data = decrypt(data);
            changeProductAmount(data);
            changeTotalGroupPrice(sessionStorage.getItem("group"));
            fillTotalPrice();
        }
    });
}
function sellProduct(prodid, amount) {
    var am = $("#change_amount").val();
    if(am=="" || amount-am<0) {
        $("#change_amount").val("");
        return;
    }
    am = +amount + +am*(-1);
    var query = 'amount='+am;
    query = encrypt(query);
    var url = 'http://localhost:8889/api/products/'+prodid+'?'+query;

    jQuery.ajax({
        url: url,
        method: 'PUT',
        success: function (data) {
            data = decrypt(data);
            changeProductAmount(data);
            changeTotalGroupPrice(sessionStorage.getItem("group"));
            fillTotalPrice();
        }
    });
}
function editGroup(groupid, obj) {
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Group name:</span><input id='entry_groupname' type='text' value='"+obj.groupname+"' maxlength='20' class='form-control form-control-sm'>" +
        "<span>Description:</span><input id='entry_groupdesc' type='text' value='"+obj.description+"' style='margin-bottom: 10px;' class='form-control form-control-sm'>" +
        "<a onclick='editGroupInDB("+groupid+")' href='#content' class='btn btn-info btn-block'>Change</a>");

}
function editGroupInDB(groupid) {
    var name = $("#entry_groupname").val();
    var desc = $("#entry_groupdesc").val();
    if(desc=="" || name==""){
        alert("Uncorrect data!");
        return;
    }
    var query = 'id='+groupid;
    query += '&groupname='+name;
    query += '&description='+desc;
    query = encrypt(query);
    $("#backbutton").click();
    var url = 'http://localhost:8889/api/group?'+query;

    jQuery.ajax({
        url: url,
        method: 'POST',
        success: function (data) {
            clickOnGroup(groupid);
            if(sessionStorage.getItem("product")!="")
                clickOnProduct(sessionStorage.getItem("product"));
        }
    });
}
function editProduct(prodid, obj) {
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Product name:</span><input id='entry_prodname' type='text' value='"+obj.prodname+"' class='form-control form-control-sm'maxlength='20'>" +
        "<span>Description:</span><input id='entry_proddesc' type='text' value='"+obj.description+"' style='margin-bottom: 10px;' class='form-control form-control-sm'>" +
        "<span>Price:</span><input id='entry_prodprice' type='number' value='"+obj.price+"' style='margin-bottom: 10px;' class='form-control form-control-sm'>" +
        "<span>Amount:</span><input id='entry_prodamount' type='number' value='"+obj.amount+"' style='margin-bottom: 10px;' class='form-control form-control-sm'>" +
        "<span>Producer:</span><input id='entry_producer' type='text' value='"+obj.producer+"' style='margin-bottom: 10px;' class='form-control form-control-sm'>" +
        "<a onclick='editProductInDB("+prodid+")' href='#content' class='btn btn-info btn-block'>Change</a>");
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
            changeTotalGroupPrice(sessionStorage.getItem("group"));
            clickOnProduct(prodid);
            fillTotalPrice();
        }
    });
}

function addGroup(){
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Group name:</span><input id='entry_groupname' type='text' val='' maxlength='20' class='form-control form-control-sm'>" +
        "<span >Description:</span><input id='entry_groupdesc' type='text' val='' style='margin-bottom: 10px;' class='form-control form-control-sm'>\n" +
        "<a onclick='addGroupToDB()' href='#content' class='btn btn-info btn-sm btn-block '>Add</a>");

}
function addProduct(groupid){
    $("#messagepanel").show();
    $("#messagebox").empty();
    $("#messagebox").append("<span>Product name:</span><input id='entry_prodname' type='text' val='' maxlength='20' class='form-control form-control-sm'>" +
        "<span>Description:</span><input id='entry_proddesc' type='text' val='' style='margin-bottom: 10px;' class='form-control form-control-sm'>\n" +
        "<span>Price:</span><input id='entry_prodprice' type='number' min='1' val='' style='margin-bottom: 10px;' class='form-control form-control-sm'>"+
        "<span>Amount:</span><input id='entry_prodamount' type='number' min='1' val='' style='margin-bottom: 10px;' class='form-control form-control-sm'>"+
        "<span>Producer:</span><input id='entry_producer' type='text' val='' style='margin-bottom: 10px;' class='form-control form-control-sm'>"+
        "<a onclick='addProductToDB("+groupid+")' href='#content' class='btn btn-info btn-sm btn-block '>Add</a>");
}


function back() {
    $("#messagepanel").hide();
    $("#messagebox").empty();
}

function addGroupToDB() {
    var name = $("#entry_groupname").val();
    var desc = $("#entry_groupdesc").val();
    if(desc=="" || name==""){
        alert("Uncorrect data!");
        return;
    }
    $("#backbutton").click();

    var query = "description="+desc+"&groupname="+name;
    query = encrypt(query);
    $.ajax({
        url: "http://localhost:8889/api/group?"+query,
        method: "PUT",
        success: function (json) {
            if(decrypt(json)=="true") {
                alert("New group added successfully");
                fillGroupLinks();
            }else alert("Group with such name already exist");
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
    var query = "description="+desc+"&prodname="+name+"&price="+price+"&amount="+amount+"&groupid="+groupid+"&producer="+producer;
    query = encrypt(query);
    $.ajax({
        url: "http://localhost:8889/api/good?"+query,
        method: "PUT",
        success: function (json) {
            if(decrypt(json)=="true") {
                alert("New group added successfully");
                changeGroupProductsList(groupid);
                fillTotalPrice();
                changeTotalGroupPrice(sessionStorage.getItem("group"));
            } else alert("Group with such name already exist");

        }
    });
}

