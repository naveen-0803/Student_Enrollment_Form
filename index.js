var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stdDBName = "SCHOOL-DB";
var stdRelationName = "STUDENT-TABLE";
var connToken = "90934969|-31949250819536592|90959106";

$("#rollno").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj() {
    var rollno = $("#rollno").val();
    var jsonStr = {
        id : rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stdname").val(record.stdname);
    $("#stdclass").val(record.stdclass);
    $("#bdate").val(record.bdate);
    $("#address").val(record.address);
    $("#enrolldate").val(record.enrolldate);
}

function resetForm() {
    $("#rollno").val("");
    $("#stdname").val("");
    $("#stdclass").val("");
    $("#bdate").val("");
    $("#address").val("");
    $("#enrolldate").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}

function validateData() {
    var rollno, stdname, stdclass, bdate, address, enrolldate;
    rollno = $("#rollno").val();
    stdname = $("#stdname").val();
    stdclass = $("#stdclass").val();
    bdate = $("#bdate").val();
    address = $("#address").val();
    enrolldate = $("#enrolldate").val();

    if (rollno == '') {
        alert("Roll-Number is missing");
        $("#rollno").focus();
        return "";
    }
    if (stdname == '') {
        alert("Student Name is missing");
        $("#stdname").focus();
        return "";
    }
    if (stdclass == '') {
        alert("Student Class is missing");
        $("#stdclass").focus();
        return "";
    }
    if (bdate == '') {
        alert("Birth-Date is missing");
        $("#bdate").focus();
        return "";
    }
    if (address == '') {
        alert("Address is missing");
        $("#address").focus();
        return "";
    }
    if (enrolldate == '') {
        alert("Enrollment-Date is missing");
        $("#enrolldate").focus();
        return "";
    }

    var jsonStrObj = {
        id: rollno,
        stdname: stdname,
        stdclass: stdclass,
        bdate: bdate,
        address: address,
        enrolldate: enrolldate
    };
    return JSON.stringify(jsonStrObj);
}

function getStd() {
    var rollNOJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stdDBName, stdRelationName, rollNOJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status == 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stdname").focus();

    } else if (resJsonObj.status == 200) {

        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stdname").focus();

    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj == "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stdDBName, stdRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollno").focus();
}

function updateData() {
    $("#update").prop("disabled", true);
    var jsonchg = validateData();

    var recno = localStorage.getItem("recno");
    if (!recno) {
        alert("Record number not found. Please re-enter Roll-No.");
        return;
    }

    var updateRequest = createUPDATERecordRequest(connToken, jsonchg, stdDBName, stdRelationName, recno);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 200) {
        alert("Record updated successfully!");
    } else {
        alert("Failed to update record.");
        console.error(resJsonObj);
    }

    resetForm();
    $("#rollno").focus();
}
