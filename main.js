let groups=["Herbs&#9880;","Chemicals","Magic Instruments","Spells and curses","Mascots",
    "Live Liquids","Ephemerals","Books","Organics","Containers"];
let products=["Heather","Catnip","Valerian","Chamomile","Bloodroot","Beladonna","Mandrake(root)"];
let prices=["$50","$150","$37","$55","$28","$99","$67"];

function fillGroupLinks(){
   // $("#groups").append(" <button onclick='addGroup()' class='btn btn-outline-dark btn-lg addgroup'>+</button>");
    for(let i=0;i<groups.length;i++)
    $("#grouplist").append("<a id='group"+(i)+"' onclick='clickOnGroup("+(i)+")' class='grouplinks' href=#grouplist'>"+groups[i]+"</a><br>")

}
function clickOnGroup(groupid) {

    $("#productlist").empty();
    $("#productlist").append("<p class='title'> "+ groups[groupid]+"</p><hr style='margin: 5px;'><button> add product</button><br>");
    $("#groupinfo").empty();
    $("#groupinfo").append("<p class='title'> "+ groups[groupid]+"</p><hr style='margin: 5px;'><button> edit group</button><br><p>group description here</p>");
    for(var i=0;i<products.length;i++){
        $("#productlist").append("<a href='#productlist' onclick='clickOnProduct("+(i)+")'>"+products[i]+"</a><br>");
    }

}

function clickOnProduct(productid) {

    $("#productinfo").empty();
    $("#productinfo").append("<p class='title'> "+ products[productid]+"</p><hr style='margin: 5px;'><button>edit product</button><a>description</a><br>" +
        "<a> price:"+prices[productid]+"</a><br><a>amount: 10 </a><br><button>sell</button><button>buy</button>");


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


