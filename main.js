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

    renderPage();
}

function prevPage() {
    page --;
    page = Math.max(page, 0);

    renderPage();
}

$(document).ready(function () {
    for (var i = 0; i < info.length; i++) {
        if (!searched[info[i].indication]) {
            full.push(info[i].indication);
            searched[info[i].indication] = true;
            console.log(info[i].indication);
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
        renderPage();
    }
});

function renderPage() {
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


    document.getElementById("indcount").innerHTML = "Find the latest developments in biopharmaceuticals. Tracking " + keys.length + " indications.";
    document.getElementById("addto").innerHTML = "";
    var pn = "Current Page: " + (page + 1).toString();
    document.getElementById("pagen").innerHTML = pn;
    var vals = [0, 0, 0, 0, 0];

    for (var i = page * 40; i < Math.min(page * 40 + 40, keys.length); i++) {
        var tmp = indicators[keys[i]];
        
        for (var j = 7; j > 2; j--) {
            if (tmp[j] > 0) {
                vals[j - 3]++;
                continue;
            }
        }

        generateRow(keys[i], tmp[1], tmp[2], tmp[3], tmp[4], tmp[5], tmp[6], tmp[7]);
    }

    document.getElementById("1v").innerHTML = vals[0];
    document.getElementById("2v").innerHTML = vals[1];
    document.getElementById("3v").innerHTML = vals[2];
    document.getElementById("4v").innerHTML = vals[3];
    document.getElementById("5v").innerHTML = vals[4];
 
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

    pct.push(test);

    var final = `
    <br>
    <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <h5 class="card-title">` + name + `</h5>
                    <a href="` + link + `" class="card-text">` + desc + `</a>
                </div>
            </div>
            <div class="col-md-8 progress-container">
                <div class="progress active" style="height: 30px; font-size: 1em; font-weight: bold">
                    <div class="progress-bar bg-danger ` + pct.length + `-pc" style="width:0%">` + pc + `</div>
                    <div class="progress-bar bg-warning ` + pct.length + `-p1" style="width:0%">` + p1 + `</div>
                    <div class="progress-bar bg-info ` + pct.length + `-p2" style="width:0%">` + p2 + `</div>
                    <div class="progress-bar bg-standard ` + pct.length + `-p3" style="width:0%">` + p3 + `</div>
                    <div class="progress-bar bg-success ` + pct.length + `-a" style="width:0%">` + a + `</div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("addto").innerHTML += final;
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

