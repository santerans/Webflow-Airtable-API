const getInfo = (item,data) => {
  //console.log(data);
 // console.log(data['fields']["Nombres"].length);

  item.find('[ftype="text"]').each(function() {
    var elem = $(this);
    var parent = elem.closest('div');
    var field = elem.attr('fname');
    var array = data['fields'][field];
    if(jQuery.type(array)==="array"){
      elem.text(array[0]);
      for (let i = 1; i < array.length; i++) {
        elem.clone().appendTo(parent).text(array[i]); 
      }
    }else if(jQuery.type(array)!=="undefined"){
      elem.text(array);
    }else{
      elem.text('');
    }
  });

  item.find('[ftype="img"]').each(function() {
    var elem = $(this);
    var thumbnails = elem.attr('thumbnail');
    if(thumbnails == null){thumbnails = 'large'}
    var parent = elem.closest('div');
    var field = elem.attr('fname');
    var array = data['fields'][field];
    $(this).remove();
    if(jQuery.type(array)!=="undefined"){
      for (let i = 0; i < array.length; i++) {
        elem.attr('src', array[i]['thumbnails'][thumbnails]['url']);
        elem.clone().prependTo(parent); 
      }
    }
  });

  item.find('[ftype="attachment"]').each(function() {
    var elem = $(this);
    var parent = elem.closest('div');
    var field = elem.attr('fname');
    var array = data['fields'][field];
    var bgimg = elem.attr('bgimg');
    $(this).remove();
    if(jQuery.type(array)!=="undefined"){
      for (let i = 0; i < array.length; i++) {
        elem.attr('href', array[i].url);
        elem.attr('target', "_blank");
        elem.attr('download', true);
        bgimg !== "false" ? elem.attr('style',"background-image: url(" + array[i]['thumbnails']['large']['url'] + ");") : null;
        elem.clone().appendTo(parent);
      }
    }
  });    
        
  item.find('[f-link]').each(function() {
    var elem = $(this);
    var parent = elem.closest('div');
    var field = elem.attr('f-link');
    var array = data['fields'][field];
    if(jQuery.type(array)==="array"){
      elem.attr('href', array[0]);
      for (let i = 1; i < array.length; i++) {
        elem.clone().appendTo(parent).attr('href', array[i]); 
      }
    }else if(jQuery.type(array)!=="undefined"){
      $(this).attr('href', array);
    }
  });

  item.find('[f-attr]').each(function() {
    var elem = $(this);
    var field = elem.attr('f-attr');
    var attrname = elem.attr('a-name');
    var fdata = data['fields'][field];
    var aformula = eval(elem.attr('a-formula'));
    elem.attr(attrname, aformula);
  });

  item.find('input[ftype="input"]').each(function() {
    var elem = $(this);
    var field = elem.attr('fname');
    var array = data['fields'][field];
    elem.attr("value",array);
  });

}

const getRecord = () => {

  $('[ftype="record"]').each(function() {
    const record = $(this);
    const airbase = record.closest('[baseid]').attr('baseid');
    const airtable = record.closest('[tableid]').attr('tableid');
    const recordID = record.attr('recid');
  
    $.ajax({
      url: "https://api.airtable.com/v0/"+airbase+"/"+airtable+"/"+recordID,
      method: "GET",
      headers: {"Authorization": "Bearer keyihoSNsr5Z5PQQx"},
      contentType: 'application/json',
      async: true,
      beforeSend: function(){
        console.log('Antes de enviar record...');
      },
      success: function(data){
        console.log(data);
        getInfo(record,data);
      },
      complete: function(data){
        console.log(`Listo! Se obtuvo: ${data.length} campos`);
      },
      error:function(error){
        console.log(error);
      }
    })
  });
}

const getListRecords = () => {

  $('[ftype="list"]').each(function() {
    const list = $(this);
    const airbase = list.closest('[baseid]').attr('baseid');
    const airtable = list.closest('[tableid]').attr('tableid');
  
    $.ajax({
      url: "https://api.airtable.com/v0/"+airbase+"/"+airtable,
      method: "GET",
      headers: {"Authorization": "Bearer keyihoSNsr5Z5PQQx"},
      contentType: 'application/json',
      async: true,
      beforeSend: function(){
        console.log('Antes de enviar lista...');
      },
      success: function(data){
        console.log(data);
        var listdata = data['records'];
        var item = list.find('[ftype="item"]');
        getInfo(item,listdata[0]);
        item.attr('recid',listdata[0]['id']);
        for (let i = 1; i < listdata.length; i++) {
          console.log(listdata[i]);
          var thisitem = item.clone();
          getInfo(thisitem,listdata[i]);
          thisitem.appendTo(list);
        }
      },
      complete: function(data){
        console.log(`Listo! Se obtuvo: ${data.length} campos`);
      },
      error:function(error){
        console.log(error);
      }
    })
  });
}


const postRecord = () => {

  $('[ftype="button"]').each(function() {
    const button = $(this);
    const airbase = button.closest('[baseid]').attr('baseid');
    const airtable = button.closest('[tableid]').attr('tableid');
    const recordID = button.closest('[recid]').attr('recid');
    const callID = button.attr('callID');
    const type = button. attr('action');
    if(type === "update"){
      var update = true;
      callType = "PATCH";
    }else{
      var update = false;
      callType = "POST";
    }

    button.click(function(){
      var json = createJSON(update,recordID);
      //console.log(json);
      $.ajax({
        url: "https://api.airtable.com/v0/"+airbase+"/"+airtable,
        method: callType,
        headers: {"Authorization": "Bearer keyihoSNsr5Z5PQQx"},
        contentType: 'application/json',
        async: true,
        data: json,
        beforeSend: function(){
          console.log('Antes de enviar lista...');

        },
        success: function(data){
          console.log('listo!');
        },
        complete: function(data){
          console.log(data.length);
        },
        error:function(error){
          console.log(error);
        }
      })
    });
  });
}

const createJSON = (isupdate=false,recid) => {
  var jsonObj = {};
  var records = [];
  var item = {};
  var fields = {};
  $("input[ftype=input]").each(function() {
    var elem = $(this);
    var field = elem.attr("fname");
    item[field] = elem.val().toString();
  });
  if(isupdate){
    fields = {
      "id" : recid,
      "fields" : item,
    };
  }else{
    fields = {
      "fields" : item,
    };
  }
  records.push(fields);
  jsonObj = {
    'records' : records
  };
  return JSON.stringify(jsonObj);
  //console.log(jsonObj);
}

const showLoading = (show=true,callID) => {
    $('[ftype="loading" callID="' + callID + '"]').each(function() {
      
    });
}

$(document).ready(function($){
  $('form').submit(false);
  getRecord();
  getListRecords();
  postRecord();
  
});