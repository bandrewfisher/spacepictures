$(document).ready(function() {
    var pictures = [];
    var curDisplay = 0;
   $("#submit").click(function() {
        var searchTerm = encodeURI($("#search").val());
        var url = "https://images-api.nasa.gov/search?q="
        + searchTerm + "&media_type=image";
        pictures = [];
        curDisplay = 0;
        $("#clickme").click();
      $.ajax({
         url: url,
         dataType: "json",
         success: function(data) {
            if(data.collection.metadata.total_hits == 0) {
                pictures = [{title: "", link: ""}]
                setImage(pictures, 0);
            } else {
                for(var i=0; i<data.collection.items.length; i++){
                    var item = data.collection.items[i];
                    var title = item.data[0].title;
                    var imageLink = item.links[0].href;
                    pictures.push({title: title, link: imageLink});
                    
                    setImage(pictures, 0);
                }
            }
         }
      });
   });
   
   $("#right").click(function() {
        curDisplay++;
        console.log("curDisplay: " + curDisplay);
        if(curDisplay > pictures.length-1) {
            curDisplay = 0;
        }
        setImage(pictures, curDisplay);
   });
   
   $("#left").click(function() {
      curDisplay--;
      if(curDisplay < 0) {
          curDisplay = pictures.length -1;
      }
      setImage(pictures, curDisplay);
   });
   
   $("#search").keyup(function(event) {
      if(event.which == 13) {
          $("#submit").click();
      } 
      event.preventDefault();
   })
   .focus();
   
   $("#apodSubmit").click(function() {
      var date = $("#apodDate").val();
      if(validDate(date)) {
          var api = "7Wtor3PYKXZpLBDO4Vc1mMLZei5yNM7A7BwC6bD3";
          var url = "https://api.nasa.gov/planetary/apod?";
          url += "date="+date;
          url += "&api_key=" + api;
          console.log(url);
          $.ajax({
             url: url,
             dataType: "json",
             success: function(data) {
                 var title = data.title;
                 var explanation = data.explanation;
                 var imgUrl = data.url;
                 $("#apodDiv").html("");
                 $("#apodDiv").append("<center><h1 style='color:red'>" + title + "</h1></center>");
                 if(data.media_type == "video") {
                    $("#apodDiv").append("<iframe src='"+ imgUrl + "' height='400px'class='center'></iframe>")
                 } else {
                     $("#apodDiv").append("<img src='" + imgUrl + "' height='300px' class='center'>");
                 }
                 $("#apodDiv").append("<p style='color:white'>" + explanation + "</p>");
             }
          });
      }
      
   });
});

function validDate(dateString) {
    var dateObj = new Date(dateString);
    var firstDate = new Date("1995-06-16");
    var today = new Date();
    if(dateObj > today || dateObj < firstDate) {
        alert("The date must be after June 16, 1995 and before today.");
        return false;
    }
    return true;
}
function setImage(pictures, index) {
    $("#picture img").attr("src", pictures[index].link);
    $("#picture h1").text(pictures[index].title);
    
    if(pictures[index].title == "") {
        $("#resultCount").text("Showing " + 0 + " of " + 0 + " results.");
    } else {
        $("#resultCount").text("Showing " + (index+1) + " of " + pictures.length + " results.");

    }
}
