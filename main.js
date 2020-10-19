//console.log(data)

var json = data.replace("\n", "");

var info = JSON.parse(json);

var table = document.getElementById("list");

var namedict = {};
var companydict = {};
var indicatedict = {};
var stagedict = {};

var stagebeautify = {
    "approved": "Approved",
    "phase3": "Phase 3",
    "phase2": "Phase 2",
    "crl": "CRL",
    "phase23": "Phase 2/3",
    "sndaFiling": "sNDA Filing",
    "pdufa": "PDUFA",
    "phase1.5": "Phase 1/2",
    "phase1": "Phase 1",
    "phase2b": "Phase 2b",
    "ndaFiling": "NDA Filing",
    "phase1b": "Phase 1b",
    "phase2a": "Phase 2a",
    "blaFiling": "BLA Filing",
    "pdufaPriorityReview": "PDUFA priority review",
    "phase1a": "Phase 1a"
};

var stagesimplify = {
    "approved": 7,
    "phase3": 6,
    "phase2": 5,
    "crl": 6,
    "phase23": 5,
    "sndaFiling": 3,
    "pdufa": 6,
    "phase1.5": 4,
    "phase1": 4,
    "phase2b": 5,
    "ndaFiling": 3,
    "phase1b": 4,
    "phase2a": 5,
    "blaFiling": 3,
    "pdufaPriorityReview": 3,
    "phase1a": 4
}

var indicators = {};
var keys = [];
var full = [];
var searched = {};

var pct = [];

var page = 0;

function nextPage() {
    page ++;

    if (page >= Math.floor(keys.length / 40) ) {
        page = Math.floor(keys.length / 40);
    }
    else {
        renderPage();
    }

    
}

function prevPage() {
    page --;
    if (page < 0) {
        page = 0;
    }
    else {
        renderPage();
    }
}

$(document).ready(function () {
    for (var i = 0; i < info.length; i++) {
        while (info[i].indication.charAt(0) == ' ') {
            info[i].indication = info[i].indication.substring(1);
        }

        while (info[i].indication.charAt(info[i].indication.length - 1) == ' ') {
            info[i].indication = info[i].indication.substring(0, info[i].indication.length - 1);
        }

        if (!searched[info[i].indication]) {
            full.push(info[i].indication);
            searched[info[i].indication] = true;
            // console.log(info[i].indication);
            indicators[info[i].indication] = [info[i].indication, info[i].newstxt, info[i].newslink, 0, 0, 0, 0, 0];
        }

        indicators[info[i].indication][stagesimplify[info[i].stage]]++;
    }

    // $('select').selectize({
    //     sortField: 'text'
    // });

    // generateRow("Covid-19", "testdec", "", 15, 29, 19, 9, 0);
    // generateRow("Shrunken PP", "eddie", "", 2, 1, 3, 1, 20);

    renderPage();

    // setTimeout( () => { $(".1-pc").css('width', '71%') }, 1000);
    // setTimeout( () => { $(".bg-warning").css('width', '14%') }, 2000);
    // setTimeout( () => { $(".bg-success").css('width', '9%') }, 3000);
    // setTimeout( () => { $(".bg-info").css('width', '4%') }, 4000);
    // setTimeout( () => { $(".bg-standard").css('width', '0%') }, 5000);

});

document.getElementById("indsearch").addEventListener("keydown", function (e) {
    if (e.key == 'Enter') {
        page = 0;
        renderPage();
    }
});

function renderInd(name) {
    document.getElementById("selected").innerHTML = "< " + name;

    document.getElementById("addto").innerHTML = "";
    var pn = "Current Page: " + (page + 1).toString();
    document.getElementById("pagen").innerHTML = pn;
    var vals = [0, 0, 0, 0, 0];

    var cr = 0;

    var sorting = [];

    for (var i = 0; i < info.length; i++) {
        if (cr > 40) {
            break;
        }

        if (info[i].indication == name) {
            cr++;

            sorting.push(info[i]);
        }
    }

    sorting.sort(function(a, b) {
        return stagesimplify[b.stage] - stagesimplify[a.stage];
    });

    for (var i = 0; i < Math.min(sorting.length, 40); i++)  {
        var ind = stagesimplify[sorting[i].stage] - 3;

        vals[ind]++;

        var final = `
        <br>
        <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <h5 class="card-title">` + sorting[i].name + `</h5>
                        <p class="card-text">` + sorting[i].company + `</p>
                        <button type="button" class="btn btn-sm ` + stylec[ind] + `" data-toggle="tooltip" data-placement="top" title="` + cdesc[ind] + `">
                        ` + ctext[ind] + `
                        </button>
                        <a href="` + sorting[i].newslink + `" class="card-text">` + sorting[i].newstxt + `</a>
    
                    </div>
                </div>
                <div class="col-md-8 progress-container">
                    <div class="progress active" style="height: 30px; font-size: 1em; font-weight: bold">
                        <div class="progress-bar bg-pc" style="width:20%"></div>`
        
        if (ind > 0) {
            final += `<div class="progress-bar bg-p1" style="width:20%"></div>`;
        }

        if (ind > 1) {
            final += `<div class="progress-bar bg-p2" style="width:20%"></div>`;
        }

        if (ind > 2) {
            final += `<div class="progress-bar bg-p3" style="width:20%"></div>`;
        }

        if (ind > 3) {
            final += `<div class="progress-bar bg-a" style="width:20%"></div>`;
        }

        final += `</div>
                </div>
            </div>
        `;
    
        document.getElementById("addto").innerHTML += final;
    }

    document.getElementById("1v").innerHTML = vals[0];
    document.getElementById("2v").innerHTML = vals[1];
    document.getElementById("3v").innerHTML = vals[2];
    document.getElementById("4v").innerHTML = vals[3];
    document.getElementById("5v").innerHTML = vals[4];

    var all = document.getElementsByClassName("tot");

    for (var i = 0; i < all.length; i++) {
        all[i].innerHTML = "Total";
    }
    
    $('[data-toggle="tooltip"]').tooltip()
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

function renderPage() {
    document.getElementById("selected").innerHTML = "";
    keys = [];
    if (document.getElementById("indsearch").value == "" || document.getElementById("indsearch").value == " ") {
        keys = full;
    }
    else {
        for (var i = 0; i < full.length; i++) {
            if (full[i].toLowerCase().includes(document.getElementById("indsearch").value.toLowerCase())) {
                keys.push(full[i]);
            }
        }
    }


    //document.getElementById("indcount").innerHTML = "Find the latest developments in biopharmaceuticals. Tracking " + keys.length + " indications.";
    document.getElementById("addto").innerHTML = "";
    var pn = "Current Page: " + (page + 1).toString();
    document.getElementById("pagen").innerHTML = pn;
    var vals = [0, 0, 0, 0, 0];

    for (var i = page * 40; i < Math.min(page * 40 + 40, keys.length); i++) {
        var tmp = indicators[keys[i]];
        
        for (var j = 7; j > 2; j--) {
            if (tmp[j] > 0) {
                vals[j - 3] += tmp[j];
            }
        }

        generateRow(keys[i], tmp[1], tmp[2], tmp[3], tmp[4], tmp[5], tmp[6], tmp[7]);
    }

    if (document.getElementById("indsearch").value == "" || document.getElementById("indsearch").value == " ") {
        document.getElementById("1v").innerHTML = "";
        document.getElementById("2v").innerHTML = "";
        document.getElementById("3v").innerHTML = "";
        document.getElementById("4v").innerHTML = "";
        document.getElementById("5v").innerHTML = "";

        var all = document.getElementsByClassName("tot");

        for (var i = 0; i < all.length; i++) {
            all[i].innerHTML = "";
        }
    }
    else {
        document.getElementById("1v").innerHTML = vals[0];
        document.getElementById("2v").innerHTML = vals[1];
        document.getElementById("3v").innerHTML = vals[2];
        document.getElementById("4v").innerHTML = vals[3];
        document.getElementById("5v").innerHTML = vals[4];

        var all = document.getElementsByClassName("tot");

        for (var i = 0; i < all.length; i++) {
            all[i].innerHTML = "Total";
        }
    }

    
 
    for (var i = 0; i < pct.length; i++) {
        var pcc = "." + (i + 1).toString() + "-pc";
        var pcv = pct[i][0].toString() + '%';
        $(pcc).css('width', pcv);

        pcc = "." + (i + 1).toString() + "-p1";
        pcv = pct[i][1].toString() + '%';
        $(pcc).css('width', pcv);
        

        pcc = "." + (i + 1).toString() + "-p2";
        pcv = pct[i][2].toString() + '%';
        $(pcc).css('width', pcv);

        pcc = "." + (i + 1).toString() + "-p3";
        pcv = pct[i][3].toString() + '%';
        $(pcc).css('width', pcv);

        pcc = "." + (i + 1).toString() + "-a";
        pcv = pct[i][4].toString() + '%';
        $(pcc).css('width', pcv);
    }

    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

function print(obj) {
    $(table).find('tbody').append("<tr><td>" + obj.name + "</td><td>" + obj.company + "</td><td>" +
        obj.indication + "</td><td>" + obj.stage + "</td><td><a href='" +
        obj.newslink + "'>" + obj.newstxt + "</a></td></tr>");
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

var stylec = ["bg-pc", "bg-p1", "bg-p2", "bg-p3", "bg-a"];
var ctext = ["Pre-clinical", "Phase 1 ", "Phase 2", "Phase 3", "Approved"];

var cdesc = ["Pre-clinical: No vaccines/treatments under this category have begun human trials.",
"Phase 1: The vaccines/treatments under this category have begun initial safety trials.",
"Phase 2: The second phase includes testing in expanded safety trials.",
"Phase 3: The vaccines/treatments in this category are undergoing large-scaling testing.",
"Approved: Vaccines approved for general use which have passed the New Drug Application (NDA)"
];

function generateRow(name, desc, link, pc, p1, p2, p3, a) {
    var tot = pc + p1 + p2 + p3 + a;

    // var test = [
    //     Math.floor(pc * 100 / tot),
    //     Math.floor(p1 * 100 / tot),
    //     Math.floor(p2 * 100 / tot),
    //     Math.floor(p3 * 100 / tot),
    //     Math.floor(a * 100 / tot)
    // ];

    var test = [
        pc * 100.0 / tot,
        p1 * 100.0 / tot,
        p2 * 100.0 / tot,
        p3 * 100.0 / tot,
        a * 100.0 / tot
    ];

    var ind = 0;

    for (var i = 4; i > 0; i--) {
        if (test[i] > 0) {
            ind = i;
            break;
        }
    }

    pct.push(test);

    var final = `
    <br>
    <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <h5 class="card-title"><a href="javascript:renderInd('` + name + `')" style="color: #000">` + name + ` ></a></h5>
                    <button type="button" class="btn btn-sm ` + stylec[ind] + `" data-toggle="tooltip" data-placement="top" title="` + cdesc[ind] + `">
                    ` + ctext[ind] + `
                    </button>
                    <a href="` + link + `" class="card-text">` + desc + `</a>

                </div>
            </div>
            <div class="col-md-8 progress-container">
                <div class="progress active" style="height: 30px; font-size: 1em; font-weight: bold">
                    <div class="progress-bar bg-pc ` + pct.length + `-pc" style="width:0%">` + pc + `</div>
                    <div class="progress-bar bg-p1 ` + pct.length + `-p1" style="width:0%">` + p1 + `</div>
                    <div class="progress-bar bg-p2 ` + pct.length + `-p2" style="width:0%">` + p2 + `</div>
                    <div class="progress-bar bg-p3 ` + pct.length + `-p3" style="width:0%">` + p3 + `</div>
                    <div class="progress-bar bg-a ` + pct.length + `-a" style="width:0%">` + a + `</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("addto").innerHTML += final;

    $('[data-toggle="tooltip"]').tooltip();
}

function filter() {
    document.getElementById("list").innerHTML = `<tbody><tr>
    <th>Name</th>
    <th>Company</th>
    <th>Indication</th>
    <th>Stage</th>
    <th>Sort By</th>
    </tr></tbody>`;

    var newinfo = [];

    var n = document.getElementById("name");
    var name = n.options[n.selectedIndex].value;

    var c = document.getElementById("company");
    var company = c.options[c.selectedIndex].value;

    var ind = document.getElementById("indication");
    var indication = ind.options[ind.selectedIndex].value;

    var s = document.getElementById("stage");
    var stage = s.options[s.selectedIndex].value;

    for (var i = 0; i < info.length; i++) {
        if (company == "" || info[i].company == company) {
        if (indication == "" || info[i].indication == indication) {
        if (stage == "" || info[i].stage == stage) {
        if (name == "" || info[i].name == name) {
            newinfo.push(info[i]);
        }}}}
    }

    var sort = document.getElementById("sort");
    var so = s.options[s.selectedIndex].value;

    if (so == "Company") {
        array.sort(function(a, b) {
            if (a.company < b.company) {
              return -1;
            }
            if (a.company > b.company) {
              return 1;
            }
            return 0;
          });
    }

    if (so == "Name") {
        array.sort(function(a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
    }

    for (var j = 0; j < newinfo.length; j++) {
        print(newinfo[j]);
    }
}

