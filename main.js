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

$(document).ready(function () {
    for (var i = 0; i < info.length; i++) {
        info[i].stage = stagebeautify[info[i].stage];

        if (namedict[info[i].name] != 1) {
            namedict[info[i].name] = 1;
            $('#name').append("<option value='" + info[i].name + "'>" + info[i].name + "</option>");
        }

        if (companydict[info[i].company] != 1) {
            companydict[info[i].company] = 1;
            $("#company").append("<option value='" + info[i].company + "'>" + info[i].company + "</option>");
        }

        if (indicatedict[info[i].indication] != 1) {
            indicatedict[info[i].indication] = 1;
            $("#indication").append("<option value='" + info[i].indication + "'>" + info[i].indication + "</option>");
        }

        if (stagedict[info[i].stage] != 1) {
            stagedict[info[i].stage] = 1;
            $("#stage").append("<option value='" + info[i].stage + "'>" + info[i].stage + "</option>");
        }

        print(info[i]);
    }

    $('select').selectize({
        sortField: 'text'
    });
});

function print(obj) {
    $(table).find('tbody').append("<tr><td>" + obj.name + "</td><td>" + obj.company + "</td><td>" +
        obj.indication + "</td><td>" + obj.stage + "</td><td><a href='" +
        obj.newslink + "'>" + obj.newstxt + "</a></td></tr>");
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