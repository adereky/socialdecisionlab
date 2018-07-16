<?php
/* creates a compressed zip file */
function create_zip($files = array(),$destination = '',$overwrite = false) {
	//if the zip file already exists and overwrite is false, return false
	if(file_exists($destination) && !$overwrite) { return false; }
	//vars
	$valid_files = array();
	//if files were passed in...
	if(is_array($files)) {
		//cycle through each file
		foreach($files as $file) {
			//make sure the file exists
			if(file_exists($file)) {
				$valid_files[] = $file;
			}
		}
	}
	//if we have good files...
	if(count($valid_files)) {
		//create the archive
		$zip = new ZipArchive();
		if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
			return false;
		}
		//add the files
		foreach($valid_files as $file) {
			$zip->addFile($file,basename($file));
		}
		//debug
		//echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

		//close the zip -- done!
		$zip->close();

		//check to make sure the file exists
		return file_exists($destination);
	}
	else
	{
		return false;
	}
}

$folder = $_GET['folder'];
// $openshift_data_dir = $_ENV["OPENSHIFT_DATA_DIR"];
$openshift_data_dir = '';
$zip = $_GET['zip'];
$files = array_diff(scandir($openshift_data_dir.$folder), array('..', '.'));

function check($fileStr){
	if(substr($fileStr,0,1)=="."){return false;}else{
		return true;
	}
}
$filesChecked = array_filter($files,'check');

function addPaths($fileStr){
	return $_ENV["OPENSHIFT_DATA_DIR"].$_GET['folder'].'/'.$fileStr;
}
$filePaths = array_map('addPaths',$filesChecked);

if ($zip=="True"){
	create_zip($filePaths,'data.zip',true);
};

?>
<html><h1>Downloads</h1>

<ul>
<?php foreach($filePaths as $item){ echo "<li>".$item."</li>";} ?>
</ul>
<?php if(file_exists('data.zip')&&$zip=="True"){echo "<h3><a href='data.zip'>Download as Zip</a></h3>";}?>
</html>
