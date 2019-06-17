let groups=["Herbs&#9880;","Chemicals","Magic Instruments","Spells and curses","Mascots",
    "Live Liquids","Ephemerals","Books","Organics","Containers"];
let products=["Heather","Catnip","Valerian","Chamomile","Bloodroot","Beladonna","Mandrake(root)"];
let prices=["$50","$150","$37","$55","$28","$99","$67"];

function fillGroupLinks(){
    for(let i=0;i<groups.length;i++)
    $("#grouplist").append("<a id='group"+(i)+"' onclick='clickOnGroup("+(i)+")' class='grouplinks btn btn-link btn-sm' href=#grouplist'>"+groups[i]+"</a><br>")

}
function clickOnGroup(groupid) {

    $("#productlist").empty();
    $("#productlist").append("<p class='title'> "+ groups[groupid]+"</p><hr style='margin: 5px;'><button class='btn btn-outline-secondary btn-sm'> +new</button><br>");
    $("#groupinfo").empty();
    $("#groupinfo").append("<button class='btn btn-outline-danger btn-sm delete ' >delete</button>" +
        "<p class='title'> "+ groups[groupid]+"</p><hr style='margin: 5px;'>" +
        "<button class='btn btn-outline-secondary btn-sm edit'> &#9998;</button><br>" +
        "<p>group description here</p><p>Total group price: $200</p><button class='btn btn-outline-info btn-sm'>all group info</button>");
    for(var i=0;i<products.length;i++){
        $("#productlist").append("<a href='#body' class='btn btn-link btn-sm' onclick='clickOnProduct("+(i)+")'>"+products[i]+"</a><br>");
    }

}

function clickOnProduct(productid) {

    $("#productinfo").empty();
    $("#productinfo").append("<button class='btn btn-outline-danger btn-sm delete ' style='left:19%;'>delete</button><p class='title'> "+ products[productid]+"</p><hr style='margin: 5px;'><button class='btn btn-outline-secondary btn-sm edit'>&#9998;</button><a>description</a><br>" +
        "<a> price:"+prices[productid]+"</a><br><a>amount: 10 </a><br><input type='number' class='form-control form-control-sm' min='0'><button class='btn btn-outline-info btn-sm'>sell</button><button class='btn btn-outline-success btn-sm'>buy</button>");


}

function addGroup(){
    $("#groups").empty();
    $("#groups").append("<button onclick='backToGroups()' class='btn btn-light btn-lg  backtogroups'><</button>" +
        "<p class='newgroup'>New group</p><p class='newgroup'>groupname:" +
        "<input type='text' maxlength='20'></p>" +
        "<p class='newgroup'>description:<input type='text' ></p><button style='font-size:26px; padding: 5px 4%' class='btn btn-outline-dark' onclick='newGroup()'>Apply</button>")
}
function newGroup(){
    //called after you give name and description and press "apply"
}
fillGroupLinks();


