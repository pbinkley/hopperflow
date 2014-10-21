// TODO handle case where items already have ids: display current id so user
//    can confirm the match
var bundlenum;
var bundleid;

var bundlebuttonfontsize;

// wait for the DOM to be loaded
$(document).ready(function () {

// autosubmit image forms on change
// TODO move this to images.js.coffee - it didn't work when I put it there
//    wrapped in "$(document).ready(function () {"
	$(".image_form :input").change(function(){ 
		$(this).closest("form").find(":submit").click()
	});

   bundleid = parseInt($("#bundleid").val());
   bundlenum = parseInt($("#bundlenum").val());
   if (bundlenum > 0)
      $('#bundlebutton').val('End bundle');
   
   $(".page").draggable({
      containment: "document"
   });
   $("#itemcolumn").droppable({
      drop: function (event, ui) {
         ui.draggable.detach();
         movedDiv.appendTo('#itemlist');
         movedDiv.removeAttr("style");
      }
   });
   showcounts();
   
   // make form float with scroll
   // from http://blog.echoenduring.com/2010/11/15/freebie-contained-sticky-scroll-jquery-plugin/
   $('#metadataform').containedStickyScroll({
      unstick: false
   });
   
   // bind 'metadataform' and provide a callback function
   $('#metadataform').ajaxForm(function (responseXML) {
      // callback gets run after item successfully posted
      // get id of posted item
      var itemid = $(responseXML).find("wrapper").attr("id");
      alert("Item posted: " + itemid);
      // remove pages and images of this item
      
      // if this was a repost, there is already a header and list in the posted column
      var itemlist = $('#' + itemid + '-item');
      
      var citation = $('#date').val() + ': ' + $('#creator').val();
      if ($('#addressee').val() != '') citation += ' to ' + $('#addressee').val();
      if ($('#title').val() != '') citation += ', "' + $('#title').val() + '"';
      
      if (itemlist.length == 0) {
         // create item-level h2 and ul
         var a = (document.createElement('a'));
         $(a).html(itemid);
         $(a).attr("href", "javascript:fetchitem(" + itemid + ");");
         var h2 = (document.createElement('h2'));
         $(a).prependTo(h2);
         var ul = (document.createElement('ul'));
         $(ul).attr("class", "pagelist");
         $(ul).attr("id", itemid + "-item");
         var p = (document.createElement('p'));
         $(p).attr("class", "citation");
         $(p).attr("id", itemid + "-citation");
         $(p).html(citation);
         $(ul).prependTo('#postedgroup');
         $(p).prependTo('#postedgroup');
         $(h2).prependTo('#postedgroup');
         itemlist = $('#' + itemid + '-item');
      } else {
         $('#' + itemid + "-citation").html(citation);
      }
      //alert ("list: " + $(itemlist).attr('id'));
      // move pages to item-level ul
      var pages = $('#formlist').find("li.page").detach();
      $(pages).prependTo(itemlist);
      sliderclear();
      //$("#formimages").find("li.image").remove();
      $('#metadataform').each(function () {
         this.reset();
      });
      showcounts();
      // submitting is only possible when form is displayed, so hopperOrForm() will toggle
      // back to hopper view
      hopperOrForm(false);
      bundlebuttonfontsize = $("#bundlebutton").css("font-size");
   });
   $('a.lightbox').lightBox();
   // Select all links with lightbox class
   
   // add toggle function to checkboxes
   // TODO: preload icons
   $("input[type='radio']").change(function () {
      var id = $(this).attr("id");
      // e.g. scan20111016200343_044-right
      var name = $(this).attr("name");
      // e.g. scan20111016200343_044-control
      // chop off -control
      var imageid = name.substring(0, name.length - 8);
      var control = id.substring(imageid.length + 1);
      //alert(imageid + ": " + control);
      var sel = '#' + imageid + "-icon";
      var thumbid = '#' + imageid + '-thumb';
      
      var iconspan = $(sel);
      if ($(this).is(":checked")) {
         var icon;
         if (control == 'right') {
            icon = "Transform-Rotate-90";
            rotateBoth(imageid, 'right');
         } else if (control == 'left') {
            icon = "Transform-Rotate-270";
            rotateBoth(imageid, 'left');
         } else if (control == 'flip') {
            icon = "Transform-Rotate-180";
            rotateBoth(imageid, 'flip');
         } else if (control == 'delete')
         icon = "Delete"; 
         //else if (control == 'adjust')
         //icon = "Transform-Crop-Resize"; 
         else {
            icon = "";
            rotateBoth(imageid, 'asis');
         }
         var html = ""
         if (icon != "")
         html = "<img src=\"/assets/" + icon + ".png\" class=\"icon\"/>";
         iconspan.html(html)
      }
   });
});

// test whether a string ends with another string
function endsWith(str, suffix) {
   return str.indexOf(suffix, str.length - suffix.length) !== - 1;
}

function showcounts() {
   showcount('#hopperlist', '#hoppercount');
   showcount('#itemlist', '#itemcount');
   showcount('#imagelist', '#imagecount');
   showcount('#postedgroup', '#postedcount');
   if (bundlenum != 0)
   $("#bundlecount").html("[" + bundlenum + " of bundle]"); else
   $("#bundlecount").html("");
}

function showcount(l, s) {
   var cl;
   if (l == '#imagelist') {
      cl = 'image'
   } else
   cl = 'page';
   $(s).html($(l).find("li." + cl).length);
}

function hopper2item() {
   //alert("hopper2item");
   // if there are any pages in the hopper from a different home, return them first
   var itemhome = '#hopperlist';
   returnitempages(itemhome);
   
   $("#itemid").val("");
   
   var movedDiv = $('#hopperlist').find(".page").first().detach();
   movedDiv.appendTo('#itemlist');
   // add images to slider
   var pageimage = $(movedDiv).find("li.image").first();
   //alert(pageimage.length);
   $.each(pageimage, function () {
      var i = $(this).attr('id');
      //alert(i);
      slidershow(i, false)
   });
   
   showcounts();
}

function returnitempages(itemhome) {
   // if item home is different, return any pages
   var olditemhome = $('#itemhome').val();
   //alert("Old itemhome: " + olditemhome + "; new itemhome: " + itemhome);
   if ($('#itemhome').val() != itemhome) {
      var movedDiv = $('#itemlist').find(".page").last().detach();
      movedDiv.prependTo($(olditemhome.toString()));
      $('#itemhome').val(itemhome);
      sliderclear();
      showcounts();
   }
}

function item2hopper() {
   var movedDiv = $('#itemlist').find(".page").last().detach();
   movedDiv.prependTo('#hopperlist');
   // TODO remove images from slider
   showcounts();
}

function deletebacks() {
   var backs = $('#itemcolumn').find(".back");
   //alert("backs: " + $(backs).length);
   $.each(backs, function () {
      //
      $(this).find(".delete-control").prop("checked", true);
      $(this).find(".iconspan").html("<img src='/assets/Delete.png' class='icon'/>");
   });
}

function hopperOrForm(isRepost) {
   // formState: true if form is showing, false if hopper is showing
   var hopperOrForm = $("#hopperOrForm");
   var formState = (hopperOrForm.val() == "Show Hopper");
   
   // if form is showing, and this is a repost, we just need to update the imagelist
   if (formState && isRepost) {
      // add page images to slide show
      sliderclear();
      
      $.each($("#itemlist").find('.image'), function () {
         slidershow($(this).attr('id'), true);
      });
   } else {
      // show or hide the hopper, item and form
      $("#hopperlist").toggle("slide");
      $("#itemcolumn").toggle("slide");
      $('#metadataform').toggle("blind");
      $('#itemid-span').html("");
      
      $('#hopperh2').toggle();
      $('#formh2').toggle();
      if (formState) {
      // Time to show hopper
         hopperOrForm.val("Show Form");
         $('#imagecolumn').css("width", 600);
         
         // delete images from slider
         sliderclear();
      } else {
      // Time to show form
         hopperOrForm.val("Show Hopper");
         if (!(isRepost)) {
            // populate fields, unless this is a repost
            // count pages, omitting pages with both images deleted
            var itempages = $("#itemlist").find("li.page");
            var pagecount = 0;
            $.each(itempages, function () {
               var deleted = $(this).find(".delete-control:checked").length;
               // alert($(this).attr("id") + ": " + deleted + " deleted images");
               if (deleted < 2)
               pagecount++;
            });
            
            $("#pages").val(pagecount);
            if ((bundlenum > 0) && ($("#notes").val() == "")) {
               $("#notes").val("No. " + bundlenum + " in a bundle, clipped together.");
            }
         }
         // add page images to slide show
         sliderclear();
         
         $.each($("#itemlist").find('.image'), function () {
            slidershow($(this).attr('id'), true);
         });
         
         $('#imagecolumn').css("width", 1000);
      }
   }
   
   showcounts();
}

function slidershow(id, moveControls) {
   // build li containing full-size image with given id, add it to slider
   // - ignore deleted images, rotate as necessary
   // - moveControls: true if we are displaying the form, and therefore
   //    we want to move the controls div from the thumbnail to the full image
   var d = $("#" + id + "-delete").is(':checked');
   //alert("slidershow: " + id + " " + d);
   if (!(d)) {
      var li = (document.createElement('li'));
      $(li).attr("class", "image");
      if (moveControls)
      	// move controls to slider
      	$('#' + id + '-controls').appendTo(li);
      var img = (document.createElement('img'));
      $(img).attr("src", "../../scan-images/" + fname + "/" + id + ".jpg");
      $(img).attr("id", id + "-full");
      $(img).appendTo(li);
      $(li).appendTo('#imagelist');
      //alert(li);
      //alert($('#imagelist').length);
      var imageid = id + "-full";
      if ($("#" + id + "-right").is(':checked')) {
         rotate(imageid, 'right');
      } else if ($("#" + id + "-flip").is(':checked')) {
         rotate(imageid, 'flip');
      } else if ($("#" + id + "-left").is(':checked')) {
         rotate(imageid, 'left');
      }
   }
}

function rotateBoth(id, direction) {
   // rotate thumb and full image (if any) with given id
   rotate(id + "-thumb", direction);
   rotate(id + "-full", direction);
}

function rotate(id, direction) {
   var image = $('#' + id);
   if (image.length > 0) {
      if (direction == 'right') {
         $(image).rotate(90, 'abs');
      } else if (direction == 'flip') {
         $(image).rotate(180, 'abs');
      } else if (direction == 'left') {
         $(image).rotate(270, 'abs');
      } else if (direction == 'asis') {
         $(image).rotate(0, 'abs');
      }
   }
}

function sliderclear() {
   // remove all images from the slider
   returncontrols();
   $("#imagelist").find("li.image").remove();
}

function returncontrols() {
	// move all controls divs back to the thumbnails
	var controls = $("#imagelist").find("div.controlsholder");
	$.each($(controls), function () {
		id = $(this).attr('id');
		id = id.substr(0, id.lastIndexOf("-controls"));
		$(this).appendTo($("#" + id ));
    });
}

function submititem() {
	returncontrols();     
   // move pages from item to form, so they will be submitted
   var pages = $('#itemlist').find("li.page").detach();
   pages.prependTo('#formlist');
   // increment bundle if any
   if (bundlenum != 0) {
      $("#bundleid").val(bundleid);
      bundlenum++;
      $("#bundlenum").val(bundlenum);
   } else {
      $("#bundleid").val("");
      $("#bundlenum").val("0");
   }
}

function togglebundle() {
   if ($('#bundlebutton').val() == 'Start bundle')
   startbundle(); else
   endbundle();
   showcounts();
}

function startbundle() {
   // bundles begin and end with marker pages
   // the bundle id comes from bundle-new.json
   if (bundlenum == 0) {
      var startbundle = confirm("Start bundle?");
      if (startbundle) {
         $.getJSON('../../bundle-new.json', function (data) {
            bundleid = data.bundle.id;
            //alert("bundleid: " + bundleid);
            bundlenum = 1;
            $('#bundlebutton').css('color', 'red');
            $('#bundlebutton').css('font-size', "200%");
             $('#bundlebutton').fadeTo(1000, 0, function() {fadebundle('End')});
            deletepage();
         });
      }
   } else {
      alert("A bundle is already in progress!");
   }
}

function fadebundle(s) {
            $('#bundlebutton').val(s + ' bundle');
             $('#bundlebutton').fadeTo(1000, 1);
            $('#bundlebutton').css('color', 'black');
            $('#bundlebutton').css('font-size', bundlebuttonfontsize);

}

function endbundle() {
   // bundles begin and end with marker pages
   // we don't post the bundle: it's handled serverside by the bundle field in items
   if (bundlenum != 0) {
      var endbundle = confirm("End bundle?");
      if (endbundle) {
         
         $.getJSON('../../bundle-end.json', function (data) {
            bundleid = data.bundle.id;
            //alert("Closing bundle: " + bundleid);
            bundlenum = 0;
            $('#bundlebutton').css('color', 'red');
            $('#bundlebutton').css('font-size', "200%");
            $('#bundlebutton').fadeTo(1000, 0, function() {fadebundle('Start')});
            deletepage();
         });
      }
   } else {
      alert("No bundle is in progress!");
   }
}
function deletepage() {
   // delete first page from hopper: used for marker pages
   var firstpage = $('#hopperlist').find("li.page").first();
   var images = firstpage.find(".image");
   var pagedeleted = true;
   $.each(images, function () {
      var dc = $(this).find("input.delete-control");
      if (dc.attr("checked") == null)
         pagedeleted = false;
   });
   var deletepage = pagedeleted;
   if (!(deletepage))
      deletepage = confirm("Delete page?");
   if (deletepage) {
      // delete first page in hopper, move images to form with bundle field
      firstpage.slideUp();
      // flag them for deletion
      $.each(images, function () {
         var dc = $(this).find("input.delete-control");
         //alert(dc.attr("id"));
         dc.attr("checked", "true");
         // remove the checked attribute from the "as is" control - not sure why this is necessary
         dc = $(this).find("input.asis-control");
         dc.removeAttr("checked");
      });
      firstpage.detach().prependTo('#formlist');
   }
}

function toggleposted() {
   // show or hide column of posted items
   $("#postedcolumn").toggle("slide");
}

function fetchitem(id) {
   // fetch json for given item, containing current state of metadata and images
   /* Sample json:
   
   
   {"item": {
   "id": 4876,
   "form": {
   "pages": "1",
   "date": "1935-10-06", ...
   },
   "images": [
   { "id": "scan20111113215657_163",
   "adjust": false,
   "delete": false,
   "rotate": "none"}
   ,
   ...
   ]
   }
   }
   */
   $.getJSON('scans-' + id + '.json', function (data) {
      //alert(data.item.id);
      // populate form
      populateForm(data.item.form, "#metadataform", id);
      
      // move pages to item
      // if there are any pages in the hopper from a different home, return them first
      var itemhome = '#' + id + '-item';
      returnitempages(itemhome);
      
      var pages = $('#' + id + '-item').find("li.page").detach();
      $(pages).prependTo('#itemlist');
      
      // show form
      toggleposted();
      hopperOrForm(true);
      $('#itemid-span').html(id);
   });
}

function populateForm(data, form, id) {
   // populate form from json
   // from http://stackoverflow.com/questions/172524/populate-a-form-with-data-from-an-associative-array-with-jquery
   $.each(data, function (name, value) {
      var input = $(":input[name='" + name + "']:not(:button,:reset,:submit,:image)", form);
      input.val((! $.isArray(value) && (input.is(':checkbox') || input.is(':radio')))?[value]: value);
   });
   $('#itemid').val(id);
};
