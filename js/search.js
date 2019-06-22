$("#search_button").click(function () {

    var search = $("#search_field").val();
    search = search.toLowerCase();

    if(search=="") return;
    $("#search_field").val("");
    var query = 'search='+search;
    query = encrypt(query);
    var url = 'http://localhost:8889/api/allgroups?'+query;
    jQuery.ajax({
        url: url,
        method: 'PUT',
        success: function (json) {
            json = decrypt(json);
            json = json.replace(/'/g,'"');
            var obj = JSON.parse(json);
            var groupids = obj.groupids;
            var groupnames = obj.groupnames.split('|').join('"');
            var groupdescriptions = obj.groupdescriptions.split('|').join('"');
            var productdescriptions = obj.productdescriptions.split('|').join('"');
            var productnames = obj.productnames.split('|').join('"');
            var productids = obj.productids;
            var productgroupsid = obj.productgroupsid;
            var productproducer = obj.productproducers.split('|').join('"');
            $("#messagepanel").show();
            $("#messagebox").empty();

            groupnames = groupnames.toUpperCase();
            groupdescriptions = groupdescriptions.toLowerCase();
            productnames = productnames.toUpperCase();
            productdescriptions = productdescriptions.toLowerCase();
            productproducer = productproducer.toUpperCase();

            groupdescriptions = groupdescriptions.split(search).join("<span class='highsearch_part'>"+search+"</span>");
            productdescriptions = productdescriptions.split(search).join("<span class='highsearch_part'>"+search+"</span>");
            search = search.toUpperCase();

            groupnames = groupnames.split(search).join("<span class='highsearch_part'>"+search.toUpperCase()+"</span>");
            productnames = productnames.split(search).join("<span class='highsearch_part'>"+search.toUpperCase()+"</span>");
            productproducer = productproducer.split(search).join("<span class='highsearch_part'>"+search.toUpperCase()+"</span>");
            fillMessBoxWithGroups(groupids,groupnames,groupdescriptions);

            fillMessBoxWithProducts(productids,productnames,productdescriptions,productproducer,productgroupsid);
        }
    });
});

function fillMessBoxWithGroups(groupids,groupnames,groupdescriptions) {
    groupids = JSON.parse(groupids);
    groupnames = JSON.parse(groupnames);
    groupdescriptions= JSON.parse(groupdescriptions);

    $("#messagebox").append("<p class='finded_title'>Finded groups:</p><hr style='margin: 5px;'><div>");
    for(var i=0;i<groupids.length; i++){
        $("#messagebox").append("<span class='finded_group'><div onclick='openFindedGroup("+groupids[i]+")'><p class='find_name'>"+groupnames[i]+"</p>"+groupdescriptions[i]+"</div></span>");
    }
    $("#messagebox").append("</div>");
}

function openFindedGroup(id) {
    clickOnGroup(id);
    $("#backbutton").click();
}

function fillMessBoxWithProducts(productids,productnames,productdescriptions,productproducer,productgroupsid) {
    productids = JSON.parse(productids);
    productnames = JSON.parse(productnames);
    productdescriptions = JSON.parse(productdescriptions);
    productproducer = JSON.parse(productproducer);
    productgroupsid = JSON.parse(productgroupsid);

    $("#messagebox").append("<hr style='margin: 5px;'><p class='finded_title'>Finded products:</p><hr style='margin: 5px;'><div>");
    for(var i=0;i<productids.length; i++){
        $("#messagebox").append("<span class='finded_group'><div onclick='openFindedProducts("+productids[i]+","+productgroupsid[i]+")'><p class='find_name'>"+productnames[i]+"</p>"+productdescriptions[i]+"\n" +
            "<span class='finded_producer_title'>Producer: </span>"+productproducer[i]+"</div></span>");
    }
    $("#messagebox").append("</div>");
}

function openFindedProducts(id, groupid) {
    clickOnGroup(groupid);
    clickOnProduct(id);
    $("#backbutton").click();
}

























