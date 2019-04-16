<head>
	<link rel="stylesheet" type="text/css" href="css/re.css">
	<link rel="stylesheet" type="text/css" href="css/messages.css">
	<link rel="stylesheet" type="text/css" href="css/select2-bootstrap.css">
	<link rel="stylesheet" type="text/css" href="css/select2.css">
    <link rel="stylesheet" type="text/css" href="css/top-characters-with-dyes.css">
    <script src="js/messages.js"></script>
    <script src="js/jquery-1.11.2.min.js"></script>
    <script src="js/typeahead.bundle.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.timeago.js"></script>
    <script src="js/jquery.timeago.en-short.js"></script>
    <script src="js/definition.js"></script>
    <script src="js/jquery.tablesorter.js"></script>
    
    
    
    
    <script src="js/advertisement.js"></script>
    <script src="js/underscore-min.js"></script>
    <script src="js/sheet.js"></script>
    <script src="js/characters.js"></script>
    <script src="js/showdown.js"></script>
    <script src="js/sanitize.js"></script>
    <script src="js/sanitize-relaxed.js"></script>
    <script src="js/select2.js"></script>
        <script src="js/realmeye.js"></script>

</head>


<?php
//$homepage = file_get_contents('https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7');
//echo $homepage;

$player = $_GET["player"];


$ch = curl_init();

    // set url
    curl_setopt($ch, CURLOPT_URL, "https://www.realmeye.com/player/$player");

    //return the transfer as a string
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');

    // $output contains the output string
    $output = curl_exec($ch);

    // close curl resource to free up system resources
    curl_close($ch); 
    
    
    echo $output;


echo '<p id="playerBackground">yyyy<p>';
echo '<p id="playerStatsforBot">testtt<p>';

?>

